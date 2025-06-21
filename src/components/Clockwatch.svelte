<script module>
  import { get } from "svelte/store";

  import PlayIcon from "~icons/tabler/player-play-filled";
  import PauseIcon from "~icons/tabler/player-pause-filled";
  import SettingsIcon from "~icons/tabler/settings";

  import {
    format_hms,
    split_time_hms,
    start_clockwatch,
  } from "../lib/clockwatch";
  import { CLOCK_POSITIONS, CLOCKWATCH_STATUSES } from "../lib/constants";
  import {
    HIDE_UI,
    MOUSE_IN_WINDOW,
    SETTINGS_HIDDEN,
    STATE,
  } from "../lib/stores";
</script>

<script>
  start_clockwatch();

  let hms = $derived(split_time_hms($STATE.clockwatch_seconds));

  let position_bottom = $derived(
    [CLOCK_POSITIONS.bottom_left, CLOCK_POSITIONS.bottom_right].includes(
      $STATE.clock_position,
    ),
  );
  let position_right = $derived(
    [CLOCK_POSITIONS.top_right, CLOCK_POSITIONS.bottom_right].includes(
      $STATE.clock_position,
    ),
  );

  function handle_play_pause() {
    let status = get(STATE).clockwatch_status;
    if (status === CLOCKWATCH_STATUSES.run) {
      status = CLOCKWATCH_STATUSES.pause;
    } else if (status === CLOCKWATCH_STATUSES.pause) {
      status = CLOCKWATCH_STATUSES.run;
    } else {
      throw "unhandled clockwatch_status";
    }
    STATE.set("clockwatch_status", status);
  }
  function handle_font_size_reset(e) {
    if (e.which === 2) {
      // middle mouse button pressed
      STATE.set("clockwatch_font_size_em", 1);
    }
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="clockwatch"
  class:position_bottom
  class:position_right
  style="
    margin:
      {$STATE.clockwatch_top_padding_em}em
      {$STATE.clockwatch_right_padding_em}em
      {$STATE.clockwatch_bottom_padding_em}em
      {$STATE.clockwatch_left_padding_em}em;
  ">
  <span
    style="font-size: {$STATE.clockwatch_font_size_em}em"
    onmousedown={handle_font_size_reset}>
    {#if $STATE.hide_empty_hour && hms[0] === 0}
      {format_hms(hms.slice(1))}
    {:else}
      {format_hms(hms)}
    {/if}
  </span>

  <div class="floating" class:hidden={!$MOUSE_IN_WINDOW}>
    <div class="center">
      <button class="icon" onclick={handle_play_pause}>
        {#if $STATE.clockwatch_status === CLOCKWATCH_STATUSES.run}
          <PauseIcon />
        {:else if $STATE.clockwatch_status === CLOCKWATCH_STATUSES.pause}
          <PlayIcon />
        {/if}
      </button>
      <button
        class="icon"
        onclick={() => ($SETTINGS_HIDDEN = !$SETTINGS_HIDDEN)}>
        <SettingsIcon />
      </button>
    </div>
  </div>
</div>

<style lang="scss">
  .clockwatch {
    position: absolute;
    font-family: "Fira Code", monospace;

    display: flex;
    flex-direction: column;
    &.position_bottom {
      flex-direction: column-reverse;
    }

    & > .floating {
      padding-top: 0.5em;
      padding-bottom: 0.5em;
      display: none;
    }
    &:hover > .floating {
      display: initial;
    }

    // fix for obs not resetting :hover state when closing "interact" window
    &:hover > .hidden {
      display: none;
    }
  }
  .position_right {
    right: 0;
  }
  .position_bottom {
    bottom: 0;
  }
  .center {
    margin: auto;
    width: fit-content;
  }
  button.icon {
    padding-top: 11px;
  }
</style>
