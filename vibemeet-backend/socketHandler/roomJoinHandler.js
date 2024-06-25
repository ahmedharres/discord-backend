const serverStore = require('../serverStore');
const roomsUpdates = require('./updates/rooms');

const roomJoinHandler = (socket, data) => {
    const { roomId } = data;

    const participantsDetails = {
        userId: socket.user.userId,
        socketId: socket.id,
    };

    const roomDetails = serverStore.getActiveRoom(roomId);
    serverStore.joinActiveRoom(roomId, participantsDetails);
    roomsUpdates.updateRooms();
}

module.exports = roomJoinHandler;