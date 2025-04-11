let listUserRegister = JSON.parse(localStorage.getItem("users")) || [];

function clickRegister() {
    //lấy giá trị
    let user = document.getElementById("user-email-register").value.trim();
    let pass = document.getElementById("user-pass-register").value.trim();
    let confirmPass = document.getElementById("user-confirm-pass-register").value.trim();
    let check = true;

    // Kiểm tra email hợp lệ
    if (user.length === 0) {
        Swal.fire({
            position: "top-center",
            icon: "warning",
            title: "Email không được để trống",
            showConfirmButton: false,
            timer: 1000,
          });
        check = false;
    }
    if (!user.includes("@") || (!user.endsWith(".com") && !user.endsWith(".vn"))) {
        Swal.fire({
            position: "top-center",
            icon: "warning",
            title: "Bạn phải nhập đúng định dạng email, ví dụ: example@gmail.com",
            showConfirmButton: false,
            timer: 1000,
          });
        check = false;
    }
    // Kiểm tra email đã tồn tại chưa
    let emailExists = listUserRegister.some(i => i.username === user);
    console.log(emailExists);
    if (emailExists) {
        Swal.fire({
            position: "top-center",
            icon: "warning",
            title: "Email đã tồn tại , vui lòng nhập email khác",
            showConfirmButton: false,
            timer: 1000,
          });
        check = false;
    }

    // Kiểm tra mật khẩu
    if (pass.length === 0) {
        Swal.fire({
            position: "top-center",
            icon: "warning",
            title: "Mật khẩu không được để trống",
            showConfirmButton: false,
            timer: 1000,
          });
        check = false;
    } else if (pass.trim().length < 6) {
        Swal.fire({
            position: "top-center",
            icon: "warning",
            title: "Mật khẩu phải từ 6 kí tự trở lên",
            showConfirmButton: false,
            timer: 1000,
          });
        check = false;
    }

    // Kiểm tra xác nhận mật khẩu
    if (pass !== confirmPass) {
        Swal.fire({
            position: "top-center",
            icon: "warning",
            title: "Mật khẩu không khớp",
            showConfirmButton: false,
            timer: 1000,
          });
        check = false;
    };

    // Nếu tất cả điều kiện hợp lệ, thêm tài khoản mới
    if (check) {
        let newId = listUserRegister.length > 0 ? listUserRegister[listUserRegister.length - 1].id + 1 : 1;
        let newAccount = {
            id: newId,
            username: user,
            password: pass
        };

        listUserRegister.push(newAccount);
        localStorage.setItem("users", JSON.stringify(listUserRegister));

        Swal.fire({
            position: "top-center",
            icon: "success",
            title: "đăng kí thành công",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            document.getElementById("user-email-register").value = "";
            document.getElementById("user-pass-register").value = "";
            document.getElementById("user-confirm-pass-register").value = "";
            window.location.href = "./login.html";
        });
        
    }
}
