import axios from 'axios'
export default async function handler(req, res) {
  try {
    const accessToken = await axios.get(process.env.ACCESSTOKEN_URL)
    const accountId = req?.query?.accountId
    const sendData = await axios.get(
      `https://www.zohoapis.com/crm/v2/Event_Attendees/search?criteria=Accounts:equals:${accountId}`,
      {
        headers: {
          Authorization: accessToken.data.access_token,
        },
      },
    )
    return await res.json({
      status: 'success',
      message: 'Data updated successfully',
      data: sendData?.data,
    })
  } catch (error) {
    return await res.json({ status: 'error', message: error })
  }
}
