import {
  Autocomplete,
  Box,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material'
import MuiAlert from '@mui/material/Alert'
import axios from 'axios'
import Image from 'next/image'
import * as React from 'react'
import { useState } from 'react'
import Contacts from '../../components/Contacts'
import logo from '../../public/Furlong_newLogo_medium 1.jpg'

const SnackAlert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export default function EventsAndSeminars({ accounts, id, EventNameResp }) {
  const [search, setSearch] = useState(null)
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(false)
  const [snackbarOpen, setSnackBarOpen] = useState(false)
  const handleSearch = async (account) => {
    setLoading(true)
    setSearch(account)
    const relatedResp = await axios.get(
      '/api/getRelatedData?accountId=' + account?.Accounts?.id,
    )
    if (relatedResp?.data?.status !== 'error') {
      setContacts(relatedResp?.data?.data?.data || [])
      setLoading(false)
    }
    setLoading(false)
  }
  const handleSnackbarClose = () => {
    setSnackBarOpen(false)
  }

  return (
    <Box>
      <Box
        sx={{
          maxWidth: 786,
          minHeight: 700,
          padding: 5,
          border: '1px solid #075878',
          margin: '50px auto 0px auto',
          backgroundColor: '#fff',
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
            <Image src={logo} alt="logo" width={300} height={300} />
          </Box>
          <Typography
            align="center"
            variant="h4"
            sx={{ mt: 5, fontWeight: 'bold' }}
          >
            {EventNameResp !== undefined && EventNameResp[0].Name}
          </Typography>
        </Box>
        <Autocomplete
          disablePortal
          onChange={(e, v) => (v !== null ? handleSearch(v) : setSearch(null))}
          options={accounts}
          getOptionLabel={(option) => option.Accounts.name}
          renderInput={(params) => (
            <TextField {...params} fullWidth placeholder="Search School" />
          )}
        />
        {search !== null && (
          <Contacts
            search={search}
            setSearch={setSearch}
            contacts={contacts}
            loading={loading}
            setLoading={setLoading}
            setSnackBarOpen={setSnackBarOpen}
            eventID={EventNameResp !== undefined && EventNameResp[0].id}
          />
        )}
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <SnackAlert severity="success" sx={{ width: '100%' }}>
          Contact Created Successfully
        </SnackAlert>
      </Snackbar>
    </Box>
  )
}

export async function getServerSideProps(context) {
  const accessToken = await axios.get(process.env.ACCESSTOKEN_URL)
  const id = context.params.id
  const eventsResp = await axios.get(
    `https://www.zohoapis.com/crm/v2/OSHE/${id}/Accounts112`,
    {
      headers: {
        Authorization: accessToken.data.access_token,
      },
    },
  )
  const EventNameResp = await axios.get(
    `https://www.zohoapis.com/crm/v2/OSHE/${id}`,
    {
      headers: {
        Authorization: accessToken.data.access_token,
      },
    },
  )

  if (!!eventsResp?.data?.data) {
    return {
      props: {
        accounts: eventsResp.data.data,
        id: id,
        EventNameResp: EventNameResp.data.data,
      }, // will be passed to the page component as props
    }
  } else {
    return {
      props: { accounts: [], id: null, EventNameResp: [] }, // will be passed to the page component as props
    }
  }
  // return {
  //   props: { session },
  // };
}
