

//* On récupère ce qui est tapé dans la barre de message
const chatField = document.getElementById('chat-form')

//* On se connecte au serveur websocket
const socket = io()

//* On attend de recevoir un message du serveur et on l'affiche
socket.on('message', (message) => {
  outputMessage(message)
  //* On scroll en bas de la page pour voir le dernier message
  // document.querySelector('.chat-messages').scrollTop = document.querySelector('.chat-messages').scrollHeight
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
 * @param {String} message
 */
function outputMessage(message) {
  

  const div = document.createElement('div')
  //* On ajoute la classe "message" à la div pour rendre le message plus joli
  div.classList.add('message')
  //* On ajoute le message dans la div avec la date et le nom de l'utilisateur
  div.innerHTML = `
    <p class="meta"><span> Anonymous </span></p>
    <p class="text">
      ${message}
    </p>
  `
  //* On ajoute le message au parent qui a un id "chat-messages"
  document.querySelector('.chat-messages').appendChild(div)
}
