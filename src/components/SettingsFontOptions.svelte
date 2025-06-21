<script module>
  import { DEFAULT_STORAGE, STATE } from "../lib/stores";
</script>

<script>
  function set_default_text(e) {
    if (e.target.value.trim() == "") {
      STATE.set(
        "clockwatch_font_family",
        DEFAULT_STORAGE.clockwatch_font_family,
      );
    }
  }
</script>

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

<style lang="scss">
  input[type="text"] {
    field-sizing: content;
  }
</style>
