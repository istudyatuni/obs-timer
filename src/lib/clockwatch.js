import { get } from "svelte/store";

import { STATE } from "./stores";
import { CLOCKWATCH_STATUSES } from "./constants";

/**
 * @param {string} time
 * @returns number[]
 */
export function parse_time_hms(time) {
	return time.split(":").map((e) => parseInt(e));
}

/**
 * @param {any[]} parts
 * @returns String.
 */
export function format_hms(parts) {
	return parts.map((p) => p.toString().padStart(2, "0")).join(":");
}

export function recalculate_hms([h, m, s]) {
	let newMinutes = Math.floor(s / 60);
	m += newMinutes;
	s -= 60 * newMinutes;

	let newHours = Math.floor(m / 60);
	h += newHours;
	m -= 60 * newHours;

	return [h, m, s];
}

export function start_clockwatch() {
	setInterval(() => {
		if (get(STATE).clockwatch_status === CLOCKWATCH_STATUSES.pause) {
			return;
		}

		let [hour, minute, second] = parse_time_hms(get(STATE).clockwatch);
		STATE.set(
			"clockwatch",
			format_hms(recalculate_hms([hour, minute, second + 1])),
		);
	}, 1000);
}
