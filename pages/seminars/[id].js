import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
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
import ContactUpdate from "../../components/ContactUpdate";
import { useRouter } from "next/router";
import InviteSuccessPage from "../../components/InviteSuccessPage";

const SnackAlert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function EventsAndSeminars({
  accounts,
  EventID,
  EventNameResp,
}) {
  const [selectedAccount, setSelectedAccount] = useState(null);
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

  const router = useRouter();

  const { id } = router.query;

  const eventId = id;

  //for account
  let [newAccount, setNewAccount] = useState(false);
  const [accountName, setAccountName] = useState("");

  const [editContact, setEditContact] = useState(false);

  //contact update states
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  console.log({ selectedAccount });

  // Invite Successful

  const [openThankYou, setOpenThankYou] = React.useState(false);

  //Getting Contacts for Each School

  const handleSearch = async (account) => {
    setSelectedAccount(account);
    const account_id = account.Invited_Accounts.id;
    const relatedResp = await axios.get(
      "/api/getRelatedData?accountId=" + account_id
    );

    if (
      relatedResp?.data?.status !== "error" &&
      relatedResp.data.data !== "" &&
      relatedResp?.data?.data?.data.length > 0
    ) {
      const key = "Name";
      const arrayUniqueByKey = [
        ...new Map(
          relatedResp?.data?.data?.data.map((item) => [item[key], item])
        ).values(),
      ];
      setContacts(arrayUniqueByKey || []);
    } else {
      setContacts([]);
    }
  };

  const handleSnackbarClose = () => {
    setSnackBarOpen(false);
  };

  const handleCreateContact = async (account_id) => {
    setLoading(true);
    const contactMap = {
      First_Name: firstName,
      Last_Name: lastName,
      Email: email,
      Phone: number,
      Title: title,
      Account_Name:
        newAccount === true
          ? account_id
          : selectedAccount?.Invited_Accounts?.id,
    };
    const createResp = await axios.post("/api/CreateContact", contactMap);

    if (createResp?.data?.data?.data[0].status === "success") {
      const createAttendeeMap = {
        Name: firstName + " " + lastName,
        Accounts:
          newAccount === true
            ? account_id
            : selectedAccount?.Invited_Accounts?.id,
        Event_Name: eventId,
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
        `/api/NewContactCount?recordId=${eventId}`
      );
      console.log({ sendData });
      setLoading(false);
      if (sendData.data.status === "success") {
        setOpenThankYou(true);
      }
    }

    if (createResp?.data?.data?.data[0]?.status === "error") {
      alert("something wrong , please try again");
      window.location.reload(false);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setLoading(true)
    const accountMap = {
      EventID: eventId,
      Account_Name: accountName,
    };
    const accountCreateResp = await axios.post(
      "/api/CreateAccount",
      accountMap
    );

    alert(accountCreateResp?.data?.data?.data[0].status);

    if (accountCreateResp?.data?.data?.data[0].status === "success") {
      const contactCreateResp = handleCreateContact(
        accountCreateResp.data?.data?.data[0].details.id
      );
      setOpenThankYou(true);
    } else {
      alert("Something went wrong");
      window.location.reload(false);
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
      handleCreateContact();
    } else if (
      newContact === true &&
      (firstName === "" || lastName === "" || number === "")
    ) {
      alert("Please Fill All the data");
    } else if (
      newAccount === true &&
      newContact !== true &&
      (firstName !== "" || lastName !== "")
    ) {
      handleCreateAccount(e);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    const relatedResp = await axios.post(
      "/api/setContactInvitationStatus?recordId=" + selectedContact?.id,
      { Note: note, Painting_Needs: paintingNeed }
    );
    if (relatedResp?.data?.status !== "error") {
      setOpenThankYou(true);
    } else {
      alert("Something is wrong with the details! Please try again");
      window.location.reload(false);
    }
    setLoading(false);
  };

  return (
    <>
      {loading === false ? (
        <Box component="form">
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
                    v !== null ? handleSearch(v) : setSelectedAccount(null)
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
              label="Add School Name"
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
                  <>
                    {" "}
                    <Box
                      sx={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-around",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <Autocomplete
                        sx={{
                          mt: 1,
                          width: "100%",
                          // width: `${selectedContact === "" ? "100%" : "80%"}`,
                        }}
                        disablePortal
                        onChange={(e, v) => v !== null && setSelectedContact(v)}
                        options={contacts}
                        getOptionLabel={(option) => option?.Contacts?.name}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            placeholder="-Select-"
                          />
                        )}
                      />
                      {/* {selectedContact !== "" ? (
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ width: "120px", height: "100%" }}
                    onClick={() => handleClickOpen()}
                  >
                    Edit
                  </Button>
                ) : (
                  ""
                )} */}
                    </Box>
                  </>
                )}
                <FormControlLabel
                  sx={{ mt: 1, mb: 1 }}
                  control={
                    <Checkbox
                      size="small"
                      onChange={() => setNewContact(!newContact)}
                    />
                  }
                  label="Add New Contact"
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
                      style={{
                        fontWeight: 600,
                        fontSize: 26,
                        color: "#1565C0",
                      }}
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
                  <label style={{ fontWeight: 500, marginBottom: 5 }}>
                    Phone
                  </label>
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
              Does your school have a painting need that you would like to
              discuss or have quoted?
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
              Thank you for taking the time to stop and chat, we will be in
              contact soon!
            </em>
            <Box
              sx={{
                display: "flex",
                juistifyContent: "center",
                alignItems: "center",
              }}
            >
              {newAccount !== true && newContact === true ? (
                <Button
                  variant="contained"
                  align="center"
                  sx={{ margin: "20px auto 5px auto " }}
                  onClick={(e) => handleRegister(e)}
                  type="submit"
                >
                  New Contact Register
                </Button>
              ) : newAccount === true && newContact !== true ? (
                <Button
                  variant="contained"
                  align="center"
                  sx={{ margin: "20px auto 5px auto " }}
                  onClick={(e) => handleRegister(e)}
                  type="submit"
                >
                  New School Register
                </Button>
              ) : (
                <Button
                  variant="contained"
                  align="center"
                  sx={{ margin: "20px auto 5px auto " }}
                  onClick={(e) => handleInvite(e)}
                  type="submit"
                >
                  Contact Attended
                </Button>
              )}
            </Box>
          </Box>
          <ContactUpdate
            open={open}
            handleClose={handleClose}
            selectedContact={selectedContact}
          />
          <InviteSuccessPage open={openThankYou} paintingNeed={paintingNeed} />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress size={40} />
        </Box>
      )}
    </>
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
    const accounts = eventsResp.data.data;

    const strAscending = [...accounts].sort((a, b) =>
      a.Invited_Accounts.name > b.Invited_Accounts.name ? 1 : -1
    );
    return {
      props: {
        accounts: strAscending,
        EventID: id,
        EventNameResp: EventNameResp.data.data,
      }, // will be passed to the page component as props
    };
  } else {
    return {
      props: {
        accounts: [],
        EventID: null,
        EventNameResp: EventNameResp.data.data,
      }, // will be passed to the page component as props
    };
  }
  // return {
  //   props: { session },
  // };
}
