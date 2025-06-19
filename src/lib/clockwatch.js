import { get } from "svelte/store";
import { STATE } from "./stores";

/**
 * @param {string} time
 * @returns number[]
 */
function parse_time_hms(time) {
	return time.split(":").map((e) => parseInt(e));
}

/**
 * @param {any[]} parts
 * @returns String.
 */
function format_hms(parts) {
	return parts.map((p) => p.toString().padStart(2, "0")).join(":");
}

export function start_clockwatch() {
	setInterval(() => {
		let [hour, minute, second] = parse_time_hms(get(STATE).clockwatch);

		second += 1;

		let newMinutes = Math.floor(second / 60);
		minute += newMinutes;
		second -= 60 * newMinutes;

		let newHours = Math.floor(minute / 60);
		hour += newHours;
		minute -= 60 * newHours;

		STATE.set("clockwatch", format_hms([hour, minute, second]));
	}, 1000);
}
