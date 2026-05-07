// BidX Countdown Timer Utility

export const formatTimeLeft = (endTime) => {
  const diff = new Date(endTime).getTime() - Date.now();

  if (diff <= 0) return { text: 'Ended', urgent: false, ended: true };

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  const urgent = diff < 300000; // < 5 minutes

  if (hours > 0) {
    return { text: `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`, urgent, ended: false };
  }
  return { text: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`, urgent, ended: false };
};

export const formatTimeShort = (endTime) => {
  const diff = new Date(endTime).getTime() - Date.now();

  if (diff <= 0) return { text: 'Ended', urgent: false, ended: true };

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  const urgent = diff < 300000;

  if (hours > 0) {
    return { text: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`, urgent, ended: false };
  }
  return { text: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`, urgent, ended: false };
};
