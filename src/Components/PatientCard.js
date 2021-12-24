import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Avatar, CardActionArea, Stack } from '@mui/material';

export default function PatientCard(props) {
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
      <CardActionArea>
        <CardContent>
            <Stack direction="row" spacing={4}>
                <Avatar {...stringAvatar(props.firstName+' '+props.lastName)} />
                    <Stack direction="column" spacing={0}>
                        <Typography gutterBottom variant="h5" component="div">
                            {props.firstName} {props.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            DOB: {props.dob} <br/>
                            Gender: {props.gender}
                        </Typography>
                    </Stack>
            </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
