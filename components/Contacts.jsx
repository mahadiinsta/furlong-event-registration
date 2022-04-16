import {
  Box,
  Button,
  CircularProgress,
  Link,
  Typography,
  useTheme,
} from '@mui/material'
import axios from 'axios'
import { useState } from 'react'
import ContactCreate from './ContactCreate'

const Contacts = ({ setSearch, contacts, loading, setLoading }) => {
  const theme = useTheme()
  const [selectedContact, setSelectedContact] = useState('')
  const [open, setOpen] = useState(false)
  const handleSubmit = async () => {
    setLoading(true)
    const relatedResp = await axios.get(
      '/api/setContactInvitationStatus?recordId=' + selectedContact.id,
    )
    if (relatedResp?.data?.status !== 'error') {
      setSearch(null)
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
        contacts.map((contact, index) => (
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
        ))
      )}
      {console.log(contacts)}
      {open === true ? (
        <ContactCreate
          open={open}
          handleClickOpen={handleClickOpen}
          handleClose={handleClose}
        />
      ) : null}
      {contacts.length === 0 && (
        <Link
          sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}
          href="#"
          underline="none"
          onClick={handleClickOpen}
        >
          Not Found? Add a Contact
        </Link>
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

const tempContacts = [
  { title: 'contact 1' },
  { title: 'contact 2' },
  { title: 'contact 3' },
  { title: 'contact 4' },
]
