export function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getDaysDifference(startDateId: string, endDateId: string): number {
  const start = new Date(startDateId);
  const end = new Date(endDateId);
  const oneDay = 24 * 60 * 60 * 1000;
  const diffInTime = Math.abs(end.getTime() - start.getTime());
  return Math.round(diffInTime / oneDay);
}

export function createDateFromFormat(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date();
  date.setFullYear(year);
  date.setMonth(month - 1);
  date.setDate(day);
  return date;
}

export function getDateId(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDayOfWeek(date: Date): string {
  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return daysOfWeek[date.getDay()];
}
