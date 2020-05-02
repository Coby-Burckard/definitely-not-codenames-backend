const handleClose = (app, ws, user) => () => {
  console.log('removing user ', user.id);

  if (user.roomID) {
    // removing user from room and pushing users to frontend
    const room = app.rooms.get(user.roomID);
    room.users.delete(user.id);

    room.sendObjectToUsers(app, {
      type: 'ROOM_USERS_UPDATED',
      payload: { users: Array.from(room.users) },
    });
  }

  // removing user from app memory
  app.users.delete(user.id);
};

module.exports = handleClose;
