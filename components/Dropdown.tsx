"use client";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";

export default function SelectLabels() {
  const [selected, setSelected] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setSelected(event.target.value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 200 }}>
        <InputLabel id="select-filter-by-field">
          <p className="text-black">Category</p>
        </InputLabel>
        <Select
          labelId="select-filter-by-field-labe;"
          id="select-filter-by-field"
          value={selected}
          label="Category"
          onChange={handleChange}
          sx={{
            color: "#000",
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: "#A6A6A6",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#808080",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#797979",
            },
          }}
        >
          <MenuItem value={"Designs"}>Designs</MenuItem>
          <MenuItem value={"Arts"}>Arts</MenuItem>
          <MenuItem value={"Following"}>Following</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
