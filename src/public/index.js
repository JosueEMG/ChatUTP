const socket = io()

const listMessage = document.querySelector('#list-message')
const userName = document.querySelector('#user-name')
const form = document.querySelector('#form')
const inputMessage =  document.querySelector('#input-message')
const textEvent = document.querySelector('#text-event')
const txtSocketID = document.querySelector('#socket-id')

let socketID = ''

socket.on('connect', () => {
    socketID = socket.id

    txtSocketID.innerHTML = `ID del usuario: ${socketID}`
})

form.addEventListener('submit', e => {

    e.preventDefault()

    let userData = {}

    userName.value === '' ? userData = { name: socketID, message: inputMessage.value, socketID } : userData = { name: userName.value, message: inputMessage.value, socketID }

    socket.emit('chat:message', userData)

    inputMessage.value = ''
})

socket.on('chat:message', data => {

    textEvent.innerHTML = ''

    if (data.socketID === socketID) {

        listMessage.innerHTML += `
        <li class="list-group-item list-group-item-primary">
            <div class=" row">
            <div class="col-md-10">
                <div class="d-flex flex-row-reverse bd-highlight">
                    <div class="row">
                        <strong>${data.name}</strong>
                    </div>
                </div>
                <div class="d-flex flex-row-reverse bd-highlight">
                    <div class="row">
                        ${data.message}
                    </div>
                </div>
            </div>
                <div class="col-md-2">
                    <img src="https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png" alt=""
                        class="img-circle" width="50px" height="50px">
                </div>
            </div>
        </li>
        `
    } 
    else{ 

        listMessage.innerHTML += `
        <li class="list-group-item">
            <div class="row">
                <div class="col-md-2">
                    <img src="https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png" alt=""
                        class="img-circle" width="50px" height="50px">
                </div>
                <div class="col-md-10">
                    <div class="row">
                        <strong>${data.name}</strong>
                    </div>
                    <div class="row">
                        ${data.message}
                    </div>
                </div>
            </div>
        </li>
    ` 
    }
    
})

socket.on('chat:onConnection', data => {

    console.log(data)

    listMessage.innerHTML += `<li class="list-group-item text-center text-muted">${data} se unió!</li>`

})

socket.on('chat:onDisconnection', data => {

    listMessage.innerHTML += `<li class="list-group-item text-center text-muted">${data} se fué del chat!</li>`
})

inputMessage.addEventListener('keypress', (e) => {

    console.log('cac')

    let userData = {}

    userName.value === '' ? userData = { name: socketID } : userData = { name: userName.value }

    socket.emit('chat:typing', userData)
})

socket.on('chat:typing', data => {

    textEvent.innerHTML = `<p class="text-center text-muted"><em>${data.name} está escribiendo...</em></p>`
})
