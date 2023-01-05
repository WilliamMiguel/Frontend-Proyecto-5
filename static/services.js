import * as functions from './functions.js';
functions.verifyAdmin(true)

// Carga los servicios
functions.showServices()

// CREAR SERVICIO
const formNewService = document.querySelector("#formNewService");
const nameService = document.querySelector('#addName');
const prefixService = document.querySelector('#addPrefix');
const logoService = document.querySelector('#addLogo');

formNewService.addEventListener('submit', (event) => {
    event.preventDefault();
    formServiceValidation();
});

let formServiceValidation = () => {
    if (nameService.value === "") {
        msg.classList.remove("d-none");
    }
    if (prefixService.value === "") {
        msg1.classList.remove("d-none");
    }
    if (logoService.value === "") {
        msg2.classList.remove("d-none");
    }
    if (nameService.value !== "" && prefixService.value !== "" && logoService.value !== "") {
        msg.classList.add("d-none");
        msg1.classList.add("d-none");
        msg2.classList.add("d-none");
        newService()
    }
};

async function newService() {
    const tokenAccess = localStorage.getItem('tokenAccess');
    const formData = new FormData(formNewService)
    await fetch("http://127.0.0.1:8000/pagos/services/", {
        method: "POST",
        mode: "cors",
        headers: {
            "Authorization": `Bearer ${tokenAccess}`,
        },
        body: formData
    }).then(response => {
        if (response.ok) {
            Swal.fire({
                title: 'Creado',
                text: 'El servicio se añadió correctamente',
                icon: 'success',
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.replace("./services.html");
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

// MODIFICAR UN SERVICIO
const formModifyService = document.querySelector("#formModifyService");
const changeName = document.querySelector('#changeName');
const changePrefix = document.querySelector('#changePrefix');
const changeLogo = document.querySelector('#changeLogo');

formModifyService.addEventListener('submit', (event) => {
    event.preventDefault();
    formModifyValidation();
});

let formModifyValidation = () => {
    if (changeName.value === "") {
        cmsg.classList.remove("d-none");
    }
    if (changePrefix.value === "") {
        cmsg1.classList.remove("d-none");
    }
    if (changeLogo.value === "") {
        cmsg2.classList.remove("d-none");
    }
    if (changeName.value !== "" && changePrefix.value !== "" && changeLogo.value !== "") {
        cmsg.classList.add("d-none");
        cmsg1.classList.add("d-none");
        cmsg2.classList.add("d-none");
        const id = options.value
        modifyService(id)
    }
};

async function modifyService(id) {
    const tokenAccess = localStorage.getItem('tokenAccess');
    const formData = new FormData(formModifyService)
    await fetch(`http://127.0.0.1:8000/pagos/services/${id}/`, {
        method: "PUT",
        mode: "cors",
        headers: {
            "Authorization": `Bearer ${tokenAccess}`
        },
        body: formData
    }).then((response) => {
        if (response.ok) {
            Swal.fire(
                '¡Actualizado!',
                'Los datos se actualizaron correctamente',
                'success'
            ).then((result) => {
                if (result.isConfirmed) {
                    window.location.replace("./services.html");
                }
            })
        }
        else {
            Swal.fire({
                icon: "error",
                title: 'Oops...',
                text: "¡Ocurrió un error!"
            })
        }
    })
}

// ELIMINAR UN SERVICIO
const deleteButton = document.querySelector('#deleteButton');
deleteButton.addEventListener('click', (event) => {
    event.preventDefault();
    // Obtiene el id del servicio
    const id = options.value
    deleteService(id)
})

async function deleteService(id) {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esta acción!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
    }).then(async (result) => {
        if (result.isConfirmed) {
            const tokenAccess = localStorage.getItem('tokenAccess');
            await fetch(`http://127.0.0.1:8000/pagos/services/${id}/`, {
                method: "DELETE",
                mode: "cors",
                headers: {
                    "Authorization": `Bearer ${tokenAccess}`
                },
            }).then((response) => {
                if (response.ok) {
                    if (response.ok) {
                        Swal.fire(
                            "¡Eliminado!",
                            "El servicio se eliminó correctamente",
                            "success"
                        ).then((result) => {
                            if (result.isConfirmed) {
                                window.location.replace("./services.html");
                            }
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "¡Ocurrió un error!",
                        });
                    }
                }
            });
        }
    });
}

// CERRAR SESIÓN
const buttonLogout = document.querySelector("#logout")
buttonLogout.addEventListener('click', () => {
    functions.userLogout()
})