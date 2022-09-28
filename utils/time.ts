import { TimeDelta } from "./types";

export const ZERO_TIME_DELTA = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

export const msToTime = (milliseconds: number): TimeDelta => {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  seconds = seconds % 60;
  minutes = minutes % 60;

  hours = hours % 24;

  return {
    days,
    hours,
    minutes,
    seconds,
  };
};

export const padTo2Digits = (num: number) => {
  return num.toString().padStart(2, "0");
};
