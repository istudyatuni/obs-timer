import { get, writable } from "svelte/store";

import { localStore } from "svelte-storages";

import { CLOCK_POSITIONS, CLOCKWATCH_STATUSES } from "./constants";

export const DEFAULT_STORAGE = {
	version: 2,
	clockwatch: "00:00:00",
	clockwatch_status: CLOCKWATCH_STATUSES.run,
	clock_position: CLOCK_POSITIONS.top_left,

	// sizes and paddings
	clockwatch_font_size_em: 1,
	clockwatch_left_padding_em: 1,
	clockwatch_right_padding_em: 1,
	clockwatch_top_padding_em: 1,
	clockwatch_bottom_padding_em: 1,
};

export const STATE = localStore("timer-data", DEFAULT_STORAGE);

export const SETTINGS_HIDDEN = writable(true);

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

	migrate(STATE, DEFAULT_STORAGE);
}
