let listUserRegister = JSON.parse(localStorage.getItem("users")) || [];
let monthCategory = JSON.parse(localStorage.getItem("monthCategory")) || [
  {
    month: "2024-03",
    categories: [
      { id: 1, name: "Ăn uống", amount: 20000 },
      { id: 3, name: "Đi lại", amount: 20000 },
      { id: 5, name: "Tiền nhà", amount: 20000 },
    ],
  },
  {
    month: "2024-04",
    categories: [
      { id: 2, name: "Mua sắm", amount: 20000 },
      { id: 4, name: "Giải trí", amount: 20000 },
      { id: 1, name: "Ăn uống", amount: 20000 },
    ],
  },
];
let transactions = JSON.parse(localStorage.getItem("transactions")) || [
  {
    id: 1,
    userId: 1,
    month: "2024-03",
    categoryId: 1,
    amount: 150000,
    date: "2024-03-10",
  },
  {
    id: 2,
    userId: 1,
    month: "2024-03",
    categoryId: 3,
    amount: 50000,
    date: "2024-03-15",
  },
];
let history = JSON.parse(localStorage.getItem("history")) || [
  {
    id: 1,
    moneyHistory: 2000000,
    name: "tiền nhà",
    note: "đóng tiền trọ",
  },
];

//ngày tháng
let monthYear = document.getElementById("month");
//ngân sách
let budget = document.getElementById("money");
//in tiền
function save() {
  if (budget.value == "") {
    Swal.fire({
      position: "top-center",
      icon: "warning",
      title: "Hãy điền số tiền tháng này",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  } else {
    document.getElementsByClassName("money-initial")[0].innerHTML = Number(budget.value);
    document.getElementsByClassName("money-initial")[0].style.color="rgb(rgba(34, 197, 94, 1))";
    document.getElementsByClassName("currency-unit")[0].style.color="rgb(rgba(34, 197, 94, 1))";
  }
}
//quản lí danh mục

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
  } else {
    // Trừ đi ngân sách còn lại
    let money = Number(budget.value);
    let money2 = Number(moneyInput.value);
    let res = money - money2;
    document.getElementsByClassName("money-initial")[0].innerHTML = Number(res);
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
        month: month.value,
        categories: [categories],
      });
    }
    // Lưu vào localStorage
    localStorage.setItem("monthCategory", JSON.stringify(monthCategory));
    //
    nameInput.value = "";
    moneyInput.value = "";
  }
  //hiển thị danh mục theo tháng
  // Hiển thị ra giao diện
  renderCategories();
}
renderCategories();
//hàm hiển thị danh mục 
function renderCategories() {
  let str = "";
  for (let i = 0; i < monthCategory.length; i++) {
    for (let j = 0; j < monthCategory[i].categories.length; j++) {
      str += `
                <div class="manager-content-small">
                    <span class="content">
                        <p class="renderNameCategory">${monthCategory[i].categories[j].name}</p> - Giới hạn 
                        <p class="renderMoneyCategory">${monthCategory[i].categories[j].amount}</p> VND
                    </span>
                    <div class="manager-content-button">
                        <button onclick="editCategory(${monthCategory[i].categories[j].id})">Sửa</button>
                        <button onclick="deleteCategory(${monthCategory[i].categories[j].id})">Xóa</button>
                    </div>
                </div>
            `;
    }
  }
  document.getElementsByClassName("manager-content")[0].innerHTML = str;
}
//xóa
function deleteCategory(index) {
  for (let i = 0; i < monthCategory.length; i++) {
    for (let j = 0; j < monthCategory[i].categories.length; j++) {
      if (monthCategory[i].categories[j].id === index) {
        monthCategory[i].categories.splice(j, 1);
        localStorage.setItem("monthCategory", JSON.stringify(monthCategory));
        renderCategories();
      }
    }
  }
}
//sửa
let saveIdEdit;
let newNameCategory; 
let newMoneyCategory;

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
  else if(!Number(newMoneyCategory.value)){
    Swal.fire({
      position: "top-center",
      icon: "warning",
      title: "hãy nhập đúng số tiền",
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

//lấy input
let moneyHistory = document.getElementById("money-history");
let nameHistory = document.getElementById("name-history");
let noteHistory = document.getElementById("note-history");
//in lịch sử
function renderHistory() {
  let str = "";
  for (let i = 0; i < history.length; i++) {
    str += `
      <div class="history-content">
        <p>${history[i].name} - ${history[i].note} : ${history[i].moneyHistory} VND</p><button onclick="deleteHistory(${history[i].id})">Xóa</button>
      </div>
    `;
  }
  document.getElementsByClassName("history")[0].innerHTML = str;
}
function addHistory() {
  //kiểm tra chỗ trống
  if (
    moneyHistory.value == "" ||
    nameHistory.value == "" ||
    noteHistory.value == ""
  ) {
    Swal.fire({
      position: "top-center",
      icon: "warning",
      title: "Hãy điền đầy đủ thông tin",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  } else {
    //lưu vào history
    let maxIdHistory = 0;
    for (let i = 0; i < history.length; i++) {
      if (maxIdHistory < history[i].id) {
        maxIdHistory = history[i].id;
      }
    }
    let arrHistory = {
      id: maxIdHistory + 1,
      moneyHistory: moneyHistory.value,
      name: nameHistory.value,
      note: noteHistory.value,
    };
    history.push(arrHistory);
    localStorage.setItem("history", JSON.stringify(history));
    renderHistory();
    //thêm vào transactions
    //tìm id của transactions
    let maxIdTransactions = 0;
    for (let i = 0; i < transactions.length; i++) {
      if (maxIdTransactions < transactions[i].id) {
        maxIdTransactions = transactions[i].id;
      }
    }
    //check id :categoryId 
    let categoryId = 0;
  for (let i = 0; i < monthCategory.length; i++) {
    if (monthCategory[i].month == monthYear.value) { // Match month
      for (let j = 0; j < monthCategory[i].categories.length; j++) {
        if (monthCategory[i].categories[j].name.trim().toLowerCase() === nameHistory.value.trim().toLowerCase()) {
          categoryId = monthCategory[i].categories[j].id;
        }
      }
    }
  }
  let transactionDate = new Date;

  let arrTransactions = {
    id:maxIdTransactions+1,
    userId : listUserRegister[listUserRegister.length-1].id,
    month:monthYear.value,
    categoryId:categoryId,//lỗi
    amount:moneyHistory.value,
    date: transactionDate.toISOString(),//lỗi
  };
    //lưu vào local
    transactions.push(arrTransactions);
    localStorage.setItem("transactions",JSON.stringify(transactions));
    moneyHistory.value = "";
    nameHistory.value = "";
    noteHistory.value = "";
  }
}
//xóa lịch sử
function deleteHistory(index) {
  for (let i = 0; i < history.length; i++) {
    if (history[i].id === index) {
      history.splice(i, 1);
      localStorage.setItem("history", JSON.stringify(history));
      renderHistory();
    }
  }
}


//sắp xếp theo giá

renderHistory();
//phân trang

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
    title: "đăng nhập thành công",
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
