import { Button } from "@mui/material";
import React from "react";

interface Props {
  onClick?: () => void;
  className: string;
  title: string;
}

const ButtonSolid = ({ onClick, className, title }: Props) => {
  return (
    <Button
      variant="contained"
      style={{ backgroundColor: "#000" }}
      className={`${className}`}
      onClick={onClick}
    >
      <p className="normal-case font-medium">{title}</p>
    </Button>
  );
};

export default ButtonSolid;
