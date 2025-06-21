import { derived, get, writable } from "svelte/store";

import { localStore } from "svelte-storages";

import { join_time_hms } from "./clockwatch";
import { CLOCK_POSITIONS, CLOCKWATCH_STATUSES } from "./constants";
import {
	LOCAL_STATE_KEY,
	LOCAL_STATE_KEY_PREFIX,
	LOCAL_STATE_KEY_PREFIX_REGEX,
} from "./hashes";

export const DEFAULT_STORAGE = {
	version: 7,

	// clockwatch
	clockwatch_seconds: 0,
	clockwatch_status: CLOCKWATCH_STATUSES.run,
	clock_position: CLOCK_POSITIONS.top_left,
	clockwatch_last_time: 0,
	clockwatch_tick_when_closed: false,
	hide_empty_hour: false,

	// sizes and paddings
	clockwatch_font_size_em: 1,
	clockwatch_left_padding_em: 1,
	clockwatch_right_padding_em: 1,
	clockwatch_top_padding_em: 1,
	clockwatch_bottom_padding_em: 1,

	// ui
	auto_hide_settings: true,
	hide_help: false,

	// deleted
	// clockwatch
};

export const PADDING_STORAGE_KEYS = Object.keys(DEFAULT_STORAGE).filter((k) =>
	k.endsWith("padding_em"),
);

export const STATE = localStore(LOCAL_STATE_KEY, DEFAULT_STORAGE);
export const LOCAL_STORAGE = localStorageStore();

export const SETTINGS_HIDDEN = writable(true);
export const MOUSE_IN_WINDOW = writable(true);
export const HIDE_UI = derived(
	[MOUSE_IN_WINDOW, STATE],
	([$mouse_in_window, $state]) =>
		!$mouse_in_window && $state.auto_hide_settings,
);

export const STORED_TIMERS = derived(LOCAL_STORAGE, ($st) =>
	Object.keys($st)
		.filter((k) => k.startsWith(LOCAL_STATE_KEY_PREFIX))
		.map((k) => k.replace(LOCAL_STATE_KEY_PREFIX_REGEX, "")),
);

export function migrate_storage() {
	function migrate(store, default_kv) {
		let s = get(store);
		if (s.version < default_kv.version) {
			let old_keys = new Set(Object.keys(s));
			let new_keys = new Set(Object.keys(default_kv));

			old_keys.difference(new_keys).forEach((k) => store.delete(k));
			new_keys
				.difference(old_keys)
				.forEach((k) => store.set(k, default_kv[k]));

			store.set("version", default_kv.version);
		}
	}

	migrate_clockwatch_to_seconds();

	migrate(STATE, DEFAULT_STORAGE);
}

function migrate_clockwatch_to_seconds() {
	let state = get(STATE);
	if (
		state.version < 4 &&
		DEFAULT_STORAGE.version >= 4 &&
		state.clockwatch_seconds === undefined &&
		state.clockwatch !== "00:00:00"
	) {
		STATE.set(
			"clockwatch_seconds",
			join_time_hms(parse_time_hms(get(STATE).clockwatch)),
		);
	}
}

// only used for migration
function parse_time_hms(time) {
	return time.split(":").map((e) => parseInt(e));
}

function localStorageStore() {
	const st = window.localStorage;
	const { subscribe, update } = writable(st);

	return {
		subscribe,
		delete: (key) =>
			update((data) => {
				delete data[key];
				st.removeItem(key);
				return data;
			}),
	};
}
