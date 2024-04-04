import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ButtonSolid from "./ButtonSolid";
import ButtonOutlined from "./ButtonOutlined";
import { useRouter } from "next/navigation";

export default function PromptSigninPopup({
  ActionButton,
}: {
  ActionButton: React.FC;
}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const navigateToLogin = () => {
    router.push("/login");
    handleClose();
  };
  const navigateToSignup = () => {
    router.push("/signup");
    handleClose();
  };

  const router = useRouter();

  return (
    <React.Fragment>
      <div onClick={handleClickOpen}>
        <ActionButton />
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Login to continue"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Unleashe your creative breliance to the world. Show the world your
            creative works and gain the exposure you deserve.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <ButtonSolid
            onClick={navigateToLogin}
            className="w-[7rem] "
            title="Login"
          />
          <ButtonOutlined
            onClick={navigateToSignup}
            className="w-[7rem]"
            title="Sign up"
          />
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
