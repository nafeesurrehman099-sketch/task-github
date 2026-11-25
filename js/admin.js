
let adminUsername = "admin";
let adminPassword = "adminuser";

let loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;

        if (username === adminUsername && password === adminPassword) {

            alert("Login Successful!");

            window.location.href = "dashboard.html";

        } else {

            alert("Invalid Username or Password!");

        }

    });

}
