import { Button } from "@mui/material";
import React from "react";

interface Props {
  onClick?: () => void;
  className: string;
  title: string;
  loading?: boolean;
}

const ButtonSolid = ({ onClick, className, title, loading }: Props) => {
  return (
    <Button
      variant="contained"
      style={{ backgroundColor: "#000" }}
      className={`${className}`}
      onClick={onClick}
      disabled={loading}
    >
      <p className="normal-case font-medium">{loading ? "Loading..." : title }</p>
    </Button>
  );
};

export default ButtonSolid;
