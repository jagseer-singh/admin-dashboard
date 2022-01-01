import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { collection, getDocs } from "firebase/firestore";
import * as React from 'react';
import { db } from "../firebase";
import PatientCard from './PatientCard';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useHistory } from "react-router-dom";

const columns = [
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  { field: 'dateOfBirth', type: 'date', headerName: 'DOB', width: 130 },
  { field: 'gender', headerName: 'Gender', width: 100 },
  { field: 'createdOn', type: 'dateTime', headerName: 'Created On', width: 200 },
  { field: 'lastModifiedOn', type: 'dateTime', headerName: 'Last Modified On', width: 200 },
  { field: 'userName', headerName: 'Created By', width: 130 },
];

export default function PatientsDetails() {
  const history = useHistory();
  const [loading, setLoading] = React.useState(true);
  const [patientsData, setPatientsData] = React.useState([]);
  const [filteredPatientsData, setFilteredPatientsData] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [userFilter, setUserFilter] = React.useState(-1);
  const [nameFilter, setNameFilter] = React.useState('');
  const [nameFilterChange, setNameFilterChange] = React.useState(false);

  const filterUsingName = (name) =>{
    const patientDataTemp = patientsData.filter((patient) => (patient.firstName + ' ' + patient.lastName).toLowerCase().startsWith(name.toLowerCase()));
    setFilteredPatientsData(patientDataTemp);

    setNameFilterChange(false);
  };

  const handleNameFilter = (event) => {
    setNameFilter(event.target.value);
    setNameFilterChange(true)
  };

  const handleFilterChange = (event) => {
    setUserFilter(event.target.value);
  };

  const handleFilterSubmit = (event) => {
    if(userFilter=== -1 ) {
      setFilteredPatientsData(patientsData);
    
    } else {
    const patientDataTemp = patientsData.filter((patient) => patient.userId === users[userFilter].userId);
    setFilteredPatientsData(patientDataTemp);
    
    }
  };

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
      patientsDataTemp.push({...doc.data(), id: doc.id, 
      createdOn: new Date(doc.data().createdOn.seconds * 1000), 
      lastModifiedOn: new Date(doc.data().lastModifiedOn.seconds * 1000),
      userName: userIdNameMap[doc.data().userId],
      dateOfBirth: doc.data().dateOfBirth.split('/')[1]+'/'+doc.data().dateOfBirth.split('/')[0]+'/'+doc.data().dateOfBirth.split('/')[2]
      });
    });
    setPatientsData(patientsDataTemp);
    
    setFilteredPatientsData(patientsDataTemp);
    setLoading(false);
  }
  
  React.useEffect( () => {
    console.log('Hi');
    if(loading){
      getPatientsData();
    }
    if(nameFilterChange){
      filterUsingName(nameFilter)
    }
  });

  return (
    <div>
          <Box className="userFilterContainer">
              <div>
              <InputLabel id="simple-select-label">Filter by user</InputLabel>
              </div>
              <Select
                labelId="simple-select-label"
                id="simple-select"
                label="User"
                value = {userFilter}
                onChange={handleFilterChange}
              >
                <MenuItem value = {-1} >No Filter</MenuItem>
                {
                  Object.keys(users).map((key) => {
                    return <MenuItem value={key}>{users[key].name}</MenuItem>
                })
                }
              </Select>
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick = {handleFilterSubmit}
              >
                Filter
              </Button>
              <TextField
              margin="normal"
              className="name-search"
              label="Search by name"
              name="Name"
              value={nameFilter}
              onChange = {handleNameFilter}
              />
          </Box>
    <Box className = 'patientGridBox' sx={{ flexGrow: 1 }}>
      <div className = "patientGridContainer" >
      <DataGrid
          onRowClick = {(row) => history.push('/patientprofile', { patient: row.row })}
          rows={filteredPatientsData}
          columns={columns}
          pageSize={30}
          rowsPerPageOptions={[30]}
          rowHeight={60}
          autoHeight={true}
        />
      </div>
    </Box>
    </div>
  );
}
