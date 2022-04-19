import {
  Box,
  Button,
  CircularProgress,
  Typography,
  useTheme,
} from '@mui/material'
import axios from 'axios'
import { useState } from 'react'
import ContactCreate from './ContactCreate'

const Contacts = ({
  search,
  setSearch,
  contacts,
  loading,
  setLoading,
  setSnackBarOpen,
  eventID,
}) => {
  const theme = useTheme()
  const [selectedContact, setSelectedContact] = useState('')
  const [open, setOpen] = useState(false)
  const handleSubmit = async () => {
    setLoading(true)
    const relatedResp = await axios.get(
      '/api/setContactInvitationStatus?recordId=' + selectedContact.id,
    )
    if (relatedResp?.data?.status !== 'error') {
      alert('successfully atteneded')
      window.location.reload(false)
    } else {
      console.log(relatedResp?.data?.message)
    }
    setLoading(false)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  return (
    <Box sx={{ mt: 3 }}>
      <Typography sx={{ mb: 1 }} variant="h6">
        Select Your Name
      </Typography>
      {loading === true ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        contacts.length > 0 &&
        contacts.map((contact, index) =>
          contact.Event_Name?.id === eventID ? (
            <Button
              fullWidth
              disabled={contact.Attendee_Status === 'Attended' && true}
              variant="outlined"
              key={index}
              onClick={() => setSelectedContact(contact)}
              sx={{
                mt: 1,
                '&:hover': {
                  color: '#fff',
                  backgroundColor: theme.palette.primary.main,
                },
                backgroundColor: `${
                  selectedContact.Name === contact.Name &&
                  theme.palette.primary.main
                }`,
                color: `${selectedContact.Name === contact.Name && '#fff'}`,
              }}
            >
              {contact.Name}
            </Button>
          ) : (
            ''
          ),
        )
      )}
      {open === true ? (
        <ContactCreate
          search={search}
          open={open}
          handleClickOpen={handleClickOpen}
          handleClose={handleClose}
          setSnackBarOpen={setSnackBarOpen}
          eventID={eventID}
        />
      ) : null}
      {loading !== true && (
        <p
          style={{
            display: 'flex',
            justifyContent: 'center',
            mt: 1,
            fontSize: '18px',
            color: theme.palette.primary.main,
            cursor: 'pointer',
          }}
          onClick={handleClickOpen}
        >
          Not Found? Add a Contact
        </p>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button variant="contained" color="success" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  )
}

export default Contacts
