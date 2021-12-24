import React, { useEffect } from "react";
import { useHistory } from "react-router-dom"
import { db } from "../firebase";
import { collection, getDocs, getDoc, doc } from "firebase/firestore"
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { maxWidth } from "@mui/system";


export default function UserManagement (props){    


    const [usersData, setUsersData] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const history = useHistory();

    async function getUsersData() {
      const usersCollRef = collection(db, "users");
      const usersSnap = await getDocs(usersCollRef);
      const usersDataTemp = [];
      usersSnap.docs.map((doc) => {
        usersDataTemp.push({...doc.data(), userId: doc.id});
      });
      setUsersData(usersDataTemp);
      console.log('Temp',usersDataTemp);
      setLoading(false)
    }

    React.useEffect( () => {
        getUsersData();
      });

    function handleSubmit (event){
        history.push('/registeruser')
      };
    
    return (
        <div>
        { !loading &&
            <div>
                <div>
        <Button onClick={handleSubmit}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add/Revoke Users
            </Button>   
        </div>
        <div>
            <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650, maxWidth:1000}} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell >E-mail</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Role</TableCell>
            <TableCell align="right">UserID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usersData.map((user) => (
            <TableRow
              key={user.email}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {user.email}
              </TableCell>
              <TableCell align="right">{user.name}</TableCell>
              <TableCell align="right">{user.role}</TableCell>
              <TableCell align="right">{user.userId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        </div>
            </div>
        }
        </div>
    )
};