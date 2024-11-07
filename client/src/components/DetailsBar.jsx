import React from 'react'
import { Stack, Box, Typography, Avatar } from '@mui/material'

function DetailsBar({ players, colour, children }) {
    return (

        <Stack direction={'row'} justifyContent={'space-between'} >
            <Stack direction="row" justifyContent="center" alignItems="center">
                <Avatar sx={{
                    color: colour,
                    width: "27px",
                    height: "27px",
                    marginRight: "5px"
                }}>{colour == "white" ? players[0]?.username[0] : players[1] ? players[1].username[0] : ""}</Avatar>
                <Typography sx={{ color: "grey" }}> {colour === "white" ? players[0]?.username : players[1] ? players[1].username : "Waiting..."} </Typography>
            </Stack>
            {children}
        </Stack >
    )
}

export default DetailsBar