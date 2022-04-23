import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import Image from "next/image";
import * as React from "react";
import { useState } from "react";
import Contacts from "../../components/Contacts";
import logo from "../../public/Furlong_newLogo_medium 1.jpg";
import EmailIcon from "@mui/icons-material/Email";
import 'react-phone-input-2/lib/style.css'
import PhoneInput from "react-phone-input-2";

const SnackAlert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function EventsAndSeminars({ accounts, id, EventNameResp }) {
  const [search, setSearch] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackBarOpen] = useState(false);
  const [paintingNeed, setPaintingNeed] = useState("");
  const [newContact, setNewContact] = useState(false);
  const [number, setNumber] = useState("");

  const handleSearch = async (account) => {
    console.log(account);
    setLoading(true);
    setSearch(account);
    // const relatedResp = await axios.get(
    //   "/api/getRelatedData?accountId=" + account?.Accounts?.id
    // );
    if (relatedResp?.data?.status !== "error") {
      setContacts(relatedResp?.data?.data?.data || []);
      setLoading(false);
    }
    setLoading(false);
  };
  const handleSnackbarClose = () => {
    setSnackBarOpen(false);
  };

  return (
    <Box>
      <AppBar position="static">
        <Typography variant="h6" align="center" sx={{ pt: 2, pb: 2 }}>
          Event Registration
        </Typography>
      </AppBar>
      <Box
        sx={{
          maxWidth: 786,
          minHeight: 700,
          padding: 5,
          margin: "0 auto",
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
            <Image src={logo} alt="logo" width={170} height={170} />
          </Box>
          <Typography
            align="center"
            variant="h6"
            sx={{ mt: 5, fontWeight: "bold" }}
          >
            Event Name: {EventNameResp !== undefined && EventNameResp[0].Name}
          </Typography>
        </Box>
        <label style={{ fontWeight: 500 }}>School Name</label>
        <Autocomplete
          sx={{ mt: 1, mb: 1 }}
          disablePortal
          onChange={(e, v) => (v !== null ? handleSearch(v) : setSearch(null))}
          options={accounts}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField {...params} fullWidth placeholder="-Select-" />
          )}
        />
        <label style={{ fontWeight: 500 }}>Contact</label>
        <Autocomplete
          sx={{ mt: 1 }}
          disablePortal
          options={contacts}
          getOptionLabel={(option) => option.Contacts.name}
          renderInput={(params) => (
            <TextField {...params} fullWidth placeholder="-Select-" />
          )}
        />
        <FormControlLabel
          sx={{ mt: 1, mb: 1 }}
          control={
            <Checkbox
              size="small"
              onChange={() => setNewContact(!newContact)}
            />
          }
          label="New Contact"
        />
        {newContact === true && (
          <Box>
            <Box>
              <label style={{ fontWeight: 500 }}>First Name</label>
              <br />
              <TextField fullWidth sx={{ mt: 1, mb: 1 }} />
            </Box>
            <Box>
              <label style={{ fontWeight: 500 }}>Last Name</label>
              <br />
              <TextField fullWidth sx={{ mt: 1, mb: 1 }} />
            </Box>
            <Box>
              <label style={{ fontWeight: 500 }}>Email</label>
              <br />
              <TextField
                sx={{ mt: 1, mb: 1 }}
                fullWidth
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton edge="end">
                      <EmailIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </Box>
            <Box>
              <label style={{ fontWeight: 500, marginBottom: 5 }}>Phone</label>
              <br />
              <PhoneInput
                country={"us"}
                value={number}
                onChange={(phone) => setNumber(phone)}
              />
            </Box>
          </Box>
        )}
        {console.log(number)}
        <br />
        <label style={{ fontWeight: 500 }}>
          Does your school have a painting need that you would like to discuss
          or have quoted?
        </label>
        <FormControl fullWidth sx={{ mt: 1, mb: 1 }}>
          <InputLabel>-Select-</InputLabel>
          <Select
            fullWidth
            value={paintingNeed}
            // label="Age"
            onChange={(e) => setPaintingNeed(e.target.value)}
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
            <MenuItem value="Unsure">Unsure(But Open To conversation)</MenuItem>
          </Select>
        </FormControl>
        <label style={{ fontWeight: 500 }}>Contact</label>
        <TextField sx={{ mt: 1, mb: 3 }} multiline fullWidth rows={4} />
        <em style={{ fontWeight: 500 }}>
          Thank you for taking the time to stop and chat, we will be in contact
          soon!
        </em>
      </Box>
      <Box sx={{display: 'flex', juistifyContent: 'center'}}>
      <Button variant="contained" align="center" sx={{margin: '-10px auto 5px auto '}}>Register</Button>
      </Box>
      {/* <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <SnackAlert severity="success" sx={{ width: "100%" }}>
          Contact Created Successfully
        </SnackAlert>
      </Snackbar> */}
    </Box>
  );
}

// export async function getServerSideProps(context) {
//   const accessToken = await axios.get(process.env.ACCESSTOKEN_URL);
//   const id = context.params.id;
//   const eventsResp = await axios.get(
//     `https://www.zohoapis.com/crm/v2/OSHE/${id}/Accounts112`,
//     {
//       headers: {
//         Authorization: accessToken.data.access_token,
//       },
//     }
//   );
//   const EventNameResp = await axios.get(
//     `https://www.zohoapis.com/crm/v2/OSHE/${id}`,
//     {
//       headers: {
//         Authorization: accessToken.data.access_token,
//       },
//     }
//   );

//   if (!!eventsResp?.data?.data) {
//     return {
//       props: {
//         accounts: eventsResp.data.data,
//         id: id,
//         EventNameResp: EventNameResp.data.data,
//       }, // will be passed to the page component as props
//     };
//   } else {
//     return {
//       props: { accounts: [], id: null, EventNameResp: [] }, // will be passed to the page component as props
//     };
//   }
//   // return {
//   //   props: { session },
//   // };
// }


const accounts = [
  {name: "tony", age: 35},
  {name: "rony", age: 25},
]