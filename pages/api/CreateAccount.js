import { OneKPlusOutlined } from '@mui/icons-material'
import axios from 'axios'
export default async function handler(req, res) {
  try {
    const accessToken = await axios.get(process.env.ACCESSTOKEN_URL)

    const createAccount = await axios.post(
      `https://www.zohoapis.com/crm/v2/Accounts`,
      { data: [{Account_Name: req.body.Account_Name }] },
      {
        headers: {
          Authorization: accessToken.data.access_token,
        },
      },
    )


    const account_id = createAccount?.data.data[0].details.id;


    const associateAccount = await axios.post(
      `https://www.zohoapis.com/crm/v2/Accounts_X_FP_Events`,
      { data: [{
        Invited_Accounts: account_id,
        FP_Events: req.body.EventID
      }] },
      {
        headers: {
          Authorization: accessToken.data.access_token,
        },
      },
    )

    return await res.json({
      data: createAccount?.data,
    })
  } catch (error) {
    return await res.json({ status: 'error', message: error,comingFrom: "Accunt page" })
  }
}
