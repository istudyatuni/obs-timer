<script module>
  import { start_clockwatch } from "../lib/clockwatch";
  import { CLOCK_POSITION_NAMES, CLOCK_POSITIONS } from "../lib/constants";
  import { STATE } from "../lib/stores";
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
  function toggle_settings() {
    show_settings = !show_settings;
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
  onclick={toggle_settings}>
  {$STATE.clockwatch}
</div>

<div class:hidden={!show_settings} class="settings">
  <div>
    <button>Play/pause</button>
    <button>Reset</button>
  </div>
  <div class="pad">
    <!-- todo: fix when hours >= 24 -->
    <label>
      Set time:
      <input type="time" bind:value={$STATE.clockwatch} />
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
</div>

<style>
  .clockwatch {
    position: absolute;
    font-family: "Fira Code", monospace;
    padding: 1em;
    cursor: pointer;
  }
  .settings {
    padding: 1em;
    padding-top: 3em;
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
