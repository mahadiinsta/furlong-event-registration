import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { Box, DialogContent, Link } from "@mui/material";

import success from "./welcome.png";
import Image from "next/image";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
  
});

export default function InviteSuccessPage({ open, paintingNeed }) {

  return (
    <div>
      <Dialog fullScreen open={open} TransitionComponent={Transition}>
        <DialogContent
          sx={{
            height: "100%",
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
                  Thank you for you submission, would you like to book a time
                  with Luke now to discuss your painting needs?
                </Typography>
                <Box
                  sx={{
                    pt: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    pb: 2,
                  }}
                >
                  <Link
                    href="https://tonybruce-furlongpainting.zohobookings.com/#/customer/4396739000000147014"
                    color="primary"
                    target="_blank"
                  >
                    Book a Meeting with Luke
                  </Link>
                </Box>
              </>
            ) : (
              <Typography variant="h6">Thank you for you Attending!!!</Typography>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
