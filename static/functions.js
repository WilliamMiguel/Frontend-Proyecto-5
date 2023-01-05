const tokenAccess = localStorage.getItem('tokenAccess');
const getUserID = localStorage.getItem('userID')

// MOSTRAR NOMBRE DE USUARIO Y AVATAR
showUsernameAvatar()
function showUsernameAvatar(){
    const getUsername = localStorage.getItem('username')
    const username = document.querySelector("#username")
    username.innerHTML = `${getUsername}`

    const avatar = document.querySelector("#avatar")
    avatar.src = "http://127.0.0.1:8000/images/user.jpg"
}

// COMPROBAR SI ES ADMIN
export function verifyAdmin(redirect){
    const isAdmin = localStorage.getItem('is_staff')
    const services = document.querySelector("#services")
    const servicesCollapse = document.querySelector("#servicesCollapse")
    const usersButton = document.querySelector("#users")
    const usersCollapse = document.querySelector("#usersCollapse")

    if (isAdmin !== null && isAdmin === "true") {
        services.hidden = false
        servicesCollapse.hidden = false
        usersButton.hidden = false
        usersCollapse.hidden = false
    }
    else{
        if(redirect === true){
            window.location.replace("index.html")
        }
    }
}

// Muestra los servicios disponibles
export async function showServices() {
    const response = await fetch("http://127.0.0.1:8000/pagos/services/", {
        mode: "cors",
        method: "GET",
        headers: {
            "Authorization": `Bearer ${tokenAccess}`
        }
    })

    if (response.status == 401) {
        window.location.replace("./login.html")
    }
    const data = await response.json();
    const services = data.results
    services.forEach(service => {
        const newOption = document.createElement('option');
        newOption.value = service.id;
        newOption.text = service.name;
        options.appendChild(newOption);
    })
}

// Función para cerrar sesión
export async function userLogout() {
    const response = await fetch("http://127.0.0.1:8000/users/logout/", {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tokenAccess}`
        },
        body: JSON.stringify({
            id: parseInt(getUserID),
        })
    });
    localStorage.clear()
    window.location.replace("login.html")
}

// Ejecuta la función cada 13 minutos

setInterval(verifyToken, 13 * 60 * 1000);
verifyToken()
async function verifyToken() {
    const refreshToken = localStorage.getItem('tokenRefresh')
    const response = await fetch('http://127.0.0.1:8000/users/refresh-token/', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            refresh: refreshToken
        })
    })

    const data = await response.json();
    localStorage.setItem('tokenAccess', data.access);
    localStorage.setItem('tokenRefresh', data.refresh);
    const dateToken = new Date();
    localStorage.setItem('createdToken', dateToken);
    const expiredDateToken = new Date(dateToken.setMinutes(dateToken.getMinutes() + 15));
    localStorage.setItem('expiredToken', expiredDateToken);
}