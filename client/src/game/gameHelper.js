import { useCallback } from "react";
import useSound from "../utils/useSound";

export function useMakeAMove(chess, setOver, setActiveColour, setFen) {
  const {
    playCaptureSound,
    playCastleSound,
    playGameEndSound,
    playIllegalSound,
    playMoveSound,
  } = useSound();

  return useCallback(
    (move) => {
      try {
        const result = chess.move(move);
        setFen(chess.fen());
        if (chess.isGameOver()) {
          playGameEndSound();
          if (chess.isCheckmate()) {
            setOver(
              `Checkmate! ${chess.turn() === "w" ? "black" : "white"} wins!`
            );
          } else if (chess.isDraw()) {
            setOver("Draw");
          } else {
            setOver("Game over");
          }
        } else {
          if (result) {
            if (result.flags.includes("c")) {
              playCaptureSound();
            } else if (
              result.flags.includes("k") ||
              result.flags.includes("q")
            ) {
              playCastleSound();
            } else {
              playMoveSound();
            }
          }
        }
        setActiveColour(chess.turn());
        return result;
      } catch (e) {
        playIllegalSound(); // Play illegal move sound
        return null;
      }
    },
    [chess]
  );
}
