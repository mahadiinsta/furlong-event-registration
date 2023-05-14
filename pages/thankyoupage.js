import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

export default function Thankyoupage() {
  const router = useRouter();

  const paintingNeed = router.query.paintingNeeds;

  const eventID = router.query.event_id;


  useEffect(() => {
    if(paintingNeed === "No"){
        setTimeout(() => {
            router.push("/seminars/" + eventID)
        },1000)
    }
  },[])



  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box>
        {paintingNeed === "Yes" ||
        paintingNeed === "Unsure(But Open To conversation)" ? (
          <>
            <Typography variant="h6">
              Thank you for you submission, would you like to book a time with
              Luke now to discuss your painting needs?
            </Typography>
            <Box
              sx={{
                pt: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                pb: 2,
                gap: 1
              }}
            >
              <Link
                href="https://tonybruce-furlongpainting.zohobookings.com/#/customer/4396739000000147014"
                target="_blank"
                sx={{color: "blue"}}
              >
               <p style={{color:"blue", textDecoration:"underline"}}>Book a Meeting with Luke</p>
              </Link>
              <Button onClick={() => router.push("/seminars/" + eventID)} variant="contained" size="small">No</Button>
            </Box>
          </>
        ) : (
          <Typography variant="h6">Thank you for you Attending!!!</Typography>
        )}
      </Box>
    </Box>
  );
}
