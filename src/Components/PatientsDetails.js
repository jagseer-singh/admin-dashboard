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

export default function PatientsDetails() {
  const [loading, setLoading] = React.useState(true);
  const [page, setPage]=React.useState(1);
  const [numOfPages, setNumOfPages]=React.useState(1);
  const [patientsData, setPatientsData] = React.useState([]);
  const [filteredPatientsData, setFilteredPatientsData] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [userFilter, setUserFilter] = React.useState(-1);
  const [userSort, setUserSort] = React.useState(0);
  const [nameFilter, setNameFilter] = React.useState('');
  const [nameFilterChange, setNameFilterChange] = React.useState(false);
  const cardsPerPage = 30;

  const filterUsingName = (name) =>{
    const patientDataTemp = patientsData.filter((patient) => (patient.firstName + ' ' + patient.lastName).toLowerCase().startsWith(name.toLowerCase()));
    setFilteredPatientsData(patientDataTemp);
    setNumOfPages(Math.ceil(patientDataTemp.length/cardsPerPage));
    setNameFilterChange(false);
  };

  const handleNameFilter = (event) => {
    setNameFilter(event.target.value);
    setNameFilterChange(true)
  };

  const handleFilterChange = (event) => {
    setUserFilter(event.target.value);
  };

  const handleSortChange = (event) => {
    const newUserSort=event.target.value;
    setUserSort(newUserSort);
    console.log(newUserSort, userSort);
    if(newUserSort===0){ //A-Z
      setFilteredPatientsData(patientsData.sort(function (a, b){
        if(a.firstName+a.lastName > b.firstName+b.lastName){
          return 1;
        }
        return -1;
      }))
    }
    else if(newUserSort===1){ //Z-A
      setFilteredPatientsData(patientsData.sort(function (a, b){
        if(a.firstName+a.lastName < b.firstName+b.lastName){
          return 1;
        }
        return -1;
      }))
    }
    else if(newUserSort===2){ //date created(latest first)
      setFilteredPatientsData(patientsData.sort(function (a, b){
        if(a.createdOn > b.createdOn){
          return 1;
        }
        return -1;
      }))
    }
    else if(newUserSort===3){ //date created(earliest first)
      setFilteredPatientsData(patientsData.sort(function (a, b){
        if(a.createdOn < b.createdOn){
          return 1;
        }
        return -1;
      }))
    }
    else if(newUserSort===4){
      setFilteredPatientsData(patientsData.sort(function (a, b){
        if(a.lastModifiedOn < b.lastModifiedOn){
          return 1;
        }
        return -1;
      }))
    }
    else{
      setFilteredPatientsData(patientsData.sort(function (a, b){
        if(a.lastModifiedOn > b.lastModifiedOn){
          return 1;
        }
        return -1;
      }))
    }
  };

  const handleFilterSubmit = (event) => {
    if(userFilter=== -1 ) {
      setFilteredPatientsData(patientsData);
      setNumOfPages(Math.ceil(patientsData.length/cardsPerPage));
    } else {
    const patientDataTemp = patientsData.filter((patient) => patient.userId === users[userFilter].userId);
    setFilteredPatientsData(patientDataTemp);
    setNumOfPages(Math.ceil(patientDataTemp.length/cardsPerPage));
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
      patientsDataTemp.push({...doc.data(), patiendId: doc.id, userName: userIdNameMap[doc.data().userId]});
    });
    //patientsDataTemp=patientsDataTemp.concat(patientsDataTemp).concat(patientsDataTemp);
    patientsDataTemp.sort(function (a, b){
      if(a.firstName+a.lastName > b.firstName+b.lastName){
        return 1;
      }
      return -1;
    })
    setPatientsData(patientsDataTemp);
    setNumOfPages(Math.ceil(patientsDataTemp.length/cardsPerPage));
    setFilteredPatientsData(patientsDataTemp);
    setLoading(false);
  }
  
  React.useEffect( () => {
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

              {//sort feature
              }
              {//<InputLabel id="simple-select-label">Sort by:</InputLabel>
              }
              <Select className="sortContainer"
                labelId="simple-sort-label"
                id="simple-sort"
                label="Sort"
                value = {userSort}
                onChange={handleSortChange}
              >
                <MenuItem value = {0} >A-Z</MenuItem>
                <MenuItem value = {1} >Z-A</MenuItem>
                <MenuItem value = {2} >Date Created (Earliest First)</MenuItem>
                <MenuItem value = {3} >Date Created (Latest First)</MenuItem>
                <MenuItem value = {4} >Date Modified (Latest Modified First)</MenuItem>
                <MenuItem value = {4} >Date Modified (Oldest Modified First)</MenuItem>
              </Select>
          </Box>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container rowSpacing={4}>
        { filteredPatientsData.slice(cardsPerPage*(page-1),cardsPerPage*page).map((value) =>
            {return <Grid className = 'patientCard' item xs='auto'>
                <PatientCard patient={value}/>
            </Grid>})
        }
      </Grid>
      <div className='paginationContainer'>
        {!loading &&
        <Pagination count={numOfPages} color="secondary" onChange={(e,value)=>setPage(value)} />
        }
      </div>
    </Box>
    </div>
  );
}
