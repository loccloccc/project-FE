let listUserRegister = JSON.parse(localStorage.getItem("users")) || [];
let monthCategory = JSON.parse(localStorage.getItem("monthCategory")) || [];
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];
let monthlyReports = JSON.parse(localStorage.getItem("monthlyReports")) || [];
let statistical = JSON.parse(localStorage.getItem("statistical"))||[];
//
let monthYear = document.getElementById("month");
let budget = document.getElementById("money");
let res;
let currentPage = 1;
let itemsPerPage = 4;
let saveIdEdit;
let newNameCategory; 
let newMoneyCategory;
let idCategoryDelete;
let idDeleteHistory;
//
function save() {
  if(monthYear.value==""){
    Swal.fire({
      position: "top-center",
      icon: "warning",
      title: "Bạn chưa chọn nhày tháng",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }
  else if (budget.value == "") {
    Swal.fire({
      position: "top-center",
      icon: "warning",
      title: "Hãy điền số tiền tháng này",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  } else {
    document.getElementsByClassName("money-initial")[0].innerHTML = Number(budget.value).toLocaleString();
    document.getElementsByClassName("money-initial")[0].style.color="rgba(34, 197, 94, 1)";
    document.getElementsByClassName("currency-unit")[0].style.color="rgba(34, 197, 94, 1)";
  }
};
renderStatistical();

//thêm danh mục
let nameInput = document.getElementById("nameCategory");
let moneyInput = document.getElementById("moneyCategory");
function addCategory() {
  if (!nameInput.value.trim() || !moneyInput.value.trim()) {
    Swal.fire({
      position: "top-center",
      icon: "warning",
      title: "Hãy điền đầy đủ thông tin",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }else if(!(Number(moneyInput.value.trim())) || Number(moneyInput.value.trim()) <= 0 ){
    Swal.fire({
      position: "top-center",
      icon: "warning",
      title: "Hãy nhập đúng định dạng tiền",
      showConfirmButton: false,
      timer: 1500,
    });
    moneyInput.value="";
    return;
  } 
  else {
    //lấy giá trị tiền từ HTML
    let budgetHTML = document.getElementsByClassName("money-initial")[0].innerHTML;
    let check = budgetHTML.split("");
    for(let i = 0 ; i < check.length ; i++){
      if(check[i]=="."){
        check.splice(i,1);
      }
    }
    // Trừ đi ngân sách còn lại
    let money = Number(check.join(""));
    let money2 = Number(moneyInput.value);
    res = money - money2;
    document.getElementsByClassName("money-initial")[0].innerHTML = Number(res).toLocaleString();
    // đảm bảo hiển thị số âm nếu chi tiêu vượt ngân sách
    if (Number(res) < 0) {
      document.getElementsByClassName("money-initial")[0].style.color = "red";
      document.getElementsByClassName("currency-unit")[0].style.color = "red";
    }
    // tìm id lớn nhất
    let maxId = 0;
    for (let i = 0; i < monthCategory.length; i++) {
      for (let j = 0; j < monthCategory[i].categories.length; j++) {
        if (maxId < monthCategory[i].categories[j].id) {
          maxId = monthCategory[i].categories[j].id;
        }
      }
    }
    // thêm
    let categories = {
      id: maxId + 1,
      name: nameInput.value,
      amount: moneyInput.value,
    };
    //kiểm tra tháng
    let existingMonth = monthCategory.findIndex((i) => i.month === month.value);
    if (existingMonth !== -1) {
      monthCategory[existingMonth].categories.push(categories);
    } else {
      monthCategory.push({
        id:monthCategory.length>0?monthCategory[monthCategory.length-1].id+1:1,
        month: month.value,
        categories: [categories],
        amount:Number(budget.value)
      });
    }
    // Lưu vào localStorage
    localStorage.setItem("monthCategory", JSON.stringify(monthCategory));
    //
    nameInput.value = "";
    moneyInput.value = "";
    budget.value="";
  }
  //hiển thị danh mục theo tháng
  // Hiển thị ra giao diện
  renderCategories();
  renderSelectCategory(monthCategory);
}
// Hàm hiển thị danh mục
function renderCategories() {
  let str = "";
  for(let i = 0 ; i < monthCategory.length ; i++){
    if (monthCategory[i].month == monthYear.value){
      for(let j =0; j < monthCategory[i].categories.length ; j++){
        str += `
        <div class="manager-content-small">
          <span class="content">
            <p class="renderNameCategory">${monthCategory[i].categories[j].name}</p> - Giới hạn 
            <p class="renderMoneyCategory">${Number(monthCategory[i].categories[j].amount).toLocaleString()}</p> VND
          </span>
          <div class="manager-content-button">
            <button onclick="editCategory(${monthCategory[i].categories[j].id})">Sửa</button>
            <button onclick="deleteCategory(${monthCategory[i].categories[j].id})">Xóa</button>
          </div>
        </div>
      `;
      }
    }  
  }

  // Cập nhật nội dung vào giao diện
  document.getElementsByClassName("manager-content")[0].innerHTML = str;
}
//xóa danh mục
function deleteCategory(index) {
  document.getElementsByClassName("confirm-delete-category")[0].style.display="block";
  document.getElementsByClassName("Bgr-fix-and-logout")[0].style.display="block";
  idCategoryDelete=index;  
}
  //đòng ý xóa
function confirmDeleteCategory(){
  for (let i = 0; i < monthCategory.length; i++) {
    for (let j = 0; j < monthCategory[i].categories.length; j++) {
      if (monthCategory[i].categories[j].id === idCategoryDelete) {
        monthCategory[i].categories.splice(j, 1);
        localStorage.setItem("monthCategory", JSON.stringify(monthCategory));
        renderCategories();
      }
    }
  }
  cancelDeleteCategory();
}
//hủy xóa
function cancelDeleteCategory(){
  document.getElementsByClassName("confirm-delete-category")[0].style.display="none";
  document.getElementsByClassName("Bgr-fix-and-logout")[0].style.display="none";
}
// Hàm sửa danh mục
function editCategory(index) {
  // lấy dữ liệu mới của danh mục và tiền
  newNameCategory = document.getElementById("fix-name");
  newMoneyCategory = document.getElementById("fix-money");
  document.getElementsByClassName("fix-category")[0].style.display = "block";
  document.getElementsByClassName("Bgr-fix-and-logout")[0].style.display = "block";
  for (let i = 0; i < monthCategory.length; i++) {
    for (let j = 0; j < monthCategory[i].categories.length; j++) {
      if (monthCategory[i].categories[j].id === index) {
        saveIdEdit = index;
        newNameCategory.value = monthCategory[i].categories[j].name;
        newMoneyCategory.value = monthCategory[i].categories[j].amount;
      }
    }
  }
}

// Hàm lưu thay đổi 
function fixSave() {
  // Kiểm tra và cập nhật thông tin danh mục
  if(newMoneyCategory.value=="" || newNameCategory.value==""){
    Swal.fire({
      position: "top-center",
      icon: "warning",
      title: "Hãy điền đầy đủ thông tin bạn muốn sửa đổi",
      showConfirmButton: false,
      timer: 1500,
    });
  return;
  }
  else if(!Number(newMoneyCategory.value) || Number(newMoneyCategory.value) < 0){
    Swal.fire({
      position: "top-center",
      icon: "warning",
      title: "Hãy nhập số tiền bạn muốn sửa",
      showConfirmButton: false,
      timer: 1500,
    });
  return;
  }
  else{
    for (let i = 0; i < monthCategory.length; i++) {
      for (let j = 0; j < monthCategory[i].categories.length; j++) {
        if (monthCategory[i].categories[j].id === saveIdEdit) {
          monthCategory[i].categories[j].name = newNameCategory.value;
          monthCategory[i].categories[j].amount = newMoneyCategory.value;
          // lưu local
          localStorage.setItem("monthCategory", JSON.stringify(monthCategory));
          // Hiển thị 
          renderCategories();
          // Đóng
          document.getElementsByClassName("fix-category")[0].style.display = "none";
          document.getElementsByClassName("Bgr-fix-and-logout")[0].style.display = "none";
          newNameCategory.value = "";
          newMoneyCategory.value = "";
          return;
        }
      }
    }
  }
}
//hàm hủy thay đổi
function fixCancel(){
  document.getElementsByClassName("fix-category")[0].style.display = "none";
  document.getElementsByClassName("Bgr-fix-and-logout")[0].style.display = "none";
}
// sự kiện thay đổi tháng
document.getElementById("month").addEventListener("change", function () {
    renderCategories();
    renderSelectCategory(monthCategory);
    renderHistory(history);
  });
//lấy input
let moneyHistory = document.getElementById("money-history");
let nameHistory = document.getElementById("name-history");
let noteHistory = document.getElementById("note-history");
//lịch sử
function addHistory() {
  if (moneyHistory.value == "" || nameHistory.value == "" || noteHistory.value == "") {
    Swal.fire({
      position: "top-center",
      icon: "warning",
      title: "Hãng nhập đầy đủ thông tin ",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  } else if (!(Number(moneyHistory.value)) || Number(moneyHistory.value) <= 0) {
    Swal.fire({
      position: "top-center",
      icon: "warning",
      title: "Hãy nhập đúng dạng tiền",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }

  let maxIdHistory = 0;
  for (let i = 0; i < history.length; i++) {
    if (maxIdHistory < history[i].id) {
      maxIdHistory = history[i].id;
    }
  }

  // Lấy tên danh mục từ id được chọn
  let categoryName = "";
  for (let i = 0; i < monthCategory.length; i++) {
    if (monthCategory[i].month === monthYear.value) {
      for (let j = 0; j < monthCategory[i].categories.length; j++) {
        if (monthCategory[i].categories[j].id === Number(nameHistory.value)) {
          categoryName = monthCategory[i].categories[j].name;
          break;
        }
      }
    }
  }

  let newHistory = {
    id: maxIdHistory + 1,
    month: monthYear.value,
    moneyHistory: moneyHistory.value,
    name: categoryName,
    note: noteHistory.value,
  };
  history.push(newHistory);
  localStorage.setItem("history", JSON.stringify(history));

  let maxIdTransactions = 0;
  for (let i = 0; i < transactions.length; i++) {
    if (maxIdTransactions < transactions[i].id) {
      maxIdTransactions = transactions[i].id;
    }
  }
  let transactionDate = new Date();
  let arrTransactions = {
    id: maxIdTransactions + 1,
    userId: listUserRegister.length > 0 ? listUserRegister[listUserRegister.length - 1].id : 1,
    month: monthYear.value,
    categoryId: Number(nameHistory.value),
    amount: moneyHistory.value,
    description: noteHistory.value,
    date: transactionDate.toISOString(),
  };
  transactions.push(arrTransactions);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  // local monthlyReports
  let totalAmount = 0;
  let checkMonthReports = monthlyReports.findIndex(i => i.month === monthYear.value);
  for(let i = 0 ; i < history.length ; i++){
    if(history[i].month===monthYear.value){
      totalAmount+=Number(history[i].moneyHistory);
    }
  }
  let updateAmount = 0 ;
  let newDetails ={
      categoryId: Number(nameHistory.value), amount: Number(moneyHistory.value),
  };
  if(checkMonthReports!=-1){
    monthlyReports[checkMonthReports].details.push(newDetails);
    for(let i = 0 ; i <monthlyReports[checkMonthReports].details.length ; i++ ){
      updateAmount += Number(monthlyReports[checkMonthReports].details[i].amount);
    }
    monthlyReports[checkMonthReports].totalAmount = updateAmount;
  }else{
    monthlyReports.push(
      {
        userId: listUserRegister.length > 0 ? listUserRegister[listUserRegister.length - 1].id : 1,
        month: monthYear.value,
        totalAmount: totalAmount,
        details : [newDetails]
      }
    );
  };
  localStorage.setItem("monthlyReports", JSON.stringify(monthlyReports));
  // local statistical
  let amount , totalSpending = 0 ;
  let monthStatistical1 = statistical.findIndex(i => i.year === monthYear.value);
  let monthStatistical2 = monthCategory.findIndex(i => i.month === monthYear.value);
  //lấy ngân sách ban đầu
  if(monthStatistical2!=-1){
    amount = monthCategory[monthStatistical2].amount;
  }
  //lấy tổng số tiền tiêu
  for(let i = 0 ; i < history.length ;i++){
    if(history[i].month === monthYear.value){
      totalSpending+=Number(history[i].moneyHistory);
    }
  }
  console.log(totalSpending);
  if(monthStatistical1 !==-1){
    statistical[monthStatistical1].spending = totalSpending;
  }
  else{
    statistical.push(
      {
        id: statistical.length > 0 ? statistical[statistical.length-1].id + 1 : 1,
        year:monthYear.value,
        spending:totalSpending,
        budget:amount
      }
    )

  }
  localStorage.setItem("statistical",JSON.stringify(statistical));
  //in
  //
  moneyHistory.value = "";
  noteHistory.value = "";
  //
  renderHistory(history);
  renderPage();
  renderSelectCategory(monthCategory);
}
function renderStatistical(){
  //in
  let str = "";
  let status ; 
  for(let i = 0 ; i < statistical.length ; i++){
    status = statistical[i].spending <= statistical[i].budget ? "đạt" : "Không Đạt";
    str+=`
      <tr>
        <td>${statistical[i].year}</td>
        <td>${statistical[i].spending.toLocaleString()} VND</td>
        <td>${statistical[i].budget.toLocaleString()} VND</td>
        <td>${status}</td>
      </tr>
    `;
  }
  document.getElementsByTagName("tbody")[0].innerHTML = str; 
}
function renderSelectCategory(monthCategory){
  //lựa chọn danh mục
  let str = "";
  for(let i = 0 ; i < monthCategory.length ; i++){
    if(monthCategory[i].month === monthYear.value){
      for(let j = 0 ; j < monthCategory[i].categories.length ; j++){
        str += `<option value="${Number(monthCategory[i].categories[j].id)}">${monthCategory[i].categories[j].name}</option>`;
      }
    }
  }
  document.getElementById("name-history").innerHTML = str;
}
function renderHistory(arr) {
  let filteredHistory = arr.filter(item => item.month === monthYear.value);
  let start = (currentPage - 1) * itemsPerPage;
  let end = start + itemsPerPage;
  let currentPageHistory = filteredHistory.slice(start, end);
  let str = "";

  for (let i = 0; i < currentPageHistory.length; i++) {
    str += `<div class="history-content">
              <p>${currentPageHistory[i].name} - ${currentPageHistory[i].note} : ${Number(currentPageHistory[i].moneyHistory).toLocaleString()} VND</p>
              <button onclick="deleteHistory(${currentPageHistory[i].id})">Xóa</button>
            </div>`;
  }

  if (filteredHistory.length === 0) {
    document.getElementsByClassName("history")[0].innerHTML = "<p>Không có lịch sử cho tháng này.</p>";
    document.getElementsByClassName("pageNum")[0].innerHTML = "";
  } else {
    document.getElementsByClassName("history")[0].innerHTML = str;
    renderPage(filteredHistory);
  }
}

function searchSort(){
  let sortHistory = document.getElementById("sort-money").value;
  if(sortHistory=="asc"){
    history.sort((a,b) => a.moneyHistory - b.moneyHistory );
    renderHistory(history);
  }else{
    history.sort((a,b) => b.moneyHistory - a.moneyHistory);
    renderHistory(history);
  }
}
searchSort();
function deleteHistory(index){
  document.getElementsByClassName("confirm-delete-history")[0].style.display="block";
  document.getElementsByClassName("Bgr-fix-and-logout")[0].style.display="block";
  idDeleteHistory=index;  
}
function confirmDeleteHistory(){
  for(let i = 0 ; i < history.length ; i++){
    if(history[i].id===idDeleteHistory){
      history.splice(i,1);
      localStorage.setItem("history",JSON.stringify(history));
      currentPage=1;
      renderHistory(history);
      break;
    }
  }
  cancelDeleteHistory();
}
//hủy xóa
function cancelDeleteHistory(){
  document.getElementsByClassName("confirm-delete-history")[0].style.display="none";
  document.getElementsByClassName("Bgr-fix-and-logout")[0].style.display="none";
}
//tìm kiếm và sắp xếp 
function search(){
  let searchInputHistory = document.getElementById("search-input").value;
  let sortHistory = document.getElementById("sort-money").value;
  let checkSearch = history.filter(i => i.name.trim().toLowerCase().includes(searchInputHistory.trim().toLowerCase()));
  if(checkSearch.length>0){
    if(sortHistory=="asc"){
      checkSearch.sort((a,b) => a.moneyHistory - b.moneyHistory );
    }else{
      checkSearch.sort((a,b) => b.moneyHistory - a.moneyHistory);
    }
    currentPage = 1;
    renderHistory(checkSearch);
  }else{
    document.getElementsByClassName("history")[0].innerHTML = "<p>Không tìm thấy kết quả.</p>";
    document.getElementsByClassName("pageNum")[0].innerHTML = "";
  }
}
//in trang
function renderPage(arr){
  let total = Math.ceil(arr.length/itemsPerPage);
  let page="";
  for(let i = 0 ; i < total ; i++){
    page+=`<div class="number" onclick="clickPage(${i+1})">${i+1}</div>`;
  }
  document.getElementsByClassName("pageNum")[0].innerHTML = `
    <div class="prev" onclick="changePage(-1)">Previous</div>
    <div class="numbers">${page}</div>
    <div class="next" onclick="changePage(1)">Next</div>
  `;
}
//click page
function clickPage(index){
  currentPage=index;
  renderHistory(history);
  let pages = document.getElementsByClassName("number");
  for(let i = 0 ; i < pages.length ; i++){
    pages[i].style.backgroundColor="";
  }
  pages[currentPage-1].style.backgroundColor="rgba(67, 56, 202, 1)";
  pages[currentPage-1].style.color="white";
}
function changePage(i){
  let total = Math.ceil(history.length/itemsPerPage);
  if(i === -1 && currentPage>1){
    currentPage--;
  }else if(i === 1 && currentPage<total){
    currentPage++;
  }
  renderHistory(history);
  let pageNumbers = document.getElementsByClassName("number");
  for (let j = 0; j < pageNumbers.length; j++) {
    pageNumbers[j].style.backgroundColor = "";
  }
  if (pageNumbers.length > 0 && currentPage - 1 < pageNumbers.length) {
    pageNumbers[currentPage - 1].style.backgroundColor = "rgba(67, 56, 202, 1)";
    pageNumbers[currentPage - 1].style.color = "white";
  }
}
//đăng xuất
function acount() {
  document.getElementsByClassName("acount")[0].style.display = "none";
  document.getElementsByClassName("logOut")[0].style.display = "block";
}
function logOut() {
  document.getElementsByClassName("log-out")[0].style.display="block";
  document.getElementsByClassName("Bgr-fix-and-logout")[0].style.display="block";
}
//đòng ý
function confirmLogOut(){
  Swal.fire({
    position: "top-center",
    icon: "success",
    title: "đăng xuất thành công",
    showConfirmButton: false,
    timer: 1500,
  }).then(() => {
    document.getElementsByClassName("log-out")[0].style.display="none";
    document.getElementsByClassName("Bgr-fix-and-logout")[0].style.display="none";
    window.location.href = "./login.html";
  });
}
//hủy đồng ý thoát trang
function cancelLogOut(){
  document.getElementsByClassName("log-out")[0].style.display="none";
  document.getElementsByClassName("Bgr-fix-and-logout")[0].style.display="none";
}