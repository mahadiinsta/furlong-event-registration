import axios from 'axios'
export default async function handler(req, res) {
  try {
    const accessToken = await axios.get(process.env.ACCESSTOKEN_URL)
    const updateMap = {};
  if(req.body.number !== ""){
    updateMap.number = req.body.number;
  }
  if(req.body.firstName !== ""){
    updateMap.firstName = req.body.firstName;
  }
  if(req.body.lastName !== ""){
    updateMap.lastName = req.body.lastName;
  }
  if(req.body.email !== ""){
    updateMap.email = req.body.email;
  }
  if(req.body.title !== ""){
    updateMap.title = req.body.title;
  }
    const getEventAttendeeData = await axios.get(
      `https://www.zohoapis.com/crm/v2/Event_Attendees/${req.body.id}`,
      {
        headers: {
          Authorization: accessToken.data.access_token,
        },
      },
    )

    
    const contact_id = getEventAttendeeData?.data.data[0].Contacts.id;

    const updateContactResp = await axios.post(
      `https://www.zohoapis.com/crm/v2/Contacts/${req.body.id}`,
      { data: [updateMap] },
      {
        headers: {
          Authorization: accessToken.data.access_token,
        },
      },
    )
    console.log(contact_id)


    const updateEventAttendeeMap = {};

    if(req.body.number !== ""){
      updateEventAttendeeMap.Mobile = req.body.number;
    }
    if(req.body.email !== ""){
      updateEventAttendeeMap.Email = req.body.email;
    }
    if(req.body.title !== ""){
      updateEventAttendeeMap.Attendee_Title = req.body.title;
    }


    const updateEventAttendeeResp = await axios.post(
      `https://www.zohoapis.com/crm/v2/Event_Attendees/${req.body.id}`,
      { data: [updateEventAttendeeMap] },
      {
        headers: {
          Authorization: accessToken.data.access_token,
        },
      },
    )

    console.log({updateEventAttendeeResp})

    return await res.json({
      data: updateContactResp?.data,
    })
  } catch (error) {
    return await res.json({ status: 'error', message: error, comingFrom: "contact page" })
  }
}
