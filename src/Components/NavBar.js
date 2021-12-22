import * as React from 'react';
import { useHistory } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

const pages = ['Profile', 'Patients\' Details', 'Register Users','Logout'];

const NavBar = () => {
  const history=useHistory();
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
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
                <MenuItem key='Profile' onClick={() => history.push('/profile')}>
                  <Typography textAlign="center">Profile</Typography>
                </MenuItem>
                <MenuItem key='PatientsDetails' onClick={() => history.push('/patientsdetails')}>
                  <Typography textAlign="center">Patients' Details</Typography>
                </MenuItem>
                <MenuItem key='RegisterUsers' onClick={() => history.push('/registeruser')}>
                  <Typography textAlign="center">Register Users</Typography>
                </MenuItem>
                <MenuItem key='Logout' onClick={() => {alert('Logged Out Successfully!'); history.push('/login')}}>
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
                key='Profile'
                onClick={() => history.push('/profile')}
                sx={{ my: 2, color: 'white', display: 'block' }}
            >
                Profile
            </Button>
            <Button
                key='PatientsDetails'
                onClick={() => history.push('/patientsdetails')}
                sx={{ my: 2, color: 'white', display: 'block' }}
            >
                Patients' Details
            </Button>
            <Button
                key='RegisterUsers'
                onClick={() => history.push('/registeruser')}
                sx={{ my: 2, color: 'white', display: 'block' }}
            >
                Register Users
            </Button>
            <Button
                key='Logout'
                onClick={() => {alert('Logged Out Successfully!'); history.push('/login')}}
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
