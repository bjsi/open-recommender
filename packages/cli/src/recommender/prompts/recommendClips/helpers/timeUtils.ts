export const hhmmssToSeconds = (hhmmss: string) => {
  const [hours, minutes, seconds] = hhmmss.split(":");
  return (
    parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds) * 1
  );
};
