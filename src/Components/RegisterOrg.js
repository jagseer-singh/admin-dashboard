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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import {
  createUserWithEmailAndPassword
} from "firebase/auth";
import { collection, deleteDoc, doc, getDocs, setDoc,updateDoc } from "firebase/firestore";
import * as React from 'react';
import { useHistory } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const theme = createTheme();

export default function RegisterUser() {

  const [orgData, setOrgData] = React.useState(new Set());
  const [loadingOrgData, setLoadingOrgData] = React.useState(true);
  const [loading, setLoading] = React.useState(false)
  const history = useHistory();
  const [logoImage, setLogoImage] = React.useState();
  const [url, setURL] = React.useState("");
  const [invalidOrgId, setInvalidOrgId] = React.useState(false);
  const selectFile = (event) => {
    event.preventDefault();
    console.log(event.target.files[0]);
    setLogoImage(event.target.files[0]);
  };

  function checkOrgId(event){
    const org_temp = event.target.value;
    console.log(org_temp);
    if(orgData.has(org_temp)){
        setInvalidOrgId(true);
    }
    else{
        setInvalidOrgId(false);
    }
  }

  function handleLogoUpload(org_id) {
    console.log(logoImage);
    //const ref = storage.ref(`/organisation_logo/temp`);
    //const uploadTask = ref.put(logoImage);
    const storageRef = ref(storage, `org_logos/${org_id}`);
    const uploadTask = uploadBytesResumable(storageRef, logoImage);

    uploadTask.on('state_changed', 
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      }, 
      (error) => {
        // Handle unsuccessful uploads
        console.log("Upload Failed")
      }, 
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
        });
      }
    );
  }

  async function handleSubmit (event) {
    event.preventDefault();
    if(!logoImage){
        alert("Please add logo image!");
        return;
    }
    if(invalidOrgId){
        alert("Id Already Taken!");
        return;
    }
    console.log("Processing");
    
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const org_name = data.get('org_name');
    const org_address = data.get('org_address');
    const org_id = data.get('org_id');
    
    handleLogoUpload(org_id);

    await setDoc(doc(db, "organisations", org_id), {
        org_name: org_name,
        org_address: org_address,
        org_id: org_id
      });
    alert(`Successfully Registered ${org_name}!` );
    setLoading(false);
    history.push('/orgmanagement');
  };
  async function getOrgData(){
    const orgCollRef = collection(db, "organisations");
    const orgSnap = await getDocs(orgCollRef);
    const orgDataTemp = new Set();
    orgSnap.docs.forEach((doc) => {
        orgDataTemp.add(doc.id);
    });
    setOrgData(orgDataTemp);
    setLoadingOrgData(false);
 }
  React.useEffect(()=>{
    if(loadingOrgData){
        getOrgData();
    }
  })

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
          <Typography component="h1" variant="h5">
            Register Organisation
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="org_name"
                  label="Name Of Organisation"
                  name="org_name"
                />
              </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="org_address"
                    label="Address"
                    id="org_address"
                  />
                </Grid>
                  <Grid item xs={12}>
                  <TextField 
                    error={invalidOrgId}
                    onChange={checkOrgId}
                    required
                    fullWidth
                    name="org_id"
                    label="Organisation ID"
                    id="org_id"
                  />
                </Grid>
            </Grid>
            <label htmlFor="btn-upload">
            <input
                id="btn-upload"
                name="btn-upload"
                style={{ display: 'none' }}
                type="file"
                accept="image/*"
                onChange={selectFile} />
            <Button
                className="btn-choose"
                variant="outlined"
                component="span" >
                Choose Logo
            </Button>
            </label>
            <div>
                {
                    logoImage?logoImage.name:null
                }
            </div>
            <Button
              disabled={loading}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
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