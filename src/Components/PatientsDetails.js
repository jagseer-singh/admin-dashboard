import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import FormControl from "@mui/material/FormControl";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { collection, getDocs, setDoc } from "firebase/firestore";
import * as React from 'react';
import { db,storage } from "../firebase";
import { DataGrid } from '@mui/x-data-grid';
import { useHistory } from "react-router-dom";
import { deleteDoc, doc } from "firebase/firestore";
import { ref, deleteObject, getDownloadURL } from "firebase/storage";
import { CSVLink, CSVDownload } from 'react-csv';
import { saveAs } from 'file-saver';
import { resolveMotionValue } from 'framer-motion';

var zip = require('jszip')();
var left_eye_folder = zip.folder("left_eye");
var right_eye_folder = zip.folder("right_eye");
var left_nail_folder = zip.folder("left_nail");
var right_nail_folder = zip.folder("right_nail");
var palm_left_folder = zip.folder("palm_left");
var palm_right_folder = zip.folder("palm_right");
var tongue_folder = zip.folder("tongue");

const columns = [
  { field: 'firstName', headerName: 'First name', width: 160 },
  { field: 'lastName', headerName: 'Last name', width: 160 },
  { field: 'dateOfBirth', sortable: false, headerName: 'DOB (mm/dd/yyyy)', width: 180 },
  { field: 'gender', headerName: 'Gender', width: 100 },
  { field: 'createdOn', type: 'dateTime', headerName: 'Created On (mm/dd/yyyy)', width: 250 },
  { field: 'lastModifiedOn', type: 'dateTime', headerName: 'Last Modified On (mm/dd/yyyy)', width: 250 },
  { field: 'userName', headerName: 'Created By', width: 180 },
];

const csvDataHeaders = [
  { label: "Patient ID", key: "patientId" },
  { label: "First Name", key: "firstName" },
  { label: "Last Name", key: "lastName" },
  { label: "User Name", key: "userName" },
  { label: "Created On", key: "createdOn" },
  { label: "Creator User ID", key: "creatorUserId" },
  { label: "Date Of Birth", key: "dateOfBirth" },
  { label: "Gender", key: "gender" },
  { label: "Gestation Period", key: "gestationPeriod" },
  { label: "Height", key: "height" },
  { label: "Last Modified On", key: "lastModifiedOn" },
  { label: "Last Period Date", key: "lastPeriodDate" },
  { label: "Organisation Patient ID", key: "organisationPatientId" },
  { label: "Socio-economic status", key: "socioEconomicStatus" },
  { label: "Weight", key: "weight" },
  { label: "First Impression Received", key: "firstImpressionReceived" },
  { label: "Anaemia", key: "anemia" },
  { label: "Malnutrition", key: "malnutrition" },
  { label: "Lab Report Received", key: "received" },
  { label: "CRP", key: "lab_report_field_crp" },
  { label: "HB", key: "lab_report_field_hb" },
  { label: "RBC", key: "lab_report_field_rbc" },
  { label: "Serum B12", key: "lab_report_field_serum_b12" },
  { label: "Serum Ferritin", key: "lab_report_field_serum_ferritin" },
  { label: "Serum Folate", key: "lab_report_field_serum_folate" },
  { label: "Serum Iron", key: "lab_report_field_serum_iron" },
  { label: "Smear", key: "lab_report_field_smear" },
  { label: "TIBC", key: "lab_report_field_tibc" },
];

const bodyParts = ['left_eye', 'right_eye', 'left_nail', 'right_nail', 'palm_left', 'palm_right', 'tongue'];

