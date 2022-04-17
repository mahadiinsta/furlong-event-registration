import { Box } from '@mui/material'
import EventsAndSeminars from './seminars/[id].js'

export default function Home({ events, id }) {
  return (
    <Box>
      <EventsAndSeminars />
    </Box>
  )
}
