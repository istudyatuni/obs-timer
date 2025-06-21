<script module>
  import { CLOCK_POSITION_NAMES, CLOCK_POSITIONS } from "../lib/constants";
  import { PADDING_STORAGE_KEYS, STATE } from "../lib/stores";
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
  <button class="pad-top" onclick={handle_reset_paddings}>Reset indent</button>
</div>

<style lang="scss">
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
</style>
