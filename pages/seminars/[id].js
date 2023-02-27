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
  Link,
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
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import { Controller, useForm } from "react-hook-form";
import MuiPhoneNumber from "mui-phone-number";

const SnackAlert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function EventsAndSeminars({
  accounts,
  EventID,
  EventNameResp,
}) {
  const [search, setSearch] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackBarOpen] = useState(false);
  const [paintingNeed, setPaintingNeed] = useState("");
  const [newContact, setNewContact] = useState(false);
  const [number, setNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [selectedContact, setSelectedContact] = useState("");

  //for account
  const [newAccount, setNewAccount] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [accountPhone, setAccountPhone] = useState("");
  const [accountState, setAccountState] = useState("");
  const [accountCity, setAccountCity] = useState("");
  const [accountStreet, setAccountStreet] = useState("");
  const [accountZip, setAccountZip] = useState("");

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

  const handleCreateContact = async (account_id) => {
    const contactMap = {
      First_Name: firstName,
      Last_Name: lastName,
      Email: email,
      Phone: number,
      Title: title,
      Account_Name:
        newAccount === true ? account_id : search?.Invited_Accounts?.id,
    };
    const createResp = await axios.post("/api/CreateContact", contactMap);

    if (createResp?.data?.data?.data[0].status === "success") {
      const createAttendeeMap = {
        Name: firstName + " " + lastName,
        Accounts:
          newAccount === true ? account_id : search?.Invited_Accounts?.id,
        Event_Name: EventID,
        Attendee_Status: "Attended",
        Attendee_Title: title,
        Note: note,
        Painting_Needs: paintingNeed,
        Contacts: createResp?.data?.data?.data[0].details.id,
      };
      const createEventAttendeeResp = await axios.post(
        "/api/CreateEventAttendee",
        createAttendeeMap
      );
      const sendData = await axios.post(
        `/api/NewContactCount?recordId=${EventID}`
      );
      return createResp?.data?.data?.data[0].status;
    }

    if (createResp?.data?.data?.data[0]?.status === "error") {
      alert("something wrong , please try again");
      window.location.reload(false);
    }
  };

  const handleCreateAccount = async () => {
    const accountMap = {
      EventID: EventID,
      Account_Name: accountName,
    };
    const accountCreateResp = await axios.post(
      "/api/CreateAccount",
      accountMap
    );

    if (accountCreateResp?.data?.data?.data[0].status === "success") {
      const contactCreateResp = handleCreateContact(
        accountCreateResp.data?.data?.data[0].details.id
      );
      console.log({ contactCreateResp });
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (
      newContact === true &&
      newAccount !== true &&
      firstName !== "" &&
      lastName !== "" &&
      number !== ""
    ) {
      console.log("create contact");
      handleCreateContact();
    } else if (
      newContact === true &&
      (firstName === "" || lastName === "" || number === "")
    ) {
      alert("Please Fill All the data");
    } else if (
      newAccount === true &&
      newContact !== true &&
      (firstName !== "" || lastName !== "" || number !== "")
    ) {
      console.log("Creating account");
      handleCreateAccount();
    } else {
      console.log("handle event");
      handleInvite();
    }

  };

  const handleInvite = async () => {
    const relatedResp = await axios.post(
      "/api/setContactInvitationStatus?recordId=" + selectedContact?.id,
      { Note: note, Painting_Needs: paintingNeed }
    );
    if (relatedResp?.data?.status !== "error") {
      alert("successfully atteneded");
      window.location.reload(false);
    } else {
      window.location.reload(false);
    }
  };

  return (
    <Box component="form">
      {console.log("newAccount", newAccount, ", : New Contact", newContact)}
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
            Event Name:{" "}
            {EventNameResp !== undefined && EventNameResp[0]?.Event_Name}
          </Typography>
        </Box>
        {newAccount === false ? (
          <>
            {" "}
            <label style={{ fontWeight: 500 }}>School Name</label>
            <Autocomplete
              sx={{ mt: 1, mb: 1 }}
              disablePortal
              onChange={(e, v) =>
                v !== null ? handleSearch(v) : setSearch(null)
              }
              options={accounts}
              getOptionLabel={(option) => option.Invited_Accounts.name}
              renderInput={(params) => (
                <TextField {...params} fullWidth placeholder="-Select-" />
              )}
            />
          </>
        ) : (
          ""
        )}
        <FormControlLabel
          sx={{ mt: 1, mb: 1 }}
          control={
            <Checkbox
              size="small"
              onChange={() => setNewAccount(!newAccount)}
            />
          }
          label="New Acount"
        />

        {newAccount === true ? (
          <Box>
            <Box sx={{ pb: 1 }}>
              <label
                style={{ fontWeight: 600, fontSize: 26, color: "#1565C0" }}
              >
                Account
              </label>
            </Box>
            <label style={{ fontWeight: 500 }}>School Name</label>
            <br />
            <TextField
              fullWidth
              sx={{ mt: 1, mb: 1 }}
              onBlur={(e) => setAccountName(e.target.value)}
              required
            />
          </Box>
        ) : (
          ""
        )}

        {newAccount === false ? (
          <>
            <br />

            {newContact === false && (
              <Autocomplete
                sx={{ mt: 1 }}
                disablePortal
                onChange={(e, v) => v !== null && setSelectedContact(v)}
                options={contacts}
                getOptionLabel={(option) => option.Contacts.name + " - "}
                renderInput={(params) => (
                  <TextField {...params} fullWidth placeholder="-Select-" />
                )}
              />
            )}
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
          </>
        ) : (
          ""
        )}
        {newContact === true || newAccount == true ? (
          <Box>
            {newAccount == true && (
              <Box sx={{ pb: 1 }}>
                <label
                  style={{ fontWeight: 600, fontSize: 26, color: "#1565C0" }}
                >
                  Contact
                </label>
              </Box>
            )}
            <Box>
              <label style={{ fontWeight: 500 }}>First Name</label>
              <br />
              <TextField
                fullWidth
                sx={{ mt: 1, mb: 1 }}
                onBlur={(e) => setFirstName(e.target.value)}
                required
              />
            </Box>
            <Box>
              <label style={{ fontWeight: 500 }}>Last Name</label>
              <br />
              <TextField
                fullWidth
                sx={{ mt: 1, mb: 1 }}
                onBlur={(e) => setLastName(e.target.value)}
                required
              />
            </Box>
            <Box>
              <label style={{ fontWeight: 500 }}>Title</label>
              <br />
              <TextField
                fullWidth
                sx={{ mt: 1, mb: 1 }}
                onBlur={(e) => setTitle(e.target.value)}
              />
            </Box>
            <Box>
              <label style={{ fontWeight: 500 }}>Email</label>
              <br />
              <TextField
                sx={{ mt: 1, mb: 1 }}
                onBlur={(e) => setEmail(e.target.value)}
                fullWidth
                required
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
        ) : (
          ""
        )}
        <br />
        <label style={{ fontWeight: 500 }}>
          Does your school have a painting need that you would like to discuss
          or have quoted?
        </label>
        <TextField
          select
          sx={{ mt: 2, mb: 1 }}
          fullWidth
          shrink={true}
          notched
          // label="Select"
          placeholder="combo-box"
          value={paintingNeed}
          onChange={(e) => setPaintingNeed(e.target.value)}
        >
          {[
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
            {
              label: "Unsure(But Open To conversation)",
              value: "Unsure(But Open To conversation)",
            },
          ].map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <label style={{ fontWeight: 500 }}>Note</label>
        <TextField
          sx={{ mt: 1, mb: 3 }}
          multiline
          fullWidth
          rows={4}
          onChange={(e) => setNote(e.target.value)}
        />
        <em style={{ fontWeight: 500 }}>
          Thank you for taking the time to stop and chat, we will be in contact
          soon!
        </em>
        <Box sx={{ display: "flex", juistifyContent: "center",alignItems:"center" }}>
          <Button
            variant="contained"
            align="center"
            sx={{ margin: "20px auto 5px auto " }}
            onClick={(e) => handleRegister(e)}
            type="submit"
          >
            Register
          </Button>

          <Link
            href="https://tonybruce-furlongpainting.zohobookings.com/#/customer/4396739000000147014"
            color="primary"
            target="_blank"
          >
            Book a Meeting with Luke
          </Link>
        </Box>
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
