import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { getDownloadURL, ref } from "firebase/storage";
import * as React from 'react';
import { storage } from "../firebase";
import Modal from "./Modal";

const bodyParts = ['left_eye', 'right_eye', 'left_nail', 'right_nail', 'palm_left', 'palm_right', 'tongue'];

const theme = createTheme();

export default function PatientProfile(props) {
    let gender,socioEco,labReportStatus;
    if(props.location.state.patient.gender==='M'){
        gender='Male';
    }
    else if(props.location.state.patient.gender==='F'){
        gender='Female';
    }
    else{
        gender='Others';
    }

    if(props.location.state.patient.socioEconomicStatus === 'APL'){
        socioEco='Above Poverty Line';
    }
    else if(props.location.state.patient.socioEconomicStatus === 'BPL'){
        socioEco='Below Poverty Line';
    }
    else{
        socioEco='Preferred Not to Share';
    }

    if(props.location.state.patient.received===0){
        labReportStatus='Pending';
    }
    else{
        labReportStatus='Received';
    }

    const [selectedImg, setSelectedImg] = React.useState(null);

    React.useEffect( () => {
        window.scrollTo(0, 0);
        bodyParts.forEach((bodyPart)=> {
            const urlString = `${bodyPart}/${props.location.state.patient.id}`;
            console.log(urlString);
        getDownloadURL(ref(storage, urlString))
        //getDownloadURL(ref(storage, 'left_eye/Rtfat90PqpMkcD3wWcnT'))
        .then((url) => {
          const xhr = new XMLHttpRequest();
          
          xhr.responseType = 'blob';
          xhr.onload = (event) => {
            const blob = xhr.response;
            console.log(blob);
          };
          xhr.open('GET', url);
          xhr.send();
          const img = document.getElementById(bodyPart);
          img.setAttribute('src', url);
        })
        .catch((error) => {
          const img = document.getElementById(bodyPart);
          img.setAttribute('alt', 'NOT FOUND')
          img.setAttribute('src', 'image/imgNotFound.png')
    });
  });
});
  return (
    <ThemeProvider theme={theme}>
        {console.log(props)}
      <CssBaseline />
      <main>
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
            <Typography>
                Gender: {gender}
            </Typography>
            <Typography>
                DOB: {props.location.state.patient.dateOfBirth}
            </Typography>
            <Typography>
                Collected By: {props.location.state.patient.userName}
            </Typography>
            <Typography>
                Socio-Economic Status: {socioEco}
            </Typography>
            <Typography>
                Lab Report Status: {labReportStatus}
            </Typography>
            <Typography>
                Patient Created On: {props.location.state.patient.createdOn.toDateString()} {props.location.state.patient.createdOn.toLocaleTimeString()}
            </Typography>
          </Container>
        </Box>
        {console.log(props)}
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {bodyParts.map((bodyPart) => (
              <Grid item key={bodyPart} xs={4}>
                <div onClick = {() => setSelectedImg(document.getElementById(bodyPart).getAttribute('src'))}>
                  <img 
                    className="imageContainerimg"
                    id= {bodyPart}
                    alt={bodyPart}
                    src = "image/loadingImage.png"
                    loading="lazy"
                    />
                    <figcaption>{bodyPart.toUpperCase().split('_')[0]} {bodyPart.toUpperCase().split('_')[1]}</figcaption>
                </div>
              </Grid>
            ))}
          </Grid>
        </Container>
        { selectedImg && <Modal setSelectedImg= {setSelectedImg} selectedImg = {selectedImg} /> }
      </main>
    </ThemeProvider>
  );
}