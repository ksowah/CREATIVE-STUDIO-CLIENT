import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { IoTrashOutline } from "react-icons/io5";
import ButtonSolid from "./ButtonSolid";


interface Props {
    action: any
    actionButtonTitle: string
    actionHeaderTitle: string
    actionBodyText: string
}

export default function ActionConfirmationDialogue({action, actionButtonTitle, actionHeaderTitle, actionBodyText}:Props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAction = () => {
    action();
    setOpen(false);
  }

  return (
    <React.Fragment>
      <div
        onClick={handleClickOpen}
        className="flex items-center justify-center cursor-pointer h-[2rem] w-[2rem] rounded-full bg-transparent backdrop-blur-md "
      >
        <IoTrashOutline size={16} color="#fff" />
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {actionHeaderTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {actionBodyText}
          </DialogContentText>
        </DialogContent>
        <DialogActions className="space-x-4 p-4" >
          <ButtonSolid title="Cancel" onClick={handleClose} />
          <button onClick={handleAction} className="text-red-500" >{actionButtonTitle}</button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
