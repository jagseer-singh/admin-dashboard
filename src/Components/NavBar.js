import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {
  signOut
} from "firebase/auth";
import Cookies from 'js-cookie';
import * as React from 'react';
import { useHistory } from "react-router-dom";
import { auth } from "../firebase";

//const pages = [ 'Patients\' Details', 'Register Users','Logout'];

const NavBar = () => {
  const history=useHistory();
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const logout = async () => {
    try {
      await signOut(auth);
      alert('Logged Out Successfully!!'); 
      Cookies.remove('loggedIn');
      Cookies.remove('UserID')
      history.push('/login')
    } catch (error) {
      alert('Logout Failed!!');
    }
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            LOGO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
                <MenuItem key='PatientsDetails' onClick={() => history.push('/patientsdetails')}>
                  <Typography textAlign="center">Patients' Details </Typography>
                </MenuItem>
                <MenuItem key='UserManagement' onClick={() => history.push('/users')}>
                  <Typography textAlign="center">User Management </Typography>
                </MenuItem>
                <MenuItem key='OrgManagement' onClick={() => history.push('/orgmanagement')}>
                  <Typography textAlign="center">Organisations </Typography>
                </MenuItem>
                <MenuItem key='Logout' onClick={logout}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
                key='PatientsDetails'
                onClick={() => history.push('/patientsdetails')}
                sx={{ my: 2, color: 'white', display: 'block' }}
            >
                Patients' Details
            </Button>
            <Button
                key='UserManagement'
                onClick={() => history.push('/users')}
                sx={{ my: 2, color: 'white', display: 'block' }}
            >
                User Management
            </Button>
            <Button
                key='OrgManagement'
                onClick={() => history.push('/orgmanagement')}
                sx={{ my: 2, color: 'white', display: 'block' }}
            >
                Organisations
            </Button>
            <Button
                key='Logout'
                onClick={logout}
                sx={{ my: 2, color: 'white', display: 'block' }}
            >
                Logout
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default NavBar;
