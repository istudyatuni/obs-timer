import { get } from "svelte/store";

import { STATE } from "@/lib/stores";
import { CLOCKWATCH_STATUSES } from "@/lib/constants";

const MS_IN_S = 1000;

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
	return parts.map((p) => p.toString().padStart(2, "0")).join(":");
}

/**
 * @param {number[]} hms
 * @returns number[]
 */
export function recalculate_hms(hms) {
	let [h, m, s] = hms;

	let newMinutes = Math.floor(s / 60);
	m += newMinutes;
	s -= 60 * newMinutes;

	let newHours = Math.floor(m / 60);
	h += newHours;
	m -= 60 * newHours;

	return [h, m, s];
}

/** @param {number} seconds */
function store_hms(seconds) {
	STATE.set("clockwatch_seconds", seconds);
	STATE.set("clockwatch_last_time", new Date().getTime());
}

export function start_clockwatch() {
	let state = get(STATE);
	if (
		state.clockwatch_tick_when_closed &&
		state.clockwatch_status !== CLOCKWATCH_STATUSES.pause
	) {
		store_hms(
			state.clockwatch_seconds +
				(new Date().getTime() - state.clockwatch_last_time) / MS_IN_S,
		);
	}

	setInterval(() => {
		if (get(STATE).clockwatch_status === CLOCKWATCH_STATUSES.pause) {
			return;
		}

		store_hms(get(STATE).clockwatch_seconds + 1);
	}, MS_IN_S);
}
