<script module>
  import SettingsCheckbox from "./SettingsCheckbox.svelte";
  import SettingsTimerEntry from "./SettingsTimerEntry.svelte";

  import { CLOCK_POSITION_NAMES, CLOCK_POSITIONS } from "../lib/constants";
  import {
    DEFAULT_STORAGE,
    HIDE_UI,
    MOUSE_IN_WINDOW,
    PADDING_STORAGE_KEYS,
    SETTINGS_HIDDEN,
    STATE,
    STORED_TIMERS,
  } from "../lib/stores";
  import {
    split_time_hms,
    recalculate_hms,
    join_time_hms,
  } from "../lib/clockwatch";

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

  function handle_set_position(pos) {
    STATE.set("clock_position", pos);
  }
  function handle_reset_time() {
    STATE.set("clockwatch_seconds", DEFAULT_STORAGE.clockwatch_seconds);
  }
  function handle_reset_paddings() {
    for (let key of PADDING_STORAGE_KEYS) {
      STATE.set(key, 1);
    }
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

{#snippet position_button(/** @type {string} */ position_key)}
  <button
    onclick={() => handle_set_position(CLOCK_POSITIONS[position_key])}
    class="pad-top">{CLOCK_POSITION_NAMES[position_key]}</button>
{/snippet}

{#snippet padding_input(/** @type {string} */ key)}
  <!-- extra div for grid -->
  <div></div>
  <div class="pad-top">
    <input
      type="number"
      bind:value={$STATE[key]}
      onwheel={() => {}}
      min="-100"
      max="100"
      step="0.1" />
  </div>
{/snippet}

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

<div class="settings-wrapper">
  <div class:hidden={$SETTINGS_HIDDEN || $HIDE_UI} class="settings">
    <div class="pad-top">
      <label class="time-input">
        Set time:
        {@render time_input(HMS.hour, hms[0])}
        {@render time_input(HMS.minute, hms[1])}
        {@render time_input(HMS.second, hms[2])}
      </label>
      <button class="pad-top" onclick={handle_reset_time}>Reset time</button>
    </div>
    <div class="pad-top">
      <label>
        Font size:
        <input
          type="number"
          bind:value={$STATE.clockwatch_font_size_em}
          onwheel={() => {}}
          min="1"
          max="20"
          step="0.1" />
      </label>
    </div>
    <SettingsCheckbox bind:checked={$STATE.clockwatch_tick_when_closed}
      >Tick when page is closed</SettingsCheckbox>
    <SettingsCheckbox bind:checked={$STATE.hide_empty_hour}
      >Hide empty hours</SettingsCheckbox>
    <SettingsCheckbox bind:checked={$STATE.auto_hide_settings}
      >Hide settings automatically</SettingsCheckbox>
    <div>
      <p class="unpad">Position:</p>
      {@render position_button("top_left")}
      {@render position_button("top_right")}
      <br />
      {@render position_button("bottom_left")}
      {@render position_button("bottom_right")}
    </div>
    <div>
      <p class="unpad">Indent:</p>
      <div class="indent-input-container">
        {@render padding_input("clockwatch_top_padding_em")}
        {@render padding_input("clockwatch_left_padding_em")}
        {@render padding_input("clockwatch_right_padding_em")}
        {@render padding_input("clockwatch_bottom_padding_em")}
      </div>
      <button class="pad-top" onclick={handle_reset_paddings}>Reset</button>
    </div>
    <p class="current-timer">
      Current timer:
      {#if window.location.hash !== ""}
        {window.location.hash}
      {:else}
        default
      {/if}
    </p>
    <details class="details" class:hidden={$STORED_TIMERS.length === 1}>
      <summary>Saved timers</summary>
      <ul>
        {#each $STORED_TIMERS as timer_name (timer_name)}
          <SettingsTimerEntry name={timer_name} />
        {/each}
      </ul>
    </details>
    <p>To create more timers add a hash to the URL: <code>#my-timer</code></p>
    {#if $STATE.clockwatch_font_size_em !== 1}
      <p>Click with middle mouse button on clockwatch to reset font size</p>
    {/if}
  </div>
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
  .settings-wrapper {
    position: absolute;
    width: 100%;
    max-height: 100%;
    overflow-y: scroll;

    &::-webkit-scrollbar {
      scrollbar-width: none;
    }
  }
  .settings {
    background-color: rgba(1, 1, 1, 0.1);
    width: 20em;
    border-radius: 1em;
    padding: 1em;
    margin: 1em auto;
  }
  p.unpad {
    margin-bottom: -0.3em;
  }
  .indent-input-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);

    & > div {
      width: auto;
    }
    & input {
      min-width: 3em;
      // using max-width because field-sizing is not available everywhere
      max-width: 3em;
      field-sizing: content;
    }
  }
  .current-timer {
    font-style: italic;
  }
</style>
