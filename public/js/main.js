//* On récupère ce qui est tapé dans la barre de message
const chatField = document.getElementById('chat-form')

//* On récupère le nom de l'utilisateur et la room à partir de l'URL
const { username, room } = Qs.parse(
  location.search, //* On récupère les paramètres de l'URL
  {
    ignoreQueryPrefix: true, //* On ignore le "?" de l'URL
  }
)

//* On se connecte au serveur websocket
const socket = io()

//* On rejoint la room, on envoie le nom de l'utilisateur et la room
socket.emit('joinRoom', { username, room })

//* On récupère les utilisateurs et la room
socket.on('roomUsers', ({ room, users }) => {
  //* On affiche la room
  outputRoomName(room)
  //* On affiche les utilisateurs
  outputUsers(users)
})

//* On attend de recevoir un message du serveur et on l'affiche
socket.on('message', (message) => {
  outputMessage(message)
  //* On scroll en bas de la page pour voir le dernier message

  document.querySelector('.chat-messages').scrollTop =
    document.querySelector('.chat-messages').scrollHeight
})

//* On attend l'envoie du message
chatField.addEventListener('submit', (e) => {
  //* On empêche le comportement par défaut du formulaire
  e.preventDefault()

  //* On récupère la valeur du champ qui a un id "msg"
  const message = e.target.elements.msg.value

  //* On envoie le message au serveur
  socket.emit('chatMessage', message)
})

/**
 ** On affiche le message dans le chat
 * @param {{username: String, message: String, time: String} } message
 */
function outputMessage(message) {
  const div = document.createElement('div')
  //* On ajoute la classe "message" à la div pour rendre le message plus joli
  div.classList.add('message')
  //* On ajoute le message dans la div avec la date et le nom de l'utilisateur
  div.innerHTML = `
    <p class="meta">${message.username}<span> ${message.time} </span></p>
    <p class="text">
      ${message.message}
    </p>
  `
  //* On ajoute le message au parent qui a un id "chat-messages"
  document.querySelector('.chat-messages').appendChild(div)
}

//* On remplit le nom de la room dans le h3 qui a un id "room-name"
function outputRoomName(room) {
  document.getElementById('room-name').innerText = room
}

//* On remplit la liste des utilisateurs dans le ul qui a un id "users"
function outputUsers(users) {
  for (const user of users) {
    const userHtml = document.createElement('li')
    userHtml.innerText = user.username
    //* On ajoute le nom de l'utilisateur dans la liste sauf si il y a déjà un utilisateur avec le même nom
    if (!document.querySelector(`#users li:contains(${user.username})`)) {
      document.getElementById('users').appendChild(userHtml)
    }
  }
}
