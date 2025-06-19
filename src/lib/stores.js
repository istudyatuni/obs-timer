import { localStore } from "svelte-storages";

import { CLOCK_POSITIONS, CLOCKWATCH_STATUSES } from "./constants";

export const DEFAULT_STORAGE = {
	clockwatch: "00:00:00",
	clockwatch_status: CLOCKWATCH_STATUSES.run,
	clock_position: CLOCK_POSITIONS.top_left,
};

export const STATE = localStore("timer-data", DEFAULT_STORAGE);
