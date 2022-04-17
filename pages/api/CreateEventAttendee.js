import axios from 'axios'
export default async function handler(req, res) {
  try {
    const accessToken = await axios.get(process.env.ACCESSTOKEN_URL)
    const sendData = await axios.post(
      `https://www.zohoapis.com/crm/v2/Event_Attendees`,
      { data: [req.body] },
      {
        headers: {
          Authorization: accessToken.data.access_token,
        },
      },
    )
    return await res.json({
      data: sendData?.data,
    })
  } catch (error) {
    return await res.json({ status: 'error', message: error })
  }
}
