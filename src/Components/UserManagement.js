import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { collection, getDocs } from "firebase/firestore";
import React from "react";
import { useHistory } from "react-router-dom";
import { db } from "../firebase";
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'name', headerName: 'Name', width: 100 },
  { field: 'email', headerName: 'Email', width: 100 },
  { field: 'role', headerName: 'Role', width: 100 },
  { field: 'organisation', headerName: 'Organisation', width: 100 },
  { field: 'designation', headerName: 'Designation', width: 100 },
  { field: 'mobileNumber', headerName: 'Mobile Number', width: 100 },
];


export default function UserManagement (props){    

    const [usersData, setUsersData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const history = useHistory();

    async function getUsersData() {
      const usersCollRef = collection(db, "users");
      const usersSnap = await getDocs(usersCollRef);
      const usersDataTemp = [];
      usersSnap.docs.forEach((doc) => {
        if(doc.data().active===1){
        usersDataTemp.push({...doc.data(), userId: doc.id, id:doc.id});}
      });
      setUsersData(usersDataTemp);
      setLoading(false)
    }

    React.useEffect( () => {
        if(loading){
          getUsersData();
        }
      });

    function handleSubmit (event){
        history.push('/registeruser')
      };
    
    return (
        <div>
        { !loading &&
            <div>
                <div className="addRevokeButtonContainer">
        <Button onClick={handleSubmit}
              type="submit"
              fullWidth
              className="addRevokeButton"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add/Revoke Users
            </Button>   
        </div>
        <div className="userTableContainer">
        <h3>User's Information</h3>
        <DataGrid
          className = "orgTable"
          rows={usersData}
          columns={columns}
          pageSize={30}
          rowsPerPageOptions={[30]}
          rowHeight={60}
          autoHeight={true}
          disableExtendRowFullWidth={true}
          />
        </div>
        </div>
        }
        </div>
    )
};