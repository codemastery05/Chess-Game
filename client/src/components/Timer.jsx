import React from 'react'
import { Box, Typography, useMediaQuery } from '@mui/material'

function Timer({ timerFor, activeColour, time }) {
    const mdsize = useMediaQuery('(max-width:850px)');

    return (
        <Box sx={{
            padding: mdsize ? "0" : "15px",
            backgroundColor: !mdsize ? 'rgba(0, 0, 0, 0.7)' : "",
            color: 'white',
        }}>
            <Typography
                variant={mdsize ? "h5" : "h2"} component="div"
                align="center"
                sx={{ color: activeColour === timerFor ? 'green' : 'lightgrey', fontWeight: "400", marginBottom: !mdsize ? '0.35em' : "0" }}
            >
                {Math.floor(time / 60)}:{time % 60 < 10 ? '0' : ''}{time % 60}
            </Typography>
        </Box>
    )
}

export default Timer