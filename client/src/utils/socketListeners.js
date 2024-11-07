import socket from "../socket";
import { useEffect } from "react";

export function useSocketListeners(
  chess,
  room,
  cleanup,
  makeAMove,
  over,
  setOver,
  setWhiteTime,
  setBlackTime,
  playGameEndSound
) {
  return useEffect(() => {
    socket.on("move", (move) => {
      makeAMove(move);
    });
    socket.on("time", (time) => {
      setWhiteTime(Math.floor(time.wTime));
      setBlackTime(Math.floor(time.bTime));
    });

    socket.on("playerDisconnected", (player) => {
      setOver(`${player.username} has disconnected`);
    });

    socket.on("closeRoom", ({ roomId }) => {
      if (roomId === room) {
        cleanup();
      }
    });
    socket.on("timeOut", ({ winner }) => {
      playGameEndSound();
      setOver(`TimeOut! ${winner} wins`);
      winner === "White" ? setBlackTime(0) : setWhiteTime(0);
    });
    return () => {
      socket.off("move");
      socket.off("time");
      socket.off("playerDisconnected");
      socket.off("closeRoom");
      socket.off("timeOut");
    };
  }, []);
}
