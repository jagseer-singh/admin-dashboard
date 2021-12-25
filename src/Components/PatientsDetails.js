import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { db } from "../firebase";
import { collection, getDocs, getDoc, doc } from "firebase/firestore"
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import { ListItemButton } from '@mui/material';
import { pink } from '@mui/material/colors';
import Paper from '@mui/material/Paper';
import PatientCard from './PatientCard';
import { FieldValue } from '@firebase/firestore';
import { Avatar, CardActionArea, Stack } from '@mui/material';

export default function PatientsDetails() {
  const [loading, setLoading] = React.useState(true);
  const [page, setPage]=React.useState(1);
  const [cardsPerPage, setCardsPerPage]=React.useState(30);
  const [numOfPages, setNumOfPages]=React.useState(1);
  const [patientsData, setPatientsData] = React.useState([]);
  const [filteredPatientsData, setFilteredPatientsData] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [userFilter, setUserFilter] = React.useState(-1);

  const handleFilterChange = (event) => {
    setUserFilter(event.target.value);
  };

  const handleFilterSubmit = (event) => {
    if(userFilter=== -1 ) {
      setFilteredPatientsData(patientsData);
    } else {
    setFilteredPatientsData(patientsData.filter((patient) => patient.userId === users[userFilter].userId));
    }
  };

  async function getPatientsData() {
    const usersCollRef = collection(db, "users");
    const usersSnap = await getDocs(usersCollRef);
    const userIdNameMap = {};
    const users = {};
    usersSnap.docs.map((doc, index) => {
      users[index] = { name: doc.data().name, userId: doc.id };
      userIdNameMap[doc.id] = doc.data().name;
    });
    setUsers(users);

    const patientCollRef = collection(db, "patients");
    const patientSnap = await getDocs(patientCollRef);
    let patientsDataTemp = [];
    patientSnap.docs.map((doc) => {
      patientsDataTemp.push({...doc.data(), patiendId: doc.id, userName: userIdNameMap[doc.data().userId]});
    });
    patientsDataTemp=patientsDataTemp.concat(patientsDataTemp).concat(patientsDataTemp);
    setPatientsData(patientsDataTemp);
    setNumOfPages(Math.ceil(patientsDataTemp.length/cardsPerPage));
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
          <Box className="userFilterContainer">
              <InputLabel id="simple-select-label">Filter by user</InputLabel>
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
