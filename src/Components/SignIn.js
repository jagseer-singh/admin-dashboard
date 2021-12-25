import * as React from "react";
import { useHistory } from "react-router-dom"
import Avatar from '@mui/material/Avatar';
import { Alert } from '@mui/material';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";
import Cookies from 'js-cookie';
import { db } from "../firebase";
import { collection, getDocs, getDoc, doc } from "firebase/firestore"

const theme = createTheme();

export default function SignIn() {

  const [user, setUser] = React.useState({});
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const history = useHistory()

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });


  async function handleSubmit (event){
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    try {
      setError("")
      setLoading(true)
      const user = await signInWithEmailAndPassword(
        auth,
        data.get('email'),
        data.get('password')
      );
      const userDocRef = doc(db, "users", user.user.uid);
      const userSnap = await getDoc(userDocRef);
      const userRole = userSnap.data().role;
      
      if(userRole === "admin"){
      Cookies.set('loggedIn',true,{expires:1});
      Cookies.set('UserID', user.user.uid, {expires:1});
      history.push('/users');
      }
      else{
        setError('You don\'t have an Admin Role')
        history.push('/login');
      }
    } catch (error) {
      setError(error.message)
    }
    setLoading(false)
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {error && <Alert variant="danger">{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              disabled={loading}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}