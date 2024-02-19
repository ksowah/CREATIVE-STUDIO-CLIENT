"use client"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState } from 'react';

export default function SelectLabels() {
  const [selected, setSelected] = useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setSelected(event.target.value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 200 }}>
        <InputLabel id="demo-simple-select-helper-label">Category</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={selected}
          label="Category"
          onChange={handleChange}
        >
          <MenuItem value={"Designs"}>Designs</MenuItem>
          <MenuItem value={"Arts"}>Arts</MenuItem>
          <MenuItem value={"Following"}>Following</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}