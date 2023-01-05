// VERIFICAR TOKEN

tokenValidate()

async function tokenValidate() {
    const tokenAccess = localStorage.getItem('tokenAccess');
    await fetch("http://127.0.0.1:8000/users/verify-token/", {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ token: tokenAccess })
    }).then(response => {
        if (response.status === 401) {
            localStorage.clear()
        }
        else if (response.status === 200) {
            window.location.replace('index.html');
        }
    })

}

// DATOS DE REGISTRO
const formRegister = document.querySelector("#formRegister")
const inputUsername = document.querySelector("#username");
const inputEmail = document.querySelector("#email");
const inputPassword = document.querySelector("#password");
let msg = document.getElementById("msg");

formRegister.addEventListener('submit', (event) => {
    const username = inputUsername.value;
    const email = inputEmail.value;
    const password = inputPassword.value;
    event.preventDefault();
    userLogin(username, email, password);
});

async function userLogin(username, email, password) {
    const response = await fetch("http://127.0.0.1:8000/users/signup/", {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password,
        })
    });

    if (response.ok) {
        window.location.replace('login.html');

    } else {
        msg.classList.remove("d-none");
    }
}
