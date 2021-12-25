import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";


const bodyParts = ['left_eye', 'right_eye', 'left_nail', 'right_nail', 'palm_left', 'palm_right', 'tongue'];

const theme = createTheme();

export default function PatientProfile(props) {
    
    React.useEffect( () => {
        
        bodyParts.forEach((bodyPart)=> {
            const urlString = `${bodyPart}/${props.location.state.patient.patiendId}`;
            console.log(urlString);
        getDownloadURL(ref(storage, urlString))
        //getDownloadURL(ref(storage, 'left_eye/Rtfat90PqpMkcD3wWcnT'))
        .then((url) => {
          const xhr = new XMLHttpRequest();
          
          xhr.responseType = 'blob';
          xhr.onload = (event) => {
            const blob = xhr.response;
          };
          xhr.open('GET', url);
          xhr.send();
          const img = document.getElementById(bodyPart);
          img.setAttribute('src', url);
        })
        .catch((error) => {
          const img = document.getElementById(bodyPart);
          img.setAttribute('alt', 'NOT FOUND')
    });
  });
});
  return (
    <ThemeProvider theme={theme}>
        {console.log(props)}
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              {props.location.state.patient.firstName} {props.location.state.patient.lastName}
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {bodyParts.map((bodyPart) => (
              <Grid item key={bodyPart} xs={4}>
                  <img 
                    className="imageContainerimg"
                    id= {bodyPart}
                    alt={bodyPart}
                    loading="lazy"
                    />
                    <figcaption>{bodyPart.toUpperCase().split('_')[0]} {bodyPart.toUpperCase().split('_')[1]}</figcaption>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </ThemeProvider>
  );
}