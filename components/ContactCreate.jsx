import { Box, CircularProgress } from '@mui/material'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import axios from 'axios'

import { useState } from 'react'

export default function ContactCreate({
  search,
  open,
  handleClickOpen,
  handleClose,
  accountID,
  setSnackBarOpen,
  eventID,
}) {
  const [contactMap, setContactMap] = useState({})
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreateContact = async () => {
    setLoading(true)
    const contactMap = {
      First_Name: firstName,
      Last_Name: lastName,
      Account_Name: search?.Accounts?.id,
    }
    const createResp = await axios.post('/api/CreateContact', contactMap)

    if (createResp?.data?.data?.data[0].status === 'success') {
      const createAttendeeMap = {
        Name: firstName + ' ' + lastName,
        Accounts: search?.Accounts?.id,
        Event_Name: eventID,
        Attendee_Status: 'Attended',
        Contacts: createResp?.data?.data?.data[0].details.id,
      }
      const createEventAttendeeResp = await axios.post(
        '/api/CreateEventAttendee',
        createAttendeeMap,
      )
      setSnackBarOpen(true)
      handleClose()
      setLoading(false)
    }
    if (createResp?.data?.data?.data[0]?.status === 'error') {
      alert('something wrong , please try again')
      window.location.reload(false)
    }
    setLoading(false)
  }

  return (
    <Box sx={{ m: 1, display: 'flex', justifyContent: 'center' }}>
      {loading === true ? (
        <CircularProgress />
      ) : (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Create a New Contact</DialogTitle>
          <DialogContent>
            <TextField
              onBlur={(e) => setFirstName(e.target.value)}
              autoFocus
              label="First Name"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              onBlur={(e) => setLastName(e.target.value)}
              autoFocus
              label="Last Name"
              type="text"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleCreateContact} variant="contained">
              Add Contact
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  )
}
