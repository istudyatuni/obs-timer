// allow to store different timers
export const LOCAL_STATE_KEY_PREFIX = "timer-data";
export const LOCAL_STATE_KEY_PREFIX_REGEX = new RegExp(
	"^" + LOCAL_STATE_KEY_PREFIX,
);
export const LOCAL_STATE_KEY = LOCAL_STATE_KEY_PREFIX + window.location.hash;
