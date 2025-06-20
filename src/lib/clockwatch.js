import { get } from "svelte/store";

import { STATE } from "./stores";
import { CLOCKWATCH_STATUSES } from "./constants";

const MS_IN_S = 1000;

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

function store_hms(hms) {
	STATE.set("clockwatch", format_hms(hms));
	STATE.set("clockwatch_last_time", new Date().getTime());
}

export function start_clockwatch() {
	let state = get(STATE);
	if (
		state.clockwatch_tick_when_closed &&
		state.clockwatch_status !== CLOCKWATCH_STATUSES.pause
	) {
		let now_timestamp = new Date().getTime() / MS_IN_S;
		let [hour, minute, second] = parse_time_hms(state.clockwatch);
		second += now_timestamp - state.clockwatch_last_time / MS_IN_S;
		store_hms(recalculate_hms([hour, minute, second]));
	}

	setInterval(() => {
		if (get(STATE).clockwatch_status === CLOCKWATCH_STATUSES.pause) {
			return;
		}

		let [hour, minute, second] = parse_time_hms(get(STATE).clockwatch);
		store_hms(recalculate_hms([hour, minute, second + 1]));
	}, MS_IN_S);
}
