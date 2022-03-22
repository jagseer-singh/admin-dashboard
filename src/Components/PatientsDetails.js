import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import FormControl from "@mui/material/FormControl";
import { collection, getDocs, setDoc } from "firebase/firestore";
import * as React from 'react';
import { db,storage } from "../firebase";
import { DataGrid } from '@mui/x-data-grid';
import { useHistory } from "react-router-dom";
import { deleteDoc, doc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { CSVLink, CSVDownload } from 'react-csv';

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
  { label: "First Name", key: "firstName" },
  { label: "Last Name", key: "lastName" }
];

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

  async function downloadPatientsData(){
    setDownloadingData(true);

    csvLink.current.link.click()
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
                disabled = {downloadingData || loading}
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick = {downloadPatientsData}
              >
                Download Data
              </Button>
                <CSVLink
                  data={csvData}
                  headers={csvDataHeaders}
                  filename={"temp.csv"}
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
  );
}
