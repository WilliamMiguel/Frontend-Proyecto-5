import * as functions from './functions.js';
functions.verifyAdmin(false)

// Variables para identificar al usuario
const getEmail = localStorage.getItem('email')

// Cantidad inicial de resultados para mostrar en la página
var resultsPerPage = 3;

// PAGOS REALIZADOS
const rowPaymentsTable = document.querySelector("#paymentsTable");
const showMoreMade = document.querySelector("#showMoreMade")
userMadePayment(getEmail, resultsPerPage)

async function userMadePayment(email, numResults) {
    const tokenAccess = localStorage.getItem('tokenAccess');
    const response = await fetch("http://127.0.0.1:8000/pagos/payment/", {
        mode: "cors",
        headers: {
            "Authorization": `Bearer ${tokenAccess}`
        }
    });
    if (response.status == 401) {
        window.location.replace("./login.html")
    }
    const data = await response.json();
    const users = data.results
    rowPaymentsTable.innerHTML = "";
    const payUser = users.filter(item => item.email === email)
    for (var i = 0; i < numResults; i++) {
        var item = payUser[i];
        rowPaymentsTable.innerHTML += functionPaymentsTable(item,"");
    }
}

// Para mostrar más resultados de los pagos realizados
showMoreMade.addEventListener("click", function () {
    resultsPerPage = resultsPerPage + 3;
    userMadePayment(getEmail, resultsPerPage);
    
});

function functionPaymentsTable(item, expired) {
    let penalty = `<td></td>`
    if (expired === "expired"){
       penalty = `<td>${item["importe de la multa"]}</td>`
    }
    return `
    <tr>
        <th scope="row"> <img src="http://127.0.0.1:8000${item.logo}" style="height:35px;" alt="${item.servicio}"></th>
        <td>${item.servicio}</td>
        <td>${item["fecha de pago"]}</td>
        <td>${item.monto}</td>
        ${penalty}
    </tr>
    `;
}


// PAGOS VENCIDOS
const rowExpiredPaymentsTable = document.querySelector("#expiredPaymentsTable");
const showMoreExpired = document.querySelector("#showMoreExpired")
userExpiredPayment(getEmail, resultsPerPage)

async function userExpiredPayment(email, numResults) {
    const tokenAccess = localStorage.getItem('tokenAccess');
    const responseexpired = await fetch("http://127.0.0.1:8000/pagos/expired-payments/", {
        mode: "cors",
        headers: {
            "Authorization": `Bearer ${tokenAccess}`
        }
    });
    const dataexpired = await responseexpired.json();
    const usersExpired = dataexpired.results
    rowExpiredPaymentsTable.innerHTML = "";
    const payUserExpired = usersExpired.filter(item => item.email === email)
    for (var i = 0; i < numResults; i++) {
        var item = payUserExpired[i];
        rowExpiredPaymentsTable.innerHTML += functionPaymentsTable(item,"expired");
    }
}

// Para mostrar más resultados de los pagos vencidos
showMoreExpired.addEventListener("click", function () {
    userExpiredPayment(getEmail, resultsPerPage + 3);
    resultsPerPage = resultsPerPage + 3;
});

// CERRAR SESIÓN
const buttonLogout = document.querySelector("#logout")
buttonLogout.addEventListener('click', () => {
    functions.userLogout()
})