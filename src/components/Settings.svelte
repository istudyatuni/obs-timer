<script module>
  import { get } from "svelte/store";

  import {
    CLOCK_POSITION_NAMES,
    CLOCK_POSITIONS,
    CLOCKWATCH_STATUSES,
  } from "../lib/constants";
  import { DEFAULT_STORAGE, SETTINGS_HIDDEN, STATE } from "../lib/stores";
</script>

<script>
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
</script>

{#snippet position_button(position_key, classes = "")}
  <button
    onclick={() => handle_set_position(CLOCK_POSITIONS[position_key])}
    class={classes}>{CLOCK_POSITION_NAMES[position_key]}</button>
{/snippet}

{#snippet padding_input(name, key)}
  <div class="pad">
    <label>
      {name}:
      <input
        type="number"
        bind:value={$STATE[key]}
        min="0"
        max="20"
        step="0.1" />
    </label>
  </div>
{/snippet}

<div class="settings-wrapper">
  <div class:hidden={$SETTINGS_HIDDEN} class="settings">
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
    <div>
      <p>Padding:</p>
      {@render padding_input("Top", "clockwatch_top_padding_em")}
      {@render padding_input("Bottom", "clockwatch_bottom_padding_em")}
      {@render padding_input("Left", "clockwatch_left_padding_em")}
      {@render padding_input("Right", "clockwatch_right_padding_em")}
    </div>
    {#if $STATE.clockwatch_font_size_em !== 1}
      <p>Click with middle mouse button on clockwatch to reset font size</p>
    {/if}
  </div>
</div>

<style>
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
  .pad {
    margin-top: 5px;
  }
</style>
