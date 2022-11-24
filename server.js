const express = require('express')
const http = require('http')
const socketio = require('socket.io')

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
  //* On envoie un message au client
  socket.emit('message', 'Bienvenue sur le chat !')

  //* Envoie un message à tout le monde quand un client se connecte, sauf au client en cours (broadcast)
  socket.broadcast.emit('message', 'Un nouveau client vient de se connecter !')

  //* On fait la même chose quand un client se déconnecte
  socket.on('disconnect', () => {
    io.emit('message', 'Un client vient de se déconnecter !')
  })

  //* On attend un message du chat provenant du client
  socket.on('chatMessage', (message) => {
    console.log(message)
    //* On envoie le message à tout le monde
    io.emit('message', message)
  })
})

//* On lance le serveur sur le port défini en écoute, et on affiche un message de confirmation
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