export default function PatientsDetails() {
  const history = useHistory();
  const csvLink = React.createRef()

  const [loading, setLoading] = React.useState(true);
  const [patientsData, setPatientsData] = React.useState([]);
  const [filteredPatientsData, setFilteredPatientsData] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [userFilter, setUserFilter] = React.useState(-1);
  const [nameFilter, setNameFilter] = React.useState('');
  const [reportFilter, setReportFilter] = React.useState(-1);
  const [selectedPatients, setSelectedPatients] = React.useState([]);
  const [deletingPatients, setDeletingPatients] = React.useState(false);
  const [downloadingData, setDownloadingData] = React.useState(false);
  const [downloadingZip, setDownloadingZip] = React.useState(false);
  const [zippingFiles, setZippingFiles] = React.useState(false);
  const [zipPercent, setZipPercent] = React.useState(0);
  const [patientData, setUserData] = React.useState([]);
  const [csvData, setCsvData] = React.useState([]);

  const applyFilters = (userF, nameF, reportF) => {
    let filteredDataTemp = patientsData;
    filteredDataTemp = filteredDataTemp.filter((patient) => (patient.firstName + ' ' + patient.lastName).toLowerCase().startsWith(nameF.toLowerCase()));
    if(userF !== -1){
      filteredDataTemp = filteredDataTemp.filter((patient) => patient.creatorUserId === users[userF].userId);
    }
    if(reportF !== -1){
      filteredDataTemp = filteredDataTemp.filter((patient) => patient.received === reportF);
    }
    setFilteredPatientsData(filteredDataTemp);
  }

  const handleNameFilterChange = (event) => {
    const name = event.target.value;
    applyFilters(userFilter, name, reportFilter);
    setNameFilter(name);
  };

  const handleReportFilterChange = (event) => {
    const report = event.target.value;
    applyFilters(userFilter, nameFilter, report);
    setReportFilter(report);
  };

  const handleUserFilterChange = (event) => {
    const user = event.target.value;
    applyFilters(user, nameFilter, reportFilter);
    setUserFilter(user);
  };

  const handleFilterClear = (event) => {
    setUserFilter(-1);
    setNameFilter('');
    setReportFilter(-1);
    applyFilters(-1, '', -1);
  };

  const handleDeletePatients = async() => {
    setDeletingPatients(true);
    const imagesCollRef = collection(db, "images");
    const imagesSnap = await getDocs(imagesCollRef);
    const patientIdImageIdMap = {};
    const imageRefMap = {};
    imagesSnap.docs.forEach((doc) => {
      imageRefMap[doc.id] = doc.data().firebaseRef;
      if(patientIdImageIdMap[doc.data().patientId]){
        patientIdImageIdMap[doc.data().patientId].push(doc.id);
      }
      else{
        patientIdImageIdMap[doc.data().patientId]= [doc.id];
      }
    });
    if(selectedPatients.length > 0){
      for(const patientId of selectedPatients){

        await deleteDoc(doc(db, "firstImpression", patientId));
        await deleteDoc(doc(db, "labReports", patientId));
        
        if(patientIdImageIdMap[patientId]){
          for(const imageId of patientIdImageIdMap[patientId]){
            
            const desertRef = ref(storage, imageRefMap[imageId]);
            deleteObject(desertRef).then(() => {
              // File deleted successfully
              console.log("Image Delete:",imageRefMap[imageId]);
            }).catch((error) => {
              // Uh-oh, an error occurred!
              alert("Error while deleting image from storage", imageRefMap[imageId]);
            });

            await deleteDoc(doc(db,"images",imageId));
          }
        }
        await deleteDoc(doc(db, "patients", patientId));
      }
      setLoading(true);
      alert("Patients successfully deleted!!")
    } 
    else {
      alert("No patient selected!!")
    }
    setDeletingPatients(false);
    
  };

  async function downloadZip(){
    console.log("Downloading zip...");
    setZippingFiles(true);
    await zip.generateAsync({type:"blob"}).then(function(content) {
      // see FileSaver.js
      saveAs(content, "dataset.zip");
    });
    setDownloadingZip(false);
    setZipPercent(0);
    setZippingFiles(false);
    console.log("Zip downloaded");
  }

  function updateZipPercent(metadata){
    setZipPercent(metadata.percent);
  }

  function getImages(csvData, i){
    return new Promise(function (resolve, reject) {
        let count = 0;
        let totalCount = 7 * bodyParts.length;
       for(let a=0; a<7; a++){
        if( (i+a) >=csvData.length){
          count+=7;
          continue;
        }
         //console.log("i,a:",i," ", a);
         for(const bodyPart of bodyParts) {
          const patient = csvData[i+a];
          const urlString = `${bodyPart}/${patient.id}`;
          //console.log(urlString);
          getDownloadURL(ref(storage, urlString))
          .then((url) => {

            const xhr = new XMLHttpRequest();

            xhr.responseType = 'blob';
            xhr.onload = (event) => {
              const blob = xhr.response;
              const fileExt = blob.type.split("/")[1];
              if(bodyPart == "tongue"){
                tongue_folder.file(`${patient.patientId}.${fileExt}`, blob);
              }
              else if(bodyPart == "left_eye"){
                left_eye_folder.file(`${patient.patientId}.${fileExt}`, blob);
              }
              else if(bodyPart == "right_eye"){
                right_eye_folder.file(`${patient.patientId}.${fileExt}`, blob);
              }
              else if(bodyPart == "left_nail"){
                left_nail_folder.file(`${patient.patientId}.${fileExt}`, blob);
              }
              else if(bodyPart == "right_nail"){
                right_nail_folder.file(`${patient.patientId}.${fileExt}`, blob);
              }
              else if(bodyPart == "palm_right"){
                palm_right_folder.file(`${patient.patientId}.${fileExt}`, blob);
              }
              else if(bodyPart == "palm_left"){
                palm_left_folder.file(`${patient.patientId}.${fileExt}`, blob);
              }
              count++;
              //console.log("Count:", count, totalCount);
              if(count === totalCount ){
                resolve(xhr.status);
              }
            };
            xhr.open('GET', url);
            xhr.send();
            
          })
          .catch((error) => {
            console.log("ERROR:",error);
            count++;
            //console.log("Count:", count, totalCount);
            if(count === totalCount){
              resolve(error);
            }
          })
        }
        
       }
    });
  }

  async function downloadPatientsData(){
    setDownloadingData(true);

    csvLink.current.link.click();
    setDownloadingZip(true);
    //console.log(csvData, bodyParts);
    let patientCount = 0;
    for(let i=0; i<csvData.length ; i+=7){
        //console.log("I:", i);
        const img = await getImages(csvData, i);
        patientCount+=7;
        setZipPercent(patientCount*100/csvData.length);
    }
    downloadZip();
    setDownloadingData(false);
  }

  async function getPatientsData() {
    const usersCollRef = collection(db, "users");
    const usersSnap = await getDocs(usersCollRef);
    const userIdNameMap = {};
    const users = {};
    usersSnap.docs.forEach((doc, index) => {
      users[index] = { name: doc.data().name, userId: doc.id };
      userIdNameMap[doc.id] = doc.data().name;
    });
    setUsers(users);

    const patientCollRef = collection(db, "patients");
    const patientSnap = await getDocs(patientCollRef);
    let patientsDataTemp = [];
    patientSnap.docs.forEach((doc) => {
      let lpd = "-";
      if(doc.data().lastPeriodDate){
        lpd = doc.data().lastPeriodDate.split('/')[1]+'/'+doc.data().lastPeriodDate.split('/')[0]+'/'+doc.data().lastPeriodDate.split('/')[2]
      }
      patientsDataTemp.push({...doc.data(), id: doc.id, 
      createdOn: new Date(doc.data().createdOn.seconds * 1000), 
      lastModifiedOn: new Date(doc.data().lastModifiedOn.seconds * 1000),
      userName: userIdNameMap[doc.data().creatorUserId],
      dateOfBirth: doc.data().dateOfBirth.split('/')[1]+'/'+doc.data().dateOfBirth.split('/')[0]+'/'+doc.data().dateOfBirth.split('/')[2],
      lastPeriodDate: lpd
      });
    });
    setPatientsData(patientsDataTemp);
    
    setFilteredPatientsData(patientsDataTemp);

    const patientDataMap = {};
    patientsDataTemp.forEach((patient) => {
      patientDataMap[patient.id] = patient
    })

    const labReportRef = collection(db, "labReports");
    const labReportSnap = await getDocs(labReportRef);
    labReportSnap.docs.forEach((doc) => {
      patientDataMap[doc.id] = {...patientDataMap[doc.id], ...doc.data()};
    })

    const firstImpressionRef = collection(db, "firstImpression");
    const firstImpressionSnap = await getDocs(firstImpressionRef);
    firstImpressionSnap.docs.forEach((doc) => {
      patientDataMap[doc.id] = {...patientDataMap[doc.id], ...doc.data()};
    })

    const csvDataTemp = [];
    for(const key in patientDataMap){
      csvDataTemp.push(patientDataMap[key]);
    }
    setCsvData(csvDataTemp);
    setLoading(false);
  }
  
  React.useEffect( () => {
    if(loading){
      getPatientsData();
    }
  });

  return (
    <React.Fragment>
    { downloadingZip == true ? 
    <Backdrop
        sx={{ backgroundColor: "rgb(255,255,255,0.85)",
        color: "blue", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
       { zippingFiles ? 
       <CircularProgress size="10rem" thickness={1.5}/>
       :
       <CircularProgress size="10rem" thickness={1.5} variant="determinate" value = {Math.round(zipPercent)} /> }
       <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 300,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography sx={{ fontSize: 20, m: 1 }}  color="text.primary" >
          { zippingFiles ? "Zipping Files, this might take a while..." : "Retrieving Data"}
        </Typography>
      </Box>
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography sx={{ fontSize: 25, m: 1 }} variant="caption" component="div" color="text.primary">
          {zippingFiles ? "Zipping" :`${zipPercent.toFixed(1)}%`}
        </Typography>
      </Box>
      </Backdrop> :
      <div></div>
      }
    <div>
          <Box className="filterContainer">
            <FormControl className="userFilter">
              <InputLabel id="simple-select-label-1">Created By</InputLabel>
              <Select
                labelId="simple-select-label-1"
                id="simple-select"
                label="Created By"
                value = {userFilter}
                onChange={handleUserFilterChange}
              >
                <MenuItem value = {-1} >No Filter</MenuItem>
                {
                  Object.keys(users).map((key) => {
                    return <MenuItem value={key}>{users[key].name}</MenuItem>
                })
                }
              </Select>
            </FormControl>
            <FormControl className="reportFilter">
              <InputLabel id="simple-select-label-2">Report Status</InputLabel>
              <Select
                labelId="simple-select-label-2"
                id="simple-select"
                label="Report Status"
                value = {reportFilter}
                onChange={handleReportFilterChange}
              >
                <MenuItem value = {-1} >No Filter</MenuItem>
                <MenuItem value = {0} >Pending</MenuItem>
                <MenuItem value = {1} >Received</MenuItem>
              </Select>
            </FormControl>
              <TextField
              margin="normal"
              className="name-search"
              label="Search by patient name"
              name="Name"
              value={nameFilter}
              onChange = {handleNameFilterChange}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick = {handleFilterClear}
              >
                Clear Filters
              </Button>
              <Button
                disabled = {deletingPatients}
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick = {handleDeletePatients}
              >
                Delete selected patients
              </Button>
              <Button
                disabled = {downloadingData || loading || downloadingZip}
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick = {downloadPatientsData}
              >
                {downloadingData || downloadingZip ? "Downloading...":"Download Data"}
              </Button>
                <CSVLink
                  data={csvData}
                  headers={csvDataHeaders}
                  filename={"patient.csv"}
                  ref = {csvLink}
                  target="_blank" 
                >
                </CSVLink>
          </Box>
      <Box className = 'patientGridBox' sx={{ flexGrow: 1 }}>
        <div className = "patientGridContainer" >
        <DataGrid
            checkboxSelection
            className = "patientDataGrid"
            onRowClick = {(row) => history.push('/patientprofile', { patient: row.row })}
            rows={filteredPatientsData}
            columns={columns}
            pageSize={30}
            loading = {loading}
            rowsPerPageOptions={[30]}
            rowHeight={60}
            autoHeight={true}
            disableExtendRowFullWidth={true}
            onSelectionModelChange = {itm => setSelectedPatients(itm)}
          />
        </div>
      </Box>
    </div>
    </React.Fragment>
  );
}
