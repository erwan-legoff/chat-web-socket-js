const users = []

//* Ajouter un utilisateur
function userJoin(id, username, room) {
  const user = { id, username, room }
  users.push(user)
  return user
}

//* Récupérer un utilisateur
function getCurrentUser(id) {
  return users.find((user) => user.id === id)
}

//* Utilisateur quitte le chat, on le supprime de la liste
function userLeave(id) {
  //* On récupère l'index de l'utilisateur
  const index = users.findIndex((user) => user.id === id)
  //* On supprime l'utilisateur de la liste que s'il existe
  if (index !== -1) {
    return users.splice(index, 1)[0] //* On retourne l'utilisateur supprimé
  }
}

//* Récupérer tous les utilisateurs d'une room
function getRoomUsers(room) {
  return users.filter((user) => user.room === room)
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
}
