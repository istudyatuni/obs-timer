<script module>
  import { start_clockwatch } from "../lib/clockwatch";
  import { CLOCK_POSITIONS } from "../lib/constants";
  import { SETTINGS_HIDDEN, STATE } from "../lib/stores";
</script>

<script>
  start_clockwatch();

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
    font-size: {$STATE.clockwatch_font_size_em}em;
    margin:
      {$STATE.clockwatch_top_padding_em}em
      {$STATE.clockwatch_right_padding_em}em
      {$STATE.clockwatch_bottom_padding_em}em
      {$STATE.clockwatch_left_padding_em}em;
  "
  onclick={() => ($SETTINGS_HIDDEN = !$SETTINGS_HIDDEN)}
  onmousedown={handle_font_size_reset}>
  {$STATE.clockwatch}
</div>

<style>
  .clockwatch {
    position: absolute;
    font-family: "Fira Code", monospace;
    cursor: pointer;
  }
  .position_right {
    right: 0;
  }
  .position_bottom {
    bottom: 0;
  }
</style>
