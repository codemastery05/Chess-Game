import { Button, Stack, TextField, Container, Typography, Box } from "@mui/material";
import { useState } from "react";
import CustomDialog from "../components/CustomDialog";
import socket from '../socket';
import Welcome from "../components/Welcome";
import ChooseTime from "../components/ChooseTime";


export default function InitGame({ setRoom, setOrientation, setPlayers, userName, setTimeControl }) {
    const [roomDialogOpen, setRoomDialogOpen] = useState(false);
    const [roomInput, setRoomInput] = useState(''); // input state
    const [roomError, setRoomError] = useState('');
    const [chooseTimeOpen, setChooseTimeOpen] = useState(false);

    function handleJoinRoom() {
        if (!roomInput) return;
        socket.emit("joinRoom", { roomId: roomInput }, (r) => {
            if (r?.error) return setRoomError(r?.message);
            setRoom(r?.roomId);
            setPlayers(r?.players);
            setOrientation("black");
            setTimeControl(r?.blackTime);
            setRoomDialogOpen(false);
        });
    }

    function handleCreateRoom() {
        setChooseTimeOpen(true);
    }
    return (
        <div>
            <Welcome userName={userName}></Welcome>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "70vh",
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '10px',
                    padding: '20px',
                }}
            >
                <CustomDialog
                    open={roomDialogOpen}
                    handleClose={() => setRoomDialogOpen(false)}
                    title="Select Room to Join"
                    contentText="Enter a valid room ID to join the room"
                    handleContinue={handleJoinRoom}
                >
                    <TextField
                        autoFocus
                        margin="dense"
                        id="room"
                        label="Room ID"
                        name="room"
                        value={roomInput}
                        required
                        onChange={(e) => setRoomInput(e.target.value)}
                        type="text"
                        fullWidth
                        variant="standard"
                        error={Boolean(roomError)}
                        helperText={!roomError ? 'Enter a room ID' : `Invalid room ID: ${roomError}`}
                    />
                </CustomDialog>
                {
                    chooseTimeOpen ?
                        <ChooseTime
                            setRoom={setRoom}
                            setPlayers={setPlayers}
                            setOrientation={setOrientation}
                            setTimeControl={setTimeControl}
                            setChooseTimeOpen={setChooseTimeOpen}
                        /> :
                        <Stack
                            justifyContent="center"
                            alignItems="center">
                            <Button variant="contained" onClick={handleCreateRoom} size="large" style={{ fontSize: '1.5rem' }}>
                                Start a game
                            </Button>
                            <Button onClick={() => setRoomDialogOpen(true)} size="large" style={{ fontSize: '1.5rem' }}>
                                Join a game
                            </Button>
                        </Stack>
                }
            </Box>
        </div >
    );
}