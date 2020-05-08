const handleClose = (app, ws, user) => () => {
  console.log(`Deleting user. User: ${user.id}`);

  if (user.roomID) {
    // removing user from room and pushing users to frontend
    const room = app.rooms.get(user.roomID);
    room.users.delete(user.id);

    room.sendGameUsersToRoom(app);
  }

  // removing user from app memory
  app.users.delete(user.id);
};

module.exports = handleClose;
