import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ButtonSolid from "./ButtonSolid";
import ButtonOutlined from "./ButtonOutlined";

interface Props {
  action: any;
  actionButtonTitle: string;
  actionHeaderTitle: string;
  actionBodyText: string;
  OpenDialogueButton: React.FC;
  isNotDelete?: boolean;
}

export default function ActionConfirmationDialogue({
  action,
  actionButtonTitle,
  actionHeaderTitle,
  actionBodyText,
  OpenDialogueButton,
  isNotDelete,
}: Props) {
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
  };

  return (
    <React.Fragment>
      <div onClick={handleClickOpen}>
        <OpenDialogueButton />
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{actionHeaderTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {actionBodyText}
          </DialogContentText>
        </DialogContent>
        <DialogActions className="space-x-4 p-4">
          {isNotDelete ? (
            <>
              <ButtonOutlined title="Cancel" onClick={handleClose} />
              <ButtonSolid title={actionButtonTitle} onClick={handleAction} />
            </>
          ) : (
            <>
              <ButtonSolid title="Cancel" onClick={handleClose} />
              <button onClick={handleAction} className="text-red-500">
                {actionButtonTitle}
              </button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
