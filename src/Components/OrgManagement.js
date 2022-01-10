import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import FormControl from "@mui/material/FormControl";
import { collection, getDocs } from "firebase/firestore";
import * as React from 'react';
import { db } from "../firebase";
import { DataGrid } from '@mui/x-data-grid';
import { useHistory } from "react-router-dom";

const columns = [
  { field: 'org_id', headerName: 'ID', width: 100 },
  { field: 'org_name', headerName: 'Organisation Name', width: 508 },
  { field: 'org_address', headerName: 'Address', width: 890 },
];

export default function PatientsDetails() {
  const history = useHistory();
  const [loading, setLoading] = React.useState(true);
  const [orgData, setOrgData] = React.useState([]);

  async function getOrgData() {
    const orgCollRef = collection(db, "organisations");
    const orgSnap = await getDocs(orgCollRef);
    const orgs = [];
    orgSnap.docs.forEach((doc) => {
      orgs.push({...doc.data(), id:doc.id})
    });
    setOrgData(orgs);
    setLoading(false);
  }
 
  function handleSubmit (event){
    history.push('/registerorg')
  };

  React.useEffect( () => {
    if(loading){
      getOrgData();
    }
  });

  return (
      <div>
    <div className="addRevokeButtonContainer">
    <Button onClick={handleSubmit}
          type="submit"
          fullWidth
          className="addRevokeButton"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Add Organisation
        </Button>   
    </div>
    <Box className = 'userTableContainer' sx={{ flexGrow: 1 }}>
      <div>
            <h3>Registered Organisations</h3>
            <DataGrid
                className = "orgTable"
                rows={orgData}
                columns={columns}
                pageSize={30}
                rowsPerPageOptions={[30]}
                rowHeight={60}
                autoHeight={true}
                disableExtendRowFullWidth={true}
                />
      </div>
    </Box>
    </div>
  );
}
