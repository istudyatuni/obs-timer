<script module>
  import { get } from "svelte/store";

  import { start_clockwatch } from "../lib/clockwatch";
  import {
    CLOCK_POSITION_NAMES,
    CLOCK_POSITIONS,
    CLOCKWATCH_STATUSES,
  } from "../lib/constants";
  import { DEFAULT_STORAGE, STATE } from "../lib/stores";
</script>

<script>
  start_clockwatch();

  let show_settings = $state(false);

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

  function handle_set_position(pos) {
    STATE.set("clock_position", pos);
  }
  function toggle_settings(e) {
    show_settings = !show_settings;
  }
  function handle_font_size_reset(e) {
    if (e.which === 2) {
      // middle mouse button pressed
      STATE.set("clockwatch_font_size_em", 1);
    }
  }
  function handle_reset() {
    STATE.set("clockwatch", DEFAULT_STORAGE.clockwatch);
  }
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
</script>

{#snippet position_button(position_key, _class = "")}
  <button
    onclick={() => handle_set_position(CLOCK_POSITIONS[position_key])}
    class={_class}>{CLOCK_POSITION_NAMES[position_key]}</button>
{/snippet}

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="clockwatch"
  class:position_bottom
  class:position_right
  style="font-size: {$STATE.clockwatch_font_size_em}em;"
  onclick={toggle_settings}
  onmousedown={handle_font_size_reset}>
  {$STATE.clockwatch}
</div>

<div class="settings-wrapper">
  <div class:hidden={!show_settings} class="settings">
    <div>
      <button onclick={handle_play_pause}>
        {#if $STATE.clockwatch_status === CLOCKWATCH_STATUSES.run}
          Pause
        {:else if $STATE.clockwatch_status === CLOCKWATCH_STATUSES.pause}
          Play
        {/if}
      </button>
      <button onclick={handle_reset}>Reset</button>
    </div>
    <div class="pad">
      <!-- todo: fix when hours >= 24 -->
      <label>
        Set time:
        <input type="time" bind:value={$STATE.clockwatch} />
      </label>
    </div>
    <div class="pad">
      <label>
        Font size:
        <input
          type="number"
          bind:value={$STATE.clockwatch_font_size_em}
          min="1"
          max="20"
          step="0.1" />
      </label>
    </div>
    <div>
      <p>Position:</p>
      {@render position_button("top_left")}
      {@render position_button("top_right")}
      <br />
      {@render position_button("bottom_left", "pad")}
      {@render position_button("bottom_right")}
    </div>
    {#if $STATE.clockwatch_font_size_em !== 1}
      <p>Click with middle mouse button on clockwatch to reset font size</p>
    {/if}
  </div>
</div>

<style>
  .clockwatch {
    position: absolute;
    font-family: "Fira Code", monospace;
    cursor: pointer;
    margin: 1em;
  }
  .settings-wrapper {
    position: absolute;
    width: 100%;
  }
  .settings {
    background-color: rgba(1, 1, 1, 0.1);
    width: 15em;
    border-radius: 1em;
    padding: 1em;
    margin: auto;
    margin-top: 1em;
  }
  .position_right {
    right: 0;
  }
  .position_bottom {
    bottom: 0;
  }
  .pad {
    margin-top: 5px;
  }
</style>
