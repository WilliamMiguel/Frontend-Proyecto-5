import * as functions from './functions.js';
functions.verifyAdmin(false)

// Carga los servicios
functions.showServices()

// NUEVO PAGO
const formNewPayment = document.querySelector("#formNewPayment");
const expiredDate = document.querySelector("#expiredDate");
const amount = document.querySelector("#amount");
const options = document.querySelector("#options");

formNewPayment.addEventListener('submit', (event) => {
    event.preventDefault();
    formValidation();
});

let formValidation = () => {
    if (expiredDate.value === "") {
        msg.classList.remove("d-none");
    }
    if (amount.value === "") {
        msg1.classList.remove("d-none");
    }
    if (expiredDate.value !== "" && amount.value !== "") {
        msg.classList.add("d-none");
        msg1.classList.add("d-none");
        newPayment()
    }
};

async function newPayment() {
    const tokenAccess = localStorage.getItem('tokenAccess');
    const getUserID = localStorage.getItem('userID')
    await fetch("http://127.0.0.1:8000/pagos/payment/", {
        method: "POST",
        mode: "cors",
        headers: {
            "Authorization": `Bearer ${tokenAccess}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            amount: amount.value,
            user_id: getUserID,
            expirationdate: expiredDate.value,
            service_id: options.value
        })

    }).then(response => {
        console.log(response)
        if (response.ok) {
            Swal.fire(
                'Registrado!',
                'Se registró el pago exitosamente',
                'success'
            ).then((result) => {
                if (result.isConfirmed) {
                    window.location.replace("new_payment.html");
                }
            })
        }
        else {
            Swal.fire({
                icon: "error",
                title: 'Oops...',
                text: "¡Ingresaste un valor incorrecto!"
            })
        }

        if (response.status == 401) {
            Swal.fire({
                icon: "question",
                title: 'No autorizado',
                text: "Inicia sesión para registrar un servicio"
            })
                .then((result) => {
                    if (result.isConfirmed) {
                        window.location.replace("./login.html");
                    }
                })
        }
    })
}


const buttonLogout = document.querySelector("#logout")
buttonLogout.addEventListener('click', () => {
    functions.userLogout()
})