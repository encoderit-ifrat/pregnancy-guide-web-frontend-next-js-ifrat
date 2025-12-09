import { setHours, setMinutes, setSeconds, setMilliseconds } from "date-fns";
import { parseISO } from "date-fns";

export const normalizeToUTC = (date: Date) => {
    const d = setMilliseconds(setSeconds(setMinutes(setHours(date, 0), 0), 0), 0);
    return new Date(d.toISOString()); // ensures UTC representation
};

export const toUTCMidnight = (dateString: string) => {
    // Extract year, month, day manually — avoid timezone conversion
    const [year, month, day] = dateString.split("-").map(Number);
    const utcDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    return new Date(utcDate.toISOString());
};