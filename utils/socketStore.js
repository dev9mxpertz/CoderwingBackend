
const onlineUsers = {};

module.exports = {
  setUser: (userId, socketId) => {
    onlineUsers[userId] = socketId;
  },
  getUser: (userId) => {
    return onlineUsers[userId];
  },
  removeUser: (socketId) => {
    for (let userId in onlineUsers) {
      if (onlineUsers[userId] === socketId) {
        delete onlineUsers[userId];
        break;
      }
    }
  },
  getAll: () => onlineUsers,
};
