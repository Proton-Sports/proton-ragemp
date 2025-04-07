export function formatRelativeTimeParts(ms: number) {
  const sign = ms < 0 ? '-' : '+';
  ms = Math.abs(ms);
  const totalMinutes = ms / 1000 / 60;
  const minutes = Math.floor(totalMinutes);
  const seconds = Math.floor((totalMinutes - minutes) * 60);
  const milliseconds = Math.round((ms / 1000 - minutes * 60 - seconds) * 1000);
  return [
    sign,
    minutes + '',
    (seconds + '').padStart(2, '0'),
    (Math.round(milliseconds / 10) + '').padStart(3, '0'),
  ] as const;
}
