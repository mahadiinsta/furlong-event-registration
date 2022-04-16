import axios from 'axios'
export default async function handler(req, res) {
  // console.log(req)
  try {
    const accessToken = await axios.get(process.env.ACCESSTOKEN_URL)
    const sendData = await axios.get(
      `https://www.zohoapis.com/crm/v2/Contacts`,
      {
        headers: {
          Authorization: accessToken.data.access_token,
        },
      },
    )
    console.log(recordId)
    console.log(sendData)
    return await res.json({
      status: 'success',
      message: 'Data updated successfully',
      data: sendData?.data,
    })
  } catch (error) {
    return await res.json({ status: 'error', message: error })
  }
}
