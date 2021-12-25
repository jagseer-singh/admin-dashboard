import React from "react";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import SignIn from './Components/SignIn';
import NavBar from './Components/NavBar';
import RegisterUser from './Components/RegisterUser';
import PatientsDetails from './Components/PatientsDetails';
import ProtectedRoute from "./Components/ProtectedRoute";
import UserManagement from "./Components/UserManagement";
import PatientProfile from "./Components/PatientProfile";

function App() {
  return (
    <Router>
        <Switch>
          <Route exact path="/" component={SignIn}/>
          <Route path="/login" component={SignIn}/>
          <div>
            <NavBar/>
            <ProtectedRoute path="/registeruser" component={RegisterUser}/>
            <ProtectedRoute path="/patientsdetails" component={PatientsDetails}/>
            <ProtectedRoute path="/users" component={UserManagement}/>
            <ProtectedRoute path="/patientprofile" component={PatientProfile}/>
          </div>
        </Switch>
    </Router>
  );
}

export default App;
