const { v4: uuidV4 } = require("uuid");
module.exports = function (io, rooms) {
  io.on("connection", (socket) => {
    socket.on("username", handleUsername);
    socket.on("createRoom", handleCreateRoom);
    socket.on("joinRoom", handleJoinRoom);
    socket.on("move", handleMove);
    socket.on("checkTime", handleTimeOver);
    socket.on("disconnect", handleDisconnect);
    socket.on("closeRoom", handleCloseRoom);
  });

  function handleUsername(username) {
    this.data.username = username;
  }

  async function handleCreateRoom(args, callback) {
    const roomId = uuidV4();
    await this.join(roomId);
    rooms.set(roomId, {
      roomId,
      toPlay: "white",
      whiteTime: args.timeControl,
      blackTime: args.timeControl,
      players: [{ id: this.id, username: this.data?.username }],
      isGameOver: false,
    });

    callback({ ...rooms.get(roomId) });
  }

  async function handleJoinRoom(args, callback) {
    const room = rooms.get(args.roomId);
    let error, message;
    if (!room) {
      error = true;
      message = "room does not exist";
    } else if (room.players.length <= 0) {
      error = true;
      message = "room is empty";
    } else if (room.players.length >= 2) {
      error = true;
      message = "room is full";
    }

    if (error) {
      if (callback) {
        callback({ error, message });
      }
      return;
    }

    await this.join(args.roomId);
    const startTime = new Date();
    const roomUpdate = {
      ...room,
      players: [
        ...room.players,
        { id: this.id, username: this.data?.username },
      ],
      lastMoveTime: startTime,
    };
    rooms.set(args.roomId, roomUpdate);
    callback(roomUpdate);
    this.to(args.roomId).emit("opponentJoined", roomUpdate);
  }

  function handleMove(args) {
    const room = rooms.get(args.room);
    const time = new Date();
    if (room.toPlay === "white") {
      room.whiteTime -= (time - room.lastMoveTime) / 1000;
      if (room.whiteTime <= 0) {
        return io
          .to(room.players[0].id)
          .to(room.players[1].id)
          .emit("timeOut", {
            winner: "Black",
          });
      }
      room.lastMoveTime = time;
      room.toPlay = "black";
    } else {
      room.blackTime -= (time - room.lastMoveTime) / 1000;
      if (room.blackTime <= 0) {
        return io
          .to(room.players[0].id)
          .to(room.players[1].id)
          .emit("timeOut", {
            winner: "White",
          });
      }
      room.lastMoveTime = time;
      room.toPlay = "white";
    }
    this.to(args.room).emit("move", args.move);
    io.to(room.players[0].id).to(room.players[1].id).emit("time", {
      bTime: room.blackTime,
      wTime: room.whiteTime,
    });
  }

  function handleTimeOver(args) {
    const room = rooms.get(args.room);
    if (room.isGameOver) {
      return;
    }
    const time = new Date();
    if (room.toPlay === "white") {
      whiteTime = room.whiteTime - (time - room.lastMoveTime) / 1000;
      if (whiteTime <= 0) {
        room.isGameOver = true;
        return io
          .to(room.players[0].id)
          .to(room.players[1].id)
          .emit("timeOut", {
            winner: "Black",
          });
      }
    } else {
      blackTime = room.blackTime - (time - room.lastMoveTime) / 1000;
      if (blackTime <= 0) {
        room.isGameOver = true;
        return io
          .to(room.players[0].id)
          .to(room.players[1].id)
          .emit("timeOut", {
            winner: "White",
          });
      }
    }
  }

  function handleDisconnect() {
    const gameRooms = Array.from(rooms.values());
    gameRooms.forEach((room) => {
      const userInRoom = room.players.find((player) => player.id === this.id);
      if (userInRoom) {
        if (room.players.length < 2) {
          rooms.delete(room.roomId);
          return;
        }

        this.to(room.roomId).emit("playerDisconnected", userInRoom);
      }
    });
  }

  async function handleCloseRoom(data) {
    this.to(data.roomId).emit("closeRoom", data);
    const clientSockets = await io.in(data.roomId).fetchSockets();
    clientSockets.forEach((s) => {
      s.leave(data.roomId);
    });
    rooms.delete(data.roomId);
  }
};
