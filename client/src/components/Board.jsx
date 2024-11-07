import React from 'react';
import { Chessboard } from "react-chessboard";
import socket from '../socket';

function Board({ fen, orientation, mdsize, chess, players, makeAMove, room }) {
    function onDrop(sourceSquare, targetSquare) {
        // orientation is either 'white' or 'black'. game.turn() returns 'w' or 'b'
        if (chess.turn() !== orientation[0]) return false; //  prohibit player from moving piece of other player
        if (players.length < 2) return false; // disallow a move if the opponent has not joined
        const moveData = {
            from: sourceSquare,
            to: targetSquare,
            color: chess.turn(),
            promotion: "q",
        };
        const move = makeAMove(moveData);
        // illegal move
        if (move === null) return false;
        socket.emit("move", {
            move,
            room,
        })
        return true;
    }

    return (
        <div className="board" style={{
            maxWidth: mdsize ? '100%' : "85vh",
            maxHeight: mdsize ? '100%' : "85vh",
            flexGrow: 1,
        }}>
            <Chessboard
                position={fen}
                onPieceDrop={onDrop}
                boardOrientation={orientation}
            />
        </div>
    );
}

export default Board;
