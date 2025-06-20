<script module>
  import Clockwatch from "./components/Clockwatch.svelte";
  import Settings from "./components/Settings.svelte";

  import { migrate_storage, MOUSE_IN_WINDOW } from "./lib/stores";
</script>

<script>
  migrate_storage();

  const leave = () => MOUSE_IN_WINDOW.set(false);
  const enter = () => MOUSE_IN_WINDOW.set(true);
</script>

<svelte:window onblur={leave} />
<svelte:body onmouseleave={leave} onmouseenter={enter} />

<main class:obs={window.obsstudio !== undefined}>
  <Settings />
  <Clockwatch />
</main>

<style>
  .obs {
    color: white;
  }
</style>
