<script module>
  import GithubIcon from "~icons/tabler/brand-github";

  import SettingsCheckbox from "./SettingsCheckbox.svelte";
  import SettingsTimeInput from "./SettingsTimeInput.svelte";
  import SettingsTimerEntry from "./SettingsTimerEntry.svelte";

  import { CLOCK_POSITION_NAMES, CLOCK_POSITIONS } from "../lib/constants";
  import {
    DEFAULT_STORAGE,
    HIDE_UI,
    PADDING_STORAGE_KEYS,
    SETTINGS_HIDDEN,
    STATE,
    STORED_TIMERS,
  } from "../lib/stores";
</script>

<script>
  function handle_set_position(pos) {
    STATE.set("clock_position", pos);
  }
  function handle_reset_paddings() {
    for (let key of PADDING_STORAGE_KEYS) {
      STATE.set(key, 1);
    }
  }
  function set_default_text(e) {
    if (e.target.value.trim() == "") {
      STATE.set(
        "clockwatch_font_family",
        DEFAULT_STORAGE.clockwatch_font_family,
      );
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

<div class="settings-wrapper">
  <div class:hidden={$SETTINGS_HIDDEN || $HIDE_UI} class="settings">
    <SettingsTimeInput />
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
    <div class="pad-top">
      <label>
        Font family:
        <input
          type="text"
          bind:value={$STATE.clockwatch_font_family}
          onblur={set_default_text} />
      </label>
    </div>
    <SettingsCheckbox bind:checked={$STATE.clockwatch_tick_when_closed}
      >Tick when page is closed</SettingsCheckbox>
    <SettingsCheckbox bind:checked={$STATE.hide_empty_hour}
      >Hide empty hours</SettingsCheckbox>
    <SettingsCheckbox bind:checked={$STATE.auto_hide_settings}
      >Hide settings automatically</SettingsCheckbox>
    <SettingsCheckbox bind:checked={$STATE.hide_help}
      >Hide help</SettingsCheckbox>
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
      <button class="pad-top" onclick={handle_reset_paddings}
        >Reset indent</button>
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
        {#each $STORED_TIMERS.toSorted() as timer_name (timer_name)}
          <SettingsTimerEntry name={timer_name} />
        {/each}
      </ul>
    </details>
    <div class:hidden={$STATE.hide_help}>
      <p>To create more timers add a hash to the URL: <code>#my-timer</code></p>
      <div class="footer">
        <a href="https://github.com/istudyatuni/simple-timer"
          ><GithubIcon width="30" height="30" /></a>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .settings-wrapper {
    position: absolute;
    width: 100%;
    max-height: 100%;
    overflow-y: scroll;

    pointer-events: none;
    z-index: 1;

    &::-webkit-scrollbar {
      scrollbar-width: none;
    }
  }
  .settings {
    background-color: hsl(0, 0, 90);
    width: 20em;
    border-radius: 1em;
    padding: 1em;
    margin: 1em auto;

    pointer-events: initial;
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
  .footer {
    text-align: center;
  }
  input[type="text"] {
    field-sizing: content;
  }
</style>
