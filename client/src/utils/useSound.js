import { useRef } from 'react';
import {
  captureSound,
  castleSound,
  gameEndSound,
  gameStartSound,
  illegalSound,
  moveSound,
} from '../assets/sounds';

export default function useSound() {
  const captureAudioRef = useRef(new Audio(captureSound));
  const castleAudioRef = useRef(new Audio(castleSound));
  const gameEndAudioRef = useRef(new Audio(gameEndSound));
  const gameStartAudioRef = useRef(new Audio(gameStartSound));
  const illegalAudioRef = useRef(new Audio(illegalSound));
  const moveAudioRef = useRef(new Audio(moveSound));

  const playCaptureSound = () => captureAudioRef.current.play();
  const playCastleSound = () => castleAudioRef.current.play();
  const playGameEndSound = () => gameEndAudioRef.current.play();
  const playGameStartSound = () => gameStartAudioRef.current.play();
  const playIllegalSound = () => illegalAudioRef.current.play();
  const playMoveSound = () => moveAudioRef.current.play();

  return {
    playCaptureSound,
    playCastleSound,
    playGameEndSound,
    playGameStartSound,
    playIllegalSound,
    playMoveSound,
  };
}
