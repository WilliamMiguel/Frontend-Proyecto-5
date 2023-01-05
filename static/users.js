import * as functions from './functions.js';
functions.verifyAdmin(true)

// USUARIOS
const userTable = document.querySelector("#userTable");
getUsers()

async function getUsers() {
    const tokenAccess = localStorage.getItem('tokenAccess');
    const response = await fetch("http://127.0.0.1:8000/users/", {
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
    userTable.innerHTML = "";
    for (var i = 0; i < users.length; i++) {
        var item = users[i];
        userTable.innerHTML += tableUsers(item);
    }
}

function tableUsers(item) {
    return `
    <tr>
        <th scope="row">${item.id}</th>
        <td>${item.username}</td>
        <td>${item.email}</td>
        <td>${item.is_staff}</td>
        <td><button onclick="showformEditUser('${item.id}','${item.username}','${item.is_staff}')" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Editar</button></td>
        <td><a class="btn btn-danger" onclick="deleteUser('${item.id}')">Eliminar</a></td>
    </tr>
    `;
}

const modalFormUser = document.querySelector("#modalFormUser")

modalFormUser.innerHTML = `
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">Editar usuario</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <main class="form mx-auto w-100">
                    <form id="formEditUser" method="POST">
                        <div class="input-group mb-3">
                            <span class="input-group-text"><i class="fa-solid fa-user"></i></span>
                            <input type="text" class="form-control" id="formUsername" name="username"
                                placeholder="Nombre de usuario">
                        </div>
    
                        <div class="input-group mb-3">
                            <span class="input-group-text"><i class="fa-solid fa-envelope"></i></span>
                            <input type="email" class="form-control" id="formEmail" name="email"
                                placeholder="Correo electrónico">
                        </div>
    
                        <div class="input-group mb-3">
                            <span class="input-group-text"><i class="fa-solid fa-user-shield"></i></span>
                            <select class="form-select" id="optionsAdmin" name="is_staff">
                                <option value="0">Usuario</option>
                                <option value="1">Administrador</option>
                            </select>
                        </div>
    
                        <div class="input-group mb-0">
                            <span class="input-group-text"><i class="fa-solid fa-key"></i></span>
                            <input type="password" class="form-control" id="formPassword" name="password"
                                placeholder="Contraseña">
                        </div>
    
                        <div id="msg" class="alert alert-sm alert-danger d-none my-3" role="alert">
                            Usuario o email ya registrado
                        </div>
                    </form>
                </main>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-dark" data-bs-dismiss="modal">Cancelar</button>
                <button id="saveChanges" class="btn btn-success">Guardar</button>
            </div>
        </div>
    </div>
    </div>
    `


// MODIFICAR UN USUARIO
window.showformEditUser = function (userID, username, admin) {
    const userEdit = document.querySelector("#staticBackdropLabel");
    userEdit.innerHTML = `Editar usuario - ${username}`;
    const selectElement = document.querySelector('#optionsAdmin');
    selectElement.options[0].selected = true;
    if (admin === "true") {
        selectElement.options[1].selected = true;
    }
    const saveChanges = document.querySelector('#saveChanges');
    saveChanges.addEventListener('click', (event) => {
        event.preventDefault();
        editUser(userID)
    })
}

async function editUser(id) {
    const tokenAccess = localStorage.getItem('tokenAccess');
    const formEditUser = document.querySelector("#formEditUser");
    const formData = new FormData(formEditUser)
    await fetch(`http://127.0.0.1:8000/users/${id}/`, {
        method: "PATCH",
        mode: "cors",
        headers: {
            "Authorization": `Bearer ${tokenAccess}`,
        },
        body: formData
    })
        .then((response) => {
            if (response.ok) {
                Swal.fire(
                    '¡Actualizado!',
                    'Los datos se actualizaron correctamente',
                    'success'
                ).then((result) => {
                    if (result.isConfirmed) {
                        window.location.replace("users.html");
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


//ELIMINAR UN USUARIO
window.deleteUser = async function (id) {
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
            await fetch(`http://127.0.0.1:8000/users/${id}/`, {
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
                            "El usuario fue eliminado",
                            "success"
                        ).then((result) => {
                            if (result.isConfirmed) {
                                window.location.replace("users.html");
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