import { useState, useMemo, useEffect } from "react";
import { Chess } from "chess.js";
import socket from "../socket";
import CustomDialog from "../components/CustomDialog";
import Board from "../components/Board"
import { List, ListItem, ListItemText, ListSubheader, Stack, Box, useMediaQuery, Avatar } from "@mui/material";
import { useMakeAMove } from "./gameHelper";
import { useSocketListeners } from "../utils/socketListeners";
import DetailsBar from "../components/DetailsBar";
import RoomId from "../components/RoomId";
import Timer from "../components/Timer";
import useSound from '../utils/useSound';

function Game({ players, room, orientation, cleanup, userName, timeControl }) {
    const chess = useMemo(() => new Chess(), []);
    const [fen, setFen] = useState(chess.fen());
    const [over, setOver] = useState("");
    const [whiteTime, setWhiteTime] = useState(timeControl);
    const [blackTime, setBlackTime] = useState(timeControl);
    const [activeColour, setActiveColour] = useState(chess.turn())
    const mdsize = useMediaQuery('(max-width:850px)');
    const { playGameStartSound, playGameEndSound } = useSound();
    const makeAMove = useMakeAMove(chess, setOver, setActiveColour, setFen);
    useSocketListeners(chess, room, cleanup, makeAMove, over, setOver, setWhiteTime, setBlackTime, playGameEndSound);

    useEffect(() => {
        if (players.length >= 2) {
            playGameStartSound()
        }
    }, [players])

    useEffect(() => {
        if (players.length >= 2) {
            const timer = setInterval(() => {
                if (!over) {
                    if (chess.turn() === "w") {
                        setWhiteTime((time) => time - 1);
                    } else {
                        setBlackTime((time) => time - 1);
                    }
                }
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [chess, players, over])

    useEffect(() => {
        if ((whiteTime <= 0 || blackTime <= 0) && !over) {
            socket.emit("checkTime", { whiteTime, blackTime, room });
        }
    }, [chess, whiteTime, blackTime, over, room])

    return (
        <Stack>
            <RoomId room={room}></RoomId>
            <Stack flexDirection={mdsize ? "column" : "row"} sx={{ pt: 2 }}>
                {mdsize && <DetailsBar players={players} colour={orientation === "white" ? "black" : "white"}>
                    <Timer
                        timerFor={orientation === "white" ? "b" : "w"}
                        activeColour={activeColour}
                        time={orientation === "white" ? blackTime : whiteTime}
                    >
                    </Timer>
                </DetailsBar>}
                <Board
                    fen={fen}
                    orientation={orientation}
                    mdsize={mdsize} chess={chess}
                    players={players}
                    makeAMove={makeAMove}
                    room={room}
                >
                </Board>
                {mdsize && <DetailsBar players={players} colour={orientation}> <Timer
                    timerFor={orientation === "white" ? "w" : "b"}
                    activeColour={activeColour}
                    time={orientation === "white" ? whiteTime : blackTime}
                >
                </Timer>
                </DetailsBar>}
                {!mdsize && <Box sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    display: 'flex',
                    flexDirection: "column",
                    flexGrow: 1,
                    marginLeft: "5px",
                    borderRadius: "2px",
                    justifyContent: "space-between"
                }}>
                    <Timer
                        timerFor={orientation === "white" ? "b" : "w"}
                        activeColour={activeColour}
                        time={orientation === "white" ? blackTime : whiteTime}
                    >
                    </Timer>
                    <List>
                        <ListSubheader sx={{ marginBottom: "5px" }}>Players</ListSubheader>
                        {players.map((p, idx) => (
                            <ListItem key={p.id}>
                                <Avatar sx={{
                                    color: idx === 0 ? "white" : "black",
                                    marginRight: "5px"
                                }}>{p?.username[0]}</Avatar>
                                <ListItemText primary={userName === p?.username ? p?.username + " (You)" : p?.username} />
                            </ListItem>
                        ))}
                    </List>
                    <Timer
                        timerFor={orientation === "white" ? "w" : "b"}
                        activeColour={activeColour}
                        time={orientation === "white" ? whiteTime : blackTime}
                    >
                    </Timer>
                </Box>}
            </Stack>
            <CustomDialog // Game Over CustomDialog
                open={Boolean(over)}
                title={over}
                contentText={over}
                handleContinue={() => {
                    socket.emit("closeRoom", { roomId: room });
                    cleanup();
                }}
            />
        </Stack>
    );
}

export default Game;