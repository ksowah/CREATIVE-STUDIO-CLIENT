import { Button } from "@mui/material";
import React from "react";

interface Props {
    onClick?: () => void;
    className: string;
    title: string;
}

const ButtonOutlined = ({onClick, className, title}:Props) => {

  return (
    <Button
      variant="outlined"
      color="inherit"
      className={`${className}`}
      onClick={onClick}
    >
      <p className="normal-case font-bold">{title}</p>
    </Button>
  );
};

export default ButtonOutlined;
