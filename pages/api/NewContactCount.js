import axios from 'axios'
export default async function handler(req, res) {
  try {
    const accessToken = await axios.get(process.env.ACCESSTOKEN_URL)
    const recordId = req?.query?.recordId

    const getData = await axios.get(
      `https://www.zohoapis.com/crm/v2/OHS_Event/${recordId}`,
      {
        headers: {
          Authorization: accessToken.data.access_token,
        },
      },
    )

    let newContactNumber = {}

    if (getData?.data?.data[0].New_Contacts_Registered === null) {
      newContactNumber = {
        New_Contacts_Registered: 1,
        id: recordId,
      }
    } else {
      newContactNumber = {
        New_Contacts_Registered:
          getData?.data?.data[0].New_Contacts_Registered + 1,
        id: recordId,
      }
    }

    const sendData = await axios.put(
      `https://www.zohoapis.com/crm/v2/OSHE/${recordId}`,
      { data: [newContactNumber] },
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
