<script module>
  import Clockwatch from "./components/Clockwatch.svelte";
  import Settings from "./components/Settings.svelte";

  import { migrate_storage } from "./lib/stores";
</script>

<script>
  migrate_storage();
</script>

<main class:obs={window.obsstudio !== undefined}>
  <Settings />
  <Clockwatch />
</main>

<style>
  .obs {
    color: white;
  }
</style>
