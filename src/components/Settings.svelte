<script module>
  import { get } from "svelte/store";

  import {
    CLOCK_POSITION_NAMES,
    CLOCK_POSITIONS,
    CLOCKWATCH_STATUSES,
  } from "../lib/constants";
  import {
    DEFAULT_STORAGE,
    MOUSE_IN_WINDOW,
    PADDING_STORAGE_KEYS,
    SETTINGS_HIDDEN,
    STATE,
  } from "../lib/stores";
  import {
    format_hms,
    parse_time_hms,
    recalculate_hms,
  } from "../lib/clockwatch";
</script>

<script>
  let hms = $derived(parse_time_hms($STATE.clockwatch));

  function handle_set_position(pos) {
    STATE.set("clock_position", pos);
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
  function handle_reset_paddings() {
    for (let key of PADDING_STORAGE_KEYS) {
      STATE.set(key, 1);
    }
  }

  function make_handler_onchange_hms(component) {
    return (e) => {
      let index = 0;
      let value = parseInt(e.target.value);
      if (component === "hour") {
        index = 0;
      } else if (component === "minute") {
        index = 1;
      } else if (component === "second") {
        index = 2;
      }
      hms[index] = value;
      STATE.set("clockwatch", format_hms(recalculate_hms(hms)));
    };
  }
</script>

{#snippet position_button(position_key, classes = "")}
  <button
    onclick={() => handle_set_position(CLOCK_POSITIONS[position_key])}
    class={classes}>{CLOCK_POSITION_NAMES[position_key]}</button>
{/snippet}

{#snippet padding_input(key)}
  <!-- extra div for grid -->
  <div></div>
  <div class="pad">
    <input type="number" bind:value={$STATE[key]} min="0" max="20" step="0.1" />
  </div>
{/snippet}

<div class="settings-wrapper">
  <div class:hidden={$SETTINGS_HIDDEN || !$MOUSE_IN_WINDOW} class="settings">
    <div class="center">
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
      <label class="pointer">
        <input
          type="checkbox"
          bind:checked={$STATE.clockwatch_tick_when_closed} />
        Tick when page is closed
      </label>
    </div>
    <div class="pad">
      <label class="time-input">
        Set time:
        <input
          type="number"
          value={hms[0]}
          class="hour"
          oninput={make_handler_onchange_hms("hour")} />
        <input
          type="number"
          value={hms[1]}
          oninput={make_handler_onchange_hms("minute")} />
        <input
          type="number"
          value={hms[2]}
          oninput={make_handler_onchange_hms("second")} />
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
    <div>
      <p>Indent:</p>
      <div class="indent-input-container">
        {@render padding_input("clockwatch_top_padding_em")}
        {@render padding_input("clockwatch_left_padding_em")}
        {@render padding_input("clockwatch_right_padding_em")}
        {@render padding_input("clockwatch_bottom_padding_em")}
      </div>
      <button class="pad" onclick={handle_reset_paddings}>Reset</button>
    </div>
    <p class="current-timer">
      Current timer:
      {#if window.location.hash !== ""}
        {window.location.hash}
      {:else}
        default
      {/if}
    </p>
    {#if $STATE.clockwatch_font_size_em !== 1}
      <p>Click with middle mouse button on clockwatch to reset font size</p>
    {/if}
  </div>
</div>

<style>
  .time-input > input.hour {
    width: 4em;
  }
  .time-input > input {
    width: 3em;
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
  .indent-input-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
  .indent-input-container > div {
    width: auto;
  }
  .current-timer {
    font-style: italic;
  }
  .center {
    margin: auto;
    width: fit-content;
  }
  .pad {
    margin-top: 5px;
  }
</style>
