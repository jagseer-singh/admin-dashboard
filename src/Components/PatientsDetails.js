import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import FormControl from "@mui/material/FormControl";
import { collection, getDocs } from "firebase/firestore";
import * as React from 'react';
import { db } from "../firebase";
import { DataGrid } from '@mui/x-data-grid';
import { useHistory } from "react-router-dom";

const columns = [
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  { field: 'dateOfBirth', type: 'date', headerName: 'DOB (mm/dd/yyyy)', width: 170 },
  { field: 'gender', headerName: 'Gender', width: 100 },
  { field: 'createdOn', type: 'dateTime', headerName: 'Created On (mm/dd/yyyy)', width: 240 },
  { field: 'lastModifiedOn', type: 'dateTime', headerName: 'Last Modified On (mm/dd/yyyy)', width: 240 },
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
  const [reportFilter, setReportFilter] = React.useState(-1);

  const applyFilters = (userF, nameF, reportF) => {
    let filteredDataTemp = patientsData;
    filteredDataTemp = filteredDataTemp.filter((patient) => (patient.firstName + ' ' + patient.lastName).toLowerCase().startsWith(nameF.toLowerCase()));
    if(userF !== -1){
      filteredDataTemp = filteredDataTemp.filter((patient) => patient.userId === users[userF].userId);
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
      userName: userIdNameMap[doc.data().userId],
      dateOfBirth: doc.data().dateOfBirth.split('/')[1]+'/'+doc.data().dateOfBirth.split('/')[0]+'/'+doc.data().dateOfBirth.split('/')[2],
      lastPeriodDate: lpd
      });
    });
    setPatientsData(patientsDataTemp);
    
    setFilteredPatientsData(patientsDataTemp);
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
              <InputLabel id="simple-select-label-1">User</InputLabel>
              <Select
                labelId="simple-select-label-1"
                id="simple-select"
                label="User"
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
              <InputLabel id="simple-select-label-2">Report</InputLabel>
              <Select
                labelId="simple-select-label-2"
                id="simple-select"
                label="Report"
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
          </Box>
    <Box className = 'patientGridBox' sx={{ flexGrow: 1 }}>
      <div className = "patientGridContainer" >
      <DataGrid
          className = "patientDataGrid"
          onRowClick = {(row) => history.push('/patientprofile', { patient: row.row })}
          rows={filteredPatientsData}
          columns={columns}
          pageSize={30}
          rowsPerPageOptions={[30]}
          rowHeight={60}
          autoHeight={true}
          disableExtendRowFullWidth={true}
        />
      </div>
    </Box>
    </div>
  );
}
