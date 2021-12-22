import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import SignIn from './Components/SignIn';
import NavBar from './Components/NavBar';
import Profile from './Components/Profile';
import RegisterUser from './Components/RegisterUser';
import PatientsDetails from './Components/PatientsDetails';

function App() {
  return (
    <Router>
      <NavBar/>
      <Switch>
        <Route exact path="/" component={SignIn}/>
        <Route path="/login" component={SignIn}/>
        <Route path="/profile" component={Profile}/>
        <Route path="/registeruser" component={RegisterUser}/>
        <Route path="/patientsdetails" component={PatientsDetails}/>
      </Switch>
    </Router>
  );
}

export default App;
