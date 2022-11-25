const datefns = require('date-fns')
function parseMessage(username, message) {
  return {
    username,
    message,
    time: datefns.format(new Date(), 'HH:mm'),
  }
}

module.exports = parseMessage
