import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);
const TIME_AGO = new TimeAgo("en-US");

export function timeAgo(date: Date): string {
    return TIME_AGO.format(date);
}
