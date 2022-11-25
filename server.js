const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const parseMessage = require('./utils/messages')
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./utils/users')
const chatBotName = 'Chatbot'
//* On initialise un serveur express
const app = express()
const server = http.createServer(app)
const io = socketio(server)

//* On définit le port d'écoute du serveur
const PORT = process.env.PORT || 3000

//* On définit le dossier public
app.use(express.static('public')) // On peut aussi utiliser le chemin absolu path.join(__dirname, 'public')

//* On attend une connexion d'un client
io.on('connection', (socket) => {
  console.log('Nouvelle connexion sur le websocket !')

  //* On attend un message de connexion à une room
  socket.on('joinRoom', ({ username, room }) => {
    //* On ajoute l'utilisateur à la liste des utilisateurs
    const user = userJoin(socket.id, username, room)
    socket.join(user.room)
    //* On envoie les utilisateurs et la room à tous les clients connectés à chaque connexion d'un client
    socketSendUsersRoom(user)

    //* On envoie un message au client
    socket.emit(
      'message',
      parseMessage(chatBotName, `Bienvenue sur le chat ${user.username} !`)
    )

    //* Envoie un message à tout le monde quand un client se connecte, sauf au client en cours (broadcast)
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        parseMessage(chatBotName, `${user.username} vient de se connecter !`)
      )

    //* On attend un message du chat provenant du client
    socket.on('chatMessage', (message) => {
      const sendingUser = getCurrentUser(socket.id)

      //* On envoie le message à tout le monde
      io.to(sendingUser.room).emit(
        'message',
        parseMessage(sendingUser.username, message)
      )
    })

    //* On fait la même chose quand un client se déconnecte
    socket.on('disconnect', () => {
      const userLeaving = userLeave(socket.id) //* On supprime l'utilisateur de la liste avec son id

      if (userLeaving) {
        socketLeaveRoom(userLeaving)
        //* On met à jour la liste des utilisateurs pour les autres clients de la room
        socketSendUsersRoom(user)
      }
    })
  })
})

//* On lance le serveur sur le port défini en écoute, et on affiche un message de confirmation

const host = '0.0.0.0'

server.listen(PORT, host, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`http://localhost:${PORT}`)
})
function socketSendUsersRoom(user) {
  io.to(user.room).emit('roomUsers', {
    room: user.room,
    users: getRoomUsers(user.room),
  })
}

function socketLeaveRoom(userLeaving) {
  io.to(userLeaving.room).emit(
    'message',
    parseMessage(
      chatBotName,
      `${userLeaving.username} vient de se déconnecter !`
    )
  )
}
