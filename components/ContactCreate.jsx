import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { useState } from 'react'

export default function ContactCreate({
  open,
  handleClickOpen,
  handleClose,
  accountID,
}) {
  const [contactMap, setContactMap] = useState({})
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const handleCreateContact = () => {
    contactMap = {
      First_Name: firstName,
      Last_Name: lastName,
      Account_Name: accountID,
    }
    console.log(contactMap)
  }
  return (
    <div>
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
    </div>
  )
}
