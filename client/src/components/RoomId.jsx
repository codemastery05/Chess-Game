import React, { useState } from 'react'
import { Card, CardContent, Typography, Tooltip } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import copy from "copy-to-clipboard"

function RoomId({ room }) {

    const [isRoomIdCopied, setRoomIdCopied] = useState(false)
    function handleCopy() {
        copy(room);
        setRoomIdCopied(true);
        setTimeout(() => {
            setRoomIdCopied(false);
        }, 2000);
    }
    return (
        <Card sx={{ marginTop: "10px" }}>
            <CardContent>
                <Typography variant="h6" >
                    Room ID: {room}
                    {isRoomIdCopied ?
                        <Tooltip title="Copied">
                            <DoneRoundedIcon
                                sx={{
                                    color: 'green',
                                    fontSize: 20,
                                    marginLeft: "10px",
                                }} />
                        </Tooltip>
                        :
                        <Tooltip title="Copy">
                            <ContentCopyIcon onClick={handleCopy}
                                sx={{
                                    cursor: 'pointer',
                                    fontSize: 20,
                                    color: "grey",
                                    marginLeft: "10px",
                                    transition: 'color 0.3s',
                                    '&:hover': {
                                        color: 'green',
                                    },
                                }} />
                        </Tooltip>
                    }
                </Typography>
            </CardContent>
        </Card>
    )
}

export default RoomId