import React from 'react'
import { Container, Typography } from '@mui/material'

function Welcome({ userName }) {
    return (
        <Container maxWidth="false">
            <Typography
                className='welcome-text'
                variant="h2"
                align="center"
                color="textPrimary"
                gutterBottom
                sx={{
                    fontWeight: 'bold',
                }}
            >
                WELCOME {userName}
            </Typography>
        </Container>
    )
}

export default Welcome