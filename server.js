const express = require('express')
const http = require('http')

//* On initialise un serveur express
const app = express()

//* On définit le port d'écoute du serveur
const PORT = 3000 || process.env.PORT

//* On définit le dossier public
app.use(express.static('public')) // On peut aussi utiliser le chemin absolu path.join(__dirname, 'public')

//* On lance le serveur sur le port défini en écoute, et on affiche un message de confirmation
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
