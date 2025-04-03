let listUserRegister = JSON.parse(localStorage.getItem("users")) || [];
let userListLogIn = JSON.parse(localStorage.getItem("userListLogIn")) || [];

function clickLogIn() {
    let user = document.getElementById("user-email-login").value.trim();
    let pass = document.getElementById("user-pass-login").value.trim();
    if (user.length == 0 || pass.length == 0 ) {
        Swal.fire({
            position: "top-center",
            icon: "warning",
            title: "Hãy điền đầy đủ thông tin",
            showConfirmButton: false,
            timer: 1500,
          });
        return;
    }
    // Kiểm tra tài khoản có tồn tại không
    let userAccount = listUserRegister.find(i => i.username === user && i.password === pass);
    if (!userAccount) {
        Swal.fire({
            position: "top-center",
            icon: "warning",
            title: "Sai tài khoản đăng nhập hoặc mật khẩu",
            showConfirmButton: false,
            timer: 1500,
          });
        return;
    }

    // Nếu đăng nhập thành công
    userListLogIn.push(userAccount);
    localStorage.setItem("userListLogIn", JSON.stringify(userListLogIn));

    Swal.fire({
        position: "top-center",
        icon: "success",
        title: "đăng nhập thành công",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        document.getElementById("user-email-login").value = "";
        document.getElementById("user-pass-login").value = "";
        window.location.href = "./index.html"; // Chuyển hướng sau khi đăng nhập
    });
}
