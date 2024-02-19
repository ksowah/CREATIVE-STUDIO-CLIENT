"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import Image from "next/image";
import { TextField } from "@mui/material";
import ButtonOutlined from "./ButtonOutlined";
import ButtonSolid from "./ButtonSolid";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function UploadDialogue() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        className="h-[2.8rem] w-[9rem]"
        color="inherit"
        variant="outlined"
        onClick={handleClickOpen}
      >
        <p className="normal-case font-medium">Continue</p>
      </Button>
      <Dialog
        maxWidth={false}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Final Touches"}</DialogTitle>
        <DialogContent className="w-[60rem] ">
          <p className="font-medium text-sm">Thumbnail preview</p>
          <div className="w-full flex items-start space-x-4">
            <div className="space-y-6">
              <div className="relative h-[16rem] w-[16rem]">
                <Image
                  src={"/images/slide2.jpg"}
                  fill
                  alt=""
                  objectFit="cover"
                />
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">
                  Tag{" "}
                  <span className="font-normal text-[#797979]">
                    separate each tag with a comma &quot;,&quot; (maximum 20)
                  </span>
                </p>
                <TextField
                  id="outlined-basic"
                  label="Add tags..."
                  variant="outlined"
                  className="w-full"
                />
                <p className="text-sm font-medium my-1">
                  Suggested:{" "}
                  <span className="font-normal text-[#797979]">
                    design, illustration, ui, branding, logo, graphic, vector ,
                    ux, typography, app, art
                  </span>
                </p>
              </div>

              <div>
                <p className="text-sm font-medium mb-2"> Description </p>
                <TextField
                  id="outlined-basic"
                  label="This is an E-commerce website"
                  variant="outlined"
                  className="w-full"
                />
              </div>

            <div className="flex items-center justify-between" >
                <ButtonOutlined className="w-[8rem] h-[3rem]" title="Cancel" />

                <div className="flex items-center space-x-4" >
                <ButtonOutlined className="w-[8rem] h-[3rem]" title="Save as draft" />
                <ButtonSolid className="w-[8rem] h-[3rem]" title="Publish now" />
                </div>
            </div>
            </div>

          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
