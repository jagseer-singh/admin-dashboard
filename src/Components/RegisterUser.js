import AssignmentIcon from '@mui/icons-material/Assignment';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import {
  createUserWithEmailAndPassword
} from "firebase/auth";
import { collection, deleteDoc, doc, getDocs, setDoc,updateDoc } from "firebase/firestore";
import * as React from 'react';
import { useHistory } from "react-router-dom";
import { auth, db } from "../firebase";

const theme = createTheme();

export default function RegisterUser() {

  const [RadioValue, setRadioValue] = React.useState('adduser');
  const [loading, setLoading] = React.useState(false);
  const [loadOrgData, setLoadOrgData] = React.useState(true);
  const [orgData, setOrgData] = React.useState([]);
  const [organisation, setOrganisation] = React.useState();
  const history = useHistory();

  async function handleSubmit (event) {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    
    const email = data.get('email');
    const password = data.get('password');
    const confirmPassword = data.get('confirmpassword');
    const firstName = data.get('firstName');
    const lastName = data.get('lastName');
    const mobileNumber = data.get('mobileNumber');
    const designation = data.get('designation');

    const usersCollRef = collection(db, "users");
    const usersSnap = await getDocs(usersCollRef);

    if(RadioValue === 'adduser') {
      if(password === confirmPassword) {
        try {
          const user = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          console.log(user);
          const fullName = firstName + " " + lastName;
          let maxShortHand = 0;
          usersSnap.docs.forEach((doc) => {
            if(doc.data().shortHand && parseInt(doc.data().shortHand)>maxShortHand){
              maxShortHand = parseInt(doc.data().shortHand);
            }
          })
          maxShortHand += 1;
          const userShorthand = ("000" + maxShortHand).slice(-4);
          await setDoc(doc(db, "users", user.user.uid), {
            name: fullName,
            email: email,
            role: "user",
            active:1,
            organisation: organisation,
            mobileNumber: mobileNumber,
            designation: designation,
            shortHand: userShorthand
          });
          alert(`${fullName} registered successfully with shortHand: ${userShorthand}`);
          history.push('/users')
        } catch (error) {
          alert(error.message);
        }
      }
      else{
        alert('Password and Confirm password don\'t match');
      }
    }
    else{
      let userRole = null;
      let userId = null;
      usersSnap.docs.forEach((doc) => {
        if(doc.data().email === email ){
          userId = doc.id;
          userRole = doc.data().role;
        }
      });
      if(!userId){
        alert('Cannot find any user with this E-mail')
      }
      else if(userRole === "admin"){
        alert('This email is associated to admin, Cannot revoke Access');
      }
      else{
        // await deleteDoc(doc(db, "users", userId));
        await updateDoc(doc(db, "users", userId), {
          active:0
        });
        alert('User Revoked Successfully!!');
        history.push('/users');
      }
    }
    setLoading(false);
  };
  

  const handleRadio = (event) => {
    setRadioValue(event.target.value);
  };

  const handleOrganisationChange = (event) => {
    const org_temp = event.target.value;
    setOrganisation(org_temp);
    console.log(org_temp);
  };

  async function getOrgData() {
    const orgCollRef = collection(db, "organisations");
    const orgSnap = await getDocs(orgCollRef);
    const orgs = [];
    orgSnap.docs.forEach((doc) => {
      orgs.push({...doc.data()}); 
    });
    if(orgs && orgs[0]){
      setOrganisation(orgs[0].org_id);
    }
    setOrgData(orgs);
    setLoadOrgData(false);
  }

  React.useEffect( () => {
    if(loadOrgData){
      getOrgData();
    }
  });

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
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
                    name="mobileNumber"
                    label="Mobile Number"
                    id="mobileNumber"
                    type="number"
                  />
                </Grid>
                }
                { 
                RadioValue==='adduser' && !loadOrgData && 
                  <Grid item xs={12}>
                  <FormControl className="organisationSelect">
                    <InputLabel id="simple-select-label-1">Organisation</InputLabel>
                    <Select
                      labelId="simple-select-label-1"
                      id="simple-select"
                      label="Organisation"
                      value = {organisation}
                      onChange={handleOrganisationChange}
                    >
                      {
                        orgData.map((org) => {
                          return <MenuItem value={org.org_id}>{org.org_id} / {org.org_name}</MenuItem>
                      })
                      }
                    </Select>
                  </FormControl>
                </Grid>
                }
                { 
                RadioValue==='adduser' && 
                  <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="designation"
                    label="Designation"
                    id="designation"
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
                    type="password"
                    id="confirmpassword"
                  />
                </Grid>
                }
              
            </Grid>
            <Button
              disabled={loading}
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