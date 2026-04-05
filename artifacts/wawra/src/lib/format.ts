export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  const mDisplay = m < 10 && h > 0 ? `0${m}` : m.toString();
  const sDisplay = s < 10 ? `0${s}` : s.toString();
  
  if (h > 0) return `${h}:${mDisplay}:${sDisplay}`;
  return `${mDisplay}:${sDisplay}`;
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  } catch (e) {
    return dateString;
  }
}
