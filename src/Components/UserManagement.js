import Button from '@mui/material/Button';
import { collection, getDocs } from "firebase/firestore";
import React from "react";
import { useHistory } from "react-router-dom";
import { db } from "../firebase";
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'shortHand', headerName: 'Short Hand', width: 123 },
  { field: 'name', headerName: 'Name', width: 225 },
  { field: 'email', headerName: 'Email', width: 300 },
  { field: 'role', headerName: 'Role', width: 150 },
  { field: 'organisation', headerName: 'Organisation', width: 350 },
  { field: 'designation', headerName: 'Designation', width: 200 },
  { field: 'mobileNumber', headerName: 'Mobile Number', width: 150 },
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
      usersDataTemp.sort(function (a, b){
        if(!a.shortHand){
          return 1;
        }
        if(a.shortHand < b.shortHand){
          return 1;
        }
        return -1;
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
          loading = {loading}
          rowsPerPageOptions={[30]}
          rowHeight={60}
          autoHeight={true}
          disableExtendRowFullWidth={true}
          disableSelectionOnClick
          />
        </div>
        </div>
        </div>
    )
};