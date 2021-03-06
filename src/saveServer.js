const http = require('http');
const socketio = require('socket.io');
const { SAVE_TEXT, SAVE_IMAGE } = require('./tasks/taskNames');
const { saveSnapshot } = require('./utils/tasks/textSnapshots');
const { saveImageSnapshot } = require('./utils/tasks/imageSnapshots');

function initServer(config) {
  if (!config.serverEnabled) {
    return;
  }

  const server = http.createServer();
  const io = socketio(server);

  io.on('connection', (client) => {
    const { token } = client.handshake.query;
    client.on(SAVE_TEXT, (data) => {
      if (token === config.token) {
        saveSnapshot(data);
      }
    });
    client.on(SAVE_IMAGE, (data) => {
      if (token === config.token) {
        saveImageSnapshot(data);
      }
    });
  });

  server.listen(config.serverPort, config.serverHost);
}

module.exports = {
  initServer,
};
