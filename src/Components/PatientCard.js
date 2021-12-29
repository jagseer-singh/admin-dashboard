import { Avatar, CardActionArea, Stack } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useHistory } from "react-router-dom";

export default function PatientCard(props) {
  const history = useHistory();
  
  function handleClick(){
    history.push('/patientprofile', { patient: props.patient });
  }
    function stringToColor(string) {
        let hash = 0;
        let i;
      
        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
          hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
      
        let color = '#';
      
        for (i = 0; i < 3; i += 1) {
          const value = (hash >> (i * 8)) & 0xff;
          color += `00${value.toString(16)}`.substr(-2);
        }
        /* eslint-enable no-bitwise */
      
        return color;
      }
      
      function stringAvatar(name) {
        return {
          sx: {
            bgcolor: stringToColor(name),
            width: 70,
            height: 70,
          },
          children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
      }
      
    return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea onClick= {handleClick}>
        <CardContent>
            <Stack direction="row" spacing={4}>
                <Avatar {...stringAvatar(props.patient.firstName+' '+props.patient.lastName)} />
                    <Stack direction="column" spacing={0}>
                        <Typography gutterBottom variant="h5" component="div">
                            {props.patient.firstName} {props.patient.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            DOB: {props.patient.dateOfBirth} <br/>
                            Gender: {props.patient.gender} <br/>
                            Key: {props.patient.createdOn?props.patient.createdOn.seconds:'loading'} <br/>
                        </Typography>
                    </Stack>
            </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
