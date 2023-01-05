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

// DATOS DE INICIO DE SESIÓN
const formUser = document.querySelector("#formUser")
const inputEmail = document.querySelector("#email");
const inputPassword = document.querySelector("#password");
let msg = document.getElementById("msg");

formUser.addEventListener('submit', (event) => {
    const emailLogin = inputEmail.value;
    const passwordLogin = inputPassword.value;
    event.preventDefault();
    userLogin(emailLogin, passwordLogin);
});

async function userLogin(email, password) {
    const response = await fetch("http://127.0.0.1:8000/users/login/", {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password,
        })
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('tokenAccess', data.tokens["access"]);
        localStorage.setItem('tokenRefresh', data.tokens["refresh"]);
        const dateToken = new Date();
        localStorage.setItem('createdToken', dateToken);
        const expiredDateToken = new Date(dateToken.setMinutes(dateToken.getMinutes() + 15));
        localStorage.setItem('expiredToken', expiredDateToken);
        localStorage.setItem('email', data.email);
        localStorage.setItem('username', data.username);
        localStorage.setItem('userID', data.userID);
        localStorage.setItem('is_staff', data.is_staff);
        window.location.replace('index.html');

    } else {
        msg.classList.remove("d-none");
    }
}
