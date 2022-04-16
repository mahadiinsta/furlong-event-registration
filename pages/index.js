import { Autocomplete, Box, TextField, Typography } from '@mui/material'
import axios from 'axios'
import Image from 'next/image'
import { useState } from 'react'
import Contacts from '../components/Contacts.jsx'
import logo from '../public/Furlong_newLogo_medium 1.jpg'

export default function Home({ events }) {
  const [search, setSearch] = useState(null)
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (event) => {
    setSearch(event)
    setLoading(true)
    const relatedResp = await axios.get(
      '/api/getRelatedData?recordId=' + event.id,
    )
    if (relatedResp?.data?.status !== 'error') {
      setContacts(relatedResp?.data?.data?.data || [])
      setLoading(false)
    }
    setLoading(false)
  }

  return (
    <Box>
      <Box
        sx={{
          maxWidth: 786,
          padding: 5,
          margin: '10px auto',
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
            <Image src={logo} alt="logo" width={300} height={300} />
          </Box>
          <Typography align="center" variant="h5">
            Conference Name
          </Typography>
        </Box>
        <Autocomplete
          disablePortal
          onChange={(e, v) => (v !== null ? handleSearch(v) : setSearch(null))}
          options={events}
          getOptionLabel={(option) => option.Name}
          renderInput={(params) => (
            <TextField {...params} fullWidth placeholder="Search School" />
          )}
        />
        {search !== null && (
          <Contacts
            setSearch={setSearch}
            contacts={contacts}
            loading={loading}
            setLoading={setLoading}
          />
        )}
      </Box>
    </Box>
  )
}

const schools = [
  { title: 'furlong paintaing school' },
  { title: 'Hogwarts school' },
  { title: 'Veleveer school' },
]

export async function getServerSideProps(context) {
  const accessToken = await axios.get(process.env.ACCESSTOKEN_URL)
  const eventsResp = await axios.get(`https://www.zohoapis.com/crm/v2/OSHE`, {
    headers: {
      Authorization: accessToken.data.access_token,
    },
  })
  if (!!eventsResp?.data?.data) {
    return {
      props: {
        events: eventsResp.data.data,
      }, // will be passed to the page component as props
    }
  } else {
    return {
      props: { events: [] }, // will be passed to the page component as props
    }
  }
  // return {
  //   props: { session },
  // };
}
