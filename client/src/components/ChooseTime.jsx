import { useState } from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Stack } from '@mui/system';
import Slider from '@mui/material/Slider';
import { Button, Typography, useMediaQuery } from '@mui/material';
import socket from '../socket';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function ChooseTime({ setRoom, setPlayers, setOrientation, setTimeControl, setChooseTimeOpen }) {
    const mdsize = useMediaQuery('(max-width:850px)');
    const [time, setTime] = useState(300);

    const handleSliderChange = (event, newValue) => {
        setTime(Number(newValue) * 60);
    };
    const quickTimings = [["30 Secs", 30], ["1 Min", 60], [" 5 Mins", 300], ["10 Mins", 600], ["15 Mins", 900], ["30 Mins", 1800]]

    function handleCreate(t) {
        socket.emit("createRoom", { timeControl: Number(t) }, (r) => {
            setRoom(r?.roomId);
            setPlayers(r?.players)
            setOrientation("white");
            setTimeControl(r?.whiteTime);
        });
        setChooseTimeOpen(false);
    }
    return (
        <Stack sx={{ width: mdsize ? '100%' : '70%' }}>
            <Box sx={{ marginBottom: "20px" }}>
                <Typography variant="h5" fontWeight="500" sx={{ marginBottom: "10px" }}> QUICK START</Typography>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        {quickTimings.map((val, index) => (
                            <Grid item xs={2} sm={4} md={4} key={index} >
                                <Item
                                    sx={{
                                        fontSize: "18px",
                                        cursor: "pointer",
                                        '&:hover': {
                                            backgroundColor: 'primary.main',
                                            color: 'primary.contrastText',
                                        }
                                    }}
                                    onClick={() => handleCreate(val[1])}
                                >
                                    {val[0]}
                                </Item>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
            <Box>
                <Typography variant="h5" fontWeight="500"> CUSTOM TIMING</Typography>
                <Slider
                    defaultValue={5}
                    min={1}
                    max={90}
                    aria-label="Default"
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value} Mins`}
                    onChange={handleSliderChange}
                />
            </Box>
            <Stack sx={{ justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
                <Typography variant="h7" > Minutes per side: {time / 60}</Typography>
                <Stack direction="row" spacing={2} sx={{ marginTop: "20px" }}>
                    <Button variant='contained' onClick={() => setChooseTimeOpen(false)} >BACK</Button>
                    <Button variant='contained' onClick={() => handleCreate(time)} >CREATE</Button>
                </Stack>
            </Stack>
        </Stack >
    )
}

export default ChooseTime