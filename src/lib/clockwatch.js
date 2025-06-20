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
 * @param {number} total_seconds
 * @returns number[]
 */
export function split_time_hms(total_seconds) {
	let s = Math.floor(total_seconds % 60);
	let m = Math.floor(((total_seconds - s) / 60) % 60);
	let h = Math.floor((total_seconds - s - m * 60) / 60 / 60);
	return [h, m, s];
}

/**
 * @param {number[]} hms
 * @returns Number.
 */
export function join_time_hms([h, m, s]) {
	return h * 60 * 60 + m * 60 + s;
}

/**
 * @param {number[]} parts
 * @returns String.
 */
export function format_hms(parts) {
	return parts.map(format_hms_part).join(":");
}

export function format_hms_part(part) {
	return part.toString().padStart(2, "0");
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
	STATE.set("clockwatch_seconds", join_time_hms(hms));
	STATE.set("clockwatch_last_time", new Date().getTime());
}

export function start_clockwatch() {
	let state = get(STATE);
	if (
		state.clockwatch_tick_when_closed &&
		state.clockwatch_status !== CLOCKWATCH_STATUSES.pause
	) {
		let now_timestamp = new Date().getTime() / MS_IN_S;
		let [hour, minute, second] = split_time_hms(state.clockwatch_seconds);
		second += now_timestamp - state.clockwatch_last_time / MS_IN_S;
		store_hms(recalculate_hms([hour, minute, second]));
	}

	setInterval(() => {
		if (get(STATE).clockwatch_status === CLOCKWATCH_STATUSES.pause) {
			return;
		}

		let [hour, minute, second] = split_time_hms(
			get(STATE).clockwatch_seconds,
		);
		store_hms(recalculate_hms([hour, minute, second + 1]));
	}, MS_IN_S);
}
