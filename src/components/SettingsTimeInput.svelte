<script module>
  import { DEFAULT_STORAGE, STATE } from "@/lib/stores";
  import {
    split_time_hms,
    recalculate_hms,
    join_time_hms,
  } from "@/lib/clockwatch";

  const HMS = {
    hour: "hour",
    minute: "minute",
    second: "second",
  };
  const HMS_INDEX = {
    hour: 0,
    minute: 1,
    second: 2,
  };
</script>

<script>
  let hms = $derived(split_time_hms($STATE.clockwatch_seconds));

  function handle_reset_time() {
    STATE.set("clockwatch_seconds", DEFAULT_STORAGE.clockwatch_seconds);
  }

  /** @param {string} component */
  function make_handler_onchange_hms(component) {
    return (/** @type {InputEvent & { target: HTMLInputElement }} */ e) => {
      hms[HMS_INDEX[component]] = parseInt(e.target.value);
      STATE.set("clockwatch_seconds", join_time_hms(recalculate_hms(hms)));
    };
  }

  function should_set_min_hms_input(component) {
    if (component === HMS.hour) {
      return true;
    } else if (component === HMS.minute) {
      return hms[0] === 0;
    } else if (component === HMS.second) {
      return hms[0] === 0 && hms[1] === 0;
    }
  }
</script>

{#snippet time_input(
  /** @type {string} */ component,
  /** @type {number} */ value,
)}
  <input
    type="number"
    class:hour={component === HMS.hour}
    {value}
    min={should_set_min_hms_input(component) ? "0" : null}
    onwheel={() => {
      /* it seems that svelte delete default event handler, so return something to make scroll-to-change work */
    }}
    oninput={make_handler_onchange_hms(component)} />
{/snippet}

<div class="pad-top">
  <label class="time-input">
    Set time:
    {@render time_input(HMS.hour, hms[0])}
    {@render time_input(HMS.minute, hms[1])}
    {@render time_input(HMS.second, hms[2])}
  </label>
  <button class="pad-top" onclick={handle_reset_time}>Reset time</button>
</div>

<style lang="scss">
  .time-input {
    & > input.hour {
      width: 4em;
    }
    & > input {
      width: 3em;
    }
  }
</style>
