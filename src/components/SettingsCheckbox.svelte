<script>
  let { children, checked = $bindable() } = $props();
</script>

<div class="pad-top">
  <label class="pointer">
    <input type="checkbox" bind:checked />
    {@render children()}
  </label>
</div>
