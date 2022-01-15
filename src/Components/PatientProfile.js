import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { getDownloadURL, ref } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import * as React from 'react';
import { storage, db } from "../firebase";
import Modal from "./Modal";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const theme = createTheme();

function createData(name, value) {
  return { name, value };
}

const bodyParts = ['left_eye', 'right_eye', 'left_nail', 'right_nail', 'palm_left', 'palm_right', 'tongue'];

export default function PatientProfile(props) {
    const [showLabReport, setShowLabReport]=React.useState(false);
    const [scrollToTop, setScrollToTop] = React.useState(true);
    const [selectedImg, setSelectedImg] = React.useState(null);
    const [loadingLabReport, setLoadingLabReport] = React.useState(true);
    const [loadingImages, setLoadingImages] = React.useState(true);
    const [labReportData, setLabReportData] = React.useState({
      "lab_report_field_crp":"-",
      "lab_report_field_hb":"-",
      "lab_report_field_rbc":"-",
      "lab_report_field_serum_b12":"-",
      "lab_report_field_serum_ferritin":"-",
      "lab_report_field_serum_folate":"-",
      "lab_report_field_serum_iron":"-",
      "lab_report_field_smear":"-",
      "lab_report_field_tibc":"-",
    });

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
        socioEco='Preferred Not To Share';
    }

    if(props.location.state.patient.received===0){
        labReportStatus='Pending';
    }
    else{
        labReportStatus='Received';
    }

    const handleShowReport = (event) => {
      setShowLabReport(!showLabReport);
    };

    const rows = [
      createData('Date of Birth (mm/dd/yyyy)', props.location.state.patient.dateOfBirth),
      createData('Gender', gender),
      createData('Height', props.location.state.patient.height),
      createData('Weight', props.location.state.patient.weight),
      createData('Socio-Economic Status', socioEco),
      createData('Gestation Period', props.location.state.patient.gestationPeriod),
      createData('Last Period Date (mm/dd/yyyy)', props.location.state.patient.lastPeriodDate),
      createData('Lab Report Status', labReportStatus),
      createData('Collected by', props.location.state.patient.userName),
      createData('Created On',props.location.state.patient.createdOn.toDateString()+' '+props.location.state.patient.createdOn.toTimeString()),
      createData('Last Modiefied On',props.location.state.patient.lastModifiedOn.toDateString()+' '+props.location.state.patient.lastModifiedOn.toTimeString()),
    ];

    /*const labReportRows = [
      {
        "lab_report_field_crp":-1,
        "lab_report_field_hb":11,
        "lab_report_field_rbc":158000,
        "lab_report_field_serum_b12":-1,
        "lab_report_field_serum_ferritin":-1,
        "lab_report_field_serum_folate":-1,
        "lab_report_field_serum_iron":188,
        "lab_report_field_smear":"Micro",
        "lab_report_field_tibc":-1,
      }
    ];*/

    async function getLabReport() {
      const labReportDocRef = doc(db, "labReports", props.location.state.patient.id);
      //const labReportDocRef = doc(db, "labReports", "123");
      const labReportSnap = await getDoc(labReportDocRef);
      if(labReportSnap.data()){
        const labReportDataTemp = labReportSnap.data();
        for(const key in labReportDataTemp){
          if(labReportDataTemp[key] === -1){
            labReportDataTemp[key] = "-";
          }
        }
        setLabReportData(labReportDataTemp);
      }
      setLoadingLabReport(false);
    }

    async function getImages() {
      bodyParts.forEach((bodyPart)=> {
        const urlString = `${bodyPart}/${props.location.state.patient.id}`;
        console.log(urlString);
        getDownloadURL(ref(storage, urlString))
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
      setLoadingImages(false);
    }

    React.useEffect( () => {
        if(scrollToTop){
          window.scrollTo(0, 0);
          setScrollToTop(false);
        }
        if(loadingLabReport) {
          getLabReport();
        }
        if(loadingImages) {
          getImages();
        }
      });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        <Box
          className='patientProfileContainer'
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
          </Container>
            <TableContainer className='generalInfoTable' component={Paper}>
              <Table size="small" aria-label="a dense table">
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">{row.name}</TableCell>
                      <TableCell align="right">{row.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div className='reportButtonContainer'>
            <Button onClick={handleShowReport} type="submit" variant="contained" disabled={loadingLabReport}>
              {showLabReport?"Hide":"Show"} Lab Report
            </Button>
            </div>
            {
              showLabReport && 
            <TableContainer className='labReportTable' component={Paper}>
              <Table width="800px" size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Hb</TableCell>
                    <TableCell>RBC Count</TableCell>
                    <TableCell>Smear</TableCell>
                    <TableCell>Serum Iron</TableCell>
                    <TableCell>Ferritin</TableCell>
                    <TableCell>TIBC</TableCell>
                    <TableCell>Serum Folate</TableCell>
                    <TableCell>B12</TableCell>
                    <TableCell>CRP</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow
                      key={labReportData.lab_report_field_crp}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell align="right">{labReportData.lab_report_field_hb} gm/dl</TableCell>
                      <TableCell align="right">{labReportData.lab_report_field_rbc} mm/cmm</TableCell>
                      <TableCell align="right">{labReportData.lab_report_field_smear}</TableCell>
                      <TableCell align="right">{labReportData.lab_report_field_serum_iron} mcg/dl</TableCell>
                      <TableCell align="right">{labReportData.lab_report_field_serum_ferritin} ng/ml</TableCell>
                      <TableCell align="right">{labReportData.lab_report_field_tibc} mcg/dl</TableCell>
                      <TableCell align="right">{labReportData.lab_report_field_serum_folate} ng/ml</TableCell>
                      <TableCell align="right">{labReportData.lab_report_field_serum_b12}</TableCell>
                      <TableCell align="right">{labReportData.lab_report_field_crp}</TableCell>
                    </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            }
        </Box>
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