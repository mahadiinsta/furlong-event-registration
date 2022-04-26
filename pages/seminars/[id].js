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

export default function EventsAndSeminars({ accounts, EventID, EventNameResp }) {
  const [search, setSearch] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackBarOpen] = useState(false);
  const [paintingNeed, setPaintingNeed] = useState("");
  const [newContact, setNewContact] = useState(false);
  const [number, setNumber] = useState("");
  const [firstName,setFirstName] = useState("");
  const [lastName,setLastName] = useState("");
  const [email, setEmail] = useState("")
  const [title,setTitle] = useState("");
  const [note,setNote] = useState("");
  const [selectedContact, setSelectedContact] = useState('')

  const handleSearch = async (account) => {
    setLoading(true);
    setSearch(account);
    const account_id = account.Invited_Accounts.id;
    const relatedResp = await axios.get(
      "/api/getRelatedData?accountId=" + account_id
    );
    if (relatedResp?.data?.status !== "error") {
      setContacts(relatedResp?.data?.data?.data || []);
      setLoading(false);
    }
    setLoading(false);
  };
  const handleSnackbarClose = () => {
    setSnackBarOpen(false);
  };

  const handleCreateContact = async () => {
    const contactMap = {
      First_Name: firstName,
      Last_Name: lastName,
      Email: email,
      Phone: number,
      Title: title,
      Account_Name: search?.Invited_Accounts?.id,
    }
    const createResp = await axios.post('/api/CreateContact', contactMap)

    if (createResp?.data?.data?.data[0].status === 'success') {
      const createAttendeeMap = {
        Name: firstName + ' ' + lastName,
        Accounts: search?.Invited_Accounts?.id,
        Event_Name: EventID,
        Attendee_Status: 'Attended',
        Attendee_Title: title,
        Note: note,
        Painting_Needs: paintingNeed,
        Contacts: createResp?.data?.data?.data[0].details.id,
      }
      const createEventAttendeeResp = await axios.post(
        '/api/CreateEventAttendee',
        createAttendeeMap,
      )
      const sendData = await axios.post(
        `/api/NewContactCount?recordId=${EventID}`,
      )
      if (createResp?.data?.data?.data[0]?.status === 'error') {
        alert('something wrong , please try again')
        window.location.reload(false)
      }
    }
  }

  const handleRegister = () => {
    if(newContact === true && firstName !== "" && lastName !== "" && number !== ""){
      handleCreateContact();
      
    }else if(newContact === true && (firstName === "" || lastName === "" || number === "")){
      alert('Please Fill All the data')
    }
    else{
      handleInvite()
    }
  }

  const handleInvite = async () => {
    const relatedResp = await axios.post('/api/setContactInvitationStatus?recordId=' + selectedContact?.id, {Note: note,Painting_Needs: paintingNeed})
    if (relatedResp?.data?.status !== 'error') {
      alert('successfully atteneded')
      window.location.reload(false)
    } else {
      console.log(relatedResp?.data?.message)
    }
  }

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
            Event Name: {EventNameResp !== undefined && EventNameResp[0].Event_Name}
          </Typography>
        </Box>
        <label style={{ fontWeight: 500 }}>School Name</label>
        <Autocomplete
          sx={{ mt: 1, mb: 1 }}
          disablePortal
          onChange={(e, v) => (v !== null ? handleSearch(v) : setSearch(null))}
          options={accounts}
          getOptionLabel={(option) => option.Invited_Accounts.name}
          renderInput={(params) => (
            <TextField {...params} fullWidth placeholder="-Select-" />
          )}
        />
        <label style={{ fontWeight: 500 }}>Contact</label>
        <Autocomplete
          sx={{ mt: 1 }}
          disablePortal
          onChange={(e, v) => (v !== null && setSelectedContact(v))}
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
              <TextField fullWidth sx={{ mt: 1, mb: 1 }} onBlur={(e) => setFirstName(e.target.value)} />
            </Box>
            <Box>
              <label style={{ fontWeight: 500 }}>Last Name</label>
              <br />
              <TextField fullWidth sx={{ mt: 1, mb: 1 }}  onBlur={(e) => setLastName(e.target.value)} />
            </Box>
            <Box>
              <label style={{ fontWeight: 500 }}>Title</label>
              <br />
              <TextField fullWidth sx={{ mt: 1, mb: 1 }}  onBlur={(e) => setTitle(e.target.value)} />
            </Box>
            <Box>
              <label style={{ fontWeight: 500 }}>Email</label>
              <br />
              <TextField
                sx={{ mt: 1, mb: 1 }}
                onBlur={(e) => setEmail(e.target.value)}
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
                country={"au"}
                value={number}
                onChange={(phone) => setNumber(phone)}
              />
            </Box>
          </Box>
        )}
        <br />
        <label style={{ fontWeight: 500 }}>
          Does your school have a painting need that you would like to discuss
          or have quoted?
        </label>
        <TextField
          select
          sx={{mt: 2, mb: 1}}
          fullWidth
          shrink={true}
          notched
          // label="Select"
          placeholder="combo-box"
          value={paintingNeed}
          onChange={(e) => setPaintingNeed(e.target.value)}
        >
          {[
            {label: 'Yes', value: 'Yes'},
            {label: 'No', value: 'No'},
            {label: 'Unsure(But Open To conversation)', value: 'Unsure(But Open To conversation)'},
          ].map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <label style={{ fontWeight: 500 }}>Note</label>
        <TextField sx={{ mt: 1, mb: 3 }} multiline fullWidth rows={4} onChange={(e) => setNote(e.target.value)} />
        <em style={{ fontWeight: 500 }}>
          Thank you for taking the time to stop and chat, we will be in contact
          soon!
        </em>
      </Box>
      <Box sx={{display: 'flex', juistifyContent: 'center'}}>
      <Button variant="contained" align="center" sx={{margin: '-10px auto 5px auto '}} onClick={handleRegister}>Register</Button>
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

export async function getServerSideProps(context) {
  const accessToken = await axios.get(process.env.ACCESSTOKEN_URL);
  const id = context.params.id;
  const eventsResp = await axios.get(
    `https://www.zohoapis.com/crm/v2/OHS_Event/${id}/Accounts12`,
    {
      headers: {
        Authorization: accessToken.data.access_token,
      },
    }
  );
  const EventNameResp = await axios.get(
    `https://www.zohoapis.com/crm/v2/OHS_Event/${id}`,
    {
      headers: {
        Authorization: accessToken.data.access_token,
      },
    }
  );

  if (!!eventsResp?.data?.data) {
    return {
      props: {
        accounts: eventsResp.data.data,
        EventID: id,
        EventNameResp: EventNameResp.data.data,
      }, // will be passed to the page component as props
    };
  } else {
    return {
      props: { accounts: [], EventID: null, EventNameResp: [] }, // will be passed to the page component as props
    };
  }
  // return {
  //   props: { session },
  // };
}


const accounts = [
  {name: "tony", age: 35},
  {name: "rony", age: 25},
]