import { Button } from "@mui/material";
import React from "react";

interface Props {
  onClick?: () => void;
  className?: string;
  title: string;
  Icon?: React.ReactNode;
}

const ButtonSolid = ({ onClick, className, title, Icon }: Props) => {
  return (
    <Button
      variant="contained"
      style={{ backgroundColor: "#000" }}
      className={`${className}`}
      onClick={onClick}
      endIcon={Icon}
    >
      <p className="normal-case font-medium">{ title }</p>
    </Button>
  );
};

export default ButtonSolid;
