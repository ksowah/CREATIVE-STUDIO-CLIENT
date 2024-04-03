import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

interface Props {
  onChange: (e: any) => void;
  value: any;
}

export default function DateAndTimePicker({ onChange, value }: Props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker onChange={onChange} value={value} />
    </LocalizationProvider>
  );
}
