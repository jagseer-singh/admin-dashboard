import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const theme = createTheme();

export default function RegisterUser() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };
  const [RadioValue, setRadioValue] = React.useState('adduser');

  const handleRadio = (event) => {
    setRadioValue(event.target.value);
    console.log(RadioValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">

        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <AssignmentIcon />
          </Avatar>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
              <FormControl component="fieldset">
                    <FormLabel component="legend">Action</FormLabel>
                        <RadioGroup
                            aria-label="action"
                            defaultValue="adduser"
                            value={RadioValue}
                            onChange={handleRadio}
                            name="radio-buttons-group"
                        >
                    <FormControlLabel value="adduser" control={<Radio />} label="Add User" />
                    <FormControlLabel value="revokeuser" control={<Radio />} label="Revoke User" />
                </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              { 
                RadioValue==='adduser' && 
                  <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="firstName"
                    label="First Name"
                    id="firstName"
                  />
                </Grid>
                }
                { 
                RadioValue==='adduser' && 
                  <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="lastName"
                    label="Last Name"
                    id="lastName"
                  />
                </Grid>
                }
              { 
                RadioValue==='adduser' && 
                  <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                  />
                </Grid>
                }
                {
                    RadioValue==='adduser' &&
                    <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="confirmpassword"
                    label="Confirm Password"
                    type="confirmpassword"
                    id="confirmpassword"
                  />
                </Grid>
                }
              
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}