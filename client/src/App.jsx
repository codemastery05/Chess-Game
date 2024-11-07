import { useEffect, useState, useCallback } from "react";
import { TextField, Container } from "@mui/material";
import Game from "./game/Game";
import InitGame from "./game/InitGame";
import CustomDialog from "./components/CustomDialog";
import socket from "./socket";
import './App.css';


export default function App() {
  const [username, setUsername] = useState("");
  const [usernameSubmitted, setUsernameSubmitted] = useState(false);
  const [room, setRoom] = useState("");
  const [orientation, setOrientation] = useState("");
  const [players, setPlayers] = useState([]);
  const [timeControl, setTimeControl] = useState(0);

  // resets the states responsible for initializing a game
  const cleanup = useCallback(() => {
    setRoom("");
    setOrientation("");
    setPlayers("");
    setTimeControl(0);
  }, []);

  useEffect(() => {
    socket.on("opponentJoined", (roomData) => {
      console.log("roomData", roomData)
      setPlayers(roomData.players);
    });
  }, []);

  function handleSubmit() {
    if (!username) return;
    socket.emit("username", username);
    setUsernameSubmitted(true);
  }

  return (
    // <div style={room ? {
    //   backgroundColor: "black",
    //   minHeight: '100vh',
    //   paddingBottom: "5px"
    // } :
    //   {
    //     backgroundColor: "black",
    //     minHeight: '100vh',
    //     paddingBottom: "5px"
    //   }}>
    <div className={room ? "game" : "lobby"}>
      <Container>
        <CustomDialog
          open={!usernameSubmitted}
          title="Pick a username"
          contentText="Please select a username"
          handleContinue={handleSubmit}
        >
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="Username"
            name="username"
            inputProps={{
              maxLength: 10,
            }}
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            fullWidth
            variant="standard"
          />
        </CustomDialog>
        {room ? (
          <Game
            room={room}
            orientation={orientation}
            username={username}
            players={players}
            userName={username}
            // the cleanup function will be used by Game to reset the state when a game is over
            cleanup={cleanup}
            timeControl={timeControl}
          />
        ) : (
          <InitGame
            setRoom={setRoom}
            setOrientation={setOrientation}
            setPlayers={setPlayers}
            userName={username}
            setTimeControl={setTimeControl}
          />
        )}
      </Container>
    </div>
  );
}