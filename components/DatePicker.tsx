"use client";
import "@wojtekmaj/react-datetimerange-picker/dist/DateTimeRangePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent
} from "@mui/material";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";

type Options =
  | "30 min"
  | "1 hour"
  | "6 hours"
  | "12 hours"
  | "Today"
  | "Yesterday"
  | "This week"
  | "This month"
  | "Custom";

export function CalculateDate(option: Options) {
  const now = new Date();
  switch (option) {
    case "30 min":
      return [new Date(now.getTime() - 30 * 60 * 1000), now];
    case "1 hour":
      return [new Date(now.getTime() - 60 * 60 * 1000), now];
    case "6 hours":
      return [new Date(now.getTime() - 6 * 60 * 60 * 1000), now];
    case "12 hours":
      return [new Date(now.getTime() - 12 * 60 * 60 * 1000), now];
    case "Today":
      return [new Date(now.setHours(0, 0, 0, 0)), new Date()];
    case "Yesterday":
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      return [
        new Date(yesterday.setHours(0, 0, 0, 0)),
        new Date(yesterday.setHours(23, 59, 59, 999))
      ];
    case "This week":
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      return [new Date(startOfWeek.setHours(0, 0, 0, 0)), now];
    case "This month":
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return [startOfMonth, now];
    default:
      break;
  }
}

export default function DatePicker({
  value,
  setValue,
  option,
  setOption
}: {
  value: any;
  setValue: any;
  option: any;
  setOption: any;
}) {
  function setDates(option: Options) {
    setValue(CalculateDate(option));
  }

  return (
    <Paper
      sx={{
        width: "380px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        position: "fixed",
        left: 0,
        top: 64,
        zIndex: 10
      }}
    >
      <FormControl fullWidth>
        <InputLabel id="range-label">Data time and date range</InputLabel>
        <Select
          labelId="range-label"
          value={option}
          label="Data time and date range"
          onChange={(event: SelectChangeEvent) => {
            setOption(event.target.value as any);
            setDates(event.target.value as any);
          }}
        >
          <MenuItem value={"30 min"}>30 min</MenuItem>
          <MenuItem value={"1 hour"}>1 hour</MenuItem>
          <MenuItem value={"6 hours"}>6 hours</MenuItem>
          <MenuItem value={"12 hours"}>12 hours</MenuItem>
          <MenuItem value={"Today"}>Today</MenuItem>
          <MenuItem value={"Yesterday"}>Yesterday</MenuItem>
          <MenuItem value={"This week"}>This week</MenuItem>
          <MenuItem value={"This month"}>This month</MenuItem>
          <MenuItem value={"Custom"}>Custom</MenuItem>
        </Select>
      </FormControl>
      {option === "Custom" && (
        <DateTimeRangePicker
          onChange={setValue}
          value={value}
          disableClock={true}
          format="dd-MM-y h:mm"
        ></DateTimeRangePicker>
      )}
    </Paper>
  );
}
