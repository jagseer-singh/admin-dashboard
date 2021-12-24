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
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import { ListItemButton } from '@mui/material';
import { pink } from '@mui/material/colors';
import Paper from '@mui/material/Paper';
import PatientCard from './PatientCard';
import { FieldValue } from '@firebase/firestore';
import { Avatar, CardActionArea, Stack } from '@mui/material';

function myfn(){
    alert('clicked on element')
}
const data=[];
for(let i=0;i<100;i++){
    const obj={
        key: i,
        firstName: 'Jagseer',
        lastName: 'Ghuman',
        gender: 'M',
        dob: '30/3/2000'
    }
    data.push(obj);
}

export default function PatientsDetails() {
    console.log(data);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container rowSpacing={4}>
        { data.map((value) =>
            {return <Grid item xs='auto'>
                <PatientCard patient={value}/>
            </Grid>})
        }
      </Grid>
    </Box>
  );
}
