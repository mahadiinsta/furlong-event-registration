import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, TextField } from '@mui/material';
import PhoneInput from 'react-phone-input-2';
import { useState } from "react";
import axios from 'axios';

export default function ContactUpdate({open,handleClose,selectedContact}) {
    const [number, setNumber] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [title, setTitle] = useState("");

    const [update,setUpdate] = useState(false)

    const updateMap = {
        id: selectedContact?.id,
        number: number,
        firstName: firstName,
        lastName: lastName,
        email: email,
        title: title
    };

    const handleUpdate = async() => {
        if(updateMap.number !== "" || updateMap.firstName !== ""|| updateMap.lastName !== ""|| updateMap.email !== ""|| updateMap.title !== ""){
            const updateContact = await axios.post(
                "/api/updateContact",
                updateMap
              );
              console.log({updateContact})
        }else{
            alert("at least need one field to be field to be updated")
        }
    }
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
        <Box>
              <label style={{ fontWeight: 500 }}>First Name</label>
              <br />
              <TextField
                fullWidth
                sx={{ mt: 1, mb: 1 }}
                onBlur={(e) => setFirstName(e.target.value)}
                required
                placeholder={selectedContact?.Name?.split(" ")[0]}
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
                placeholder={selectedContact?.Name?.split(" ")[1]}
              />
            </Box>
            <Box>
              <label style={{ fontWeight: 500 }}>Title</label>
              <br />
              <TextField
                fullWidth
                sx={{ mt: 1, mb: 1 }}
                onBlur={(e) => setTitle(e.target.value)}
                placeholder={selectedContact.Email}
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
                placeholder={selectedContact.Mobile}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}