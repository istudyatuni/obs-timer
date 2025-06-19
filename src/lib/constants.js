export const CLOCKWATCH_STATUSES = {
	run: "run",
	pause: "pause",
};

export const CLOCK_POSITIONS = {
	top_left: "top-left",
	top_right: "top-right",
	bottom_left: "bottom-left",
	bottom_right: "bottom-right",
};

export const CLOCK_POSITION_NAMES = Object.fromEntries(
	Object.keys(CLOCK_POSITIONS).map((k) => [k, k.replace("_", " ")]),
);
