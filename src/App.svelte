<script module>
  import Clockwatch from "@/components/Clockwatch.svelte";
  import Settings from "@/components/Settings.svelte";

  import { is_in_obs } from "@/lib/obs";
  import { migrate_storage, MOUSE_IN_WINDOW } from "@/lib/stores";
</script>

<script>
  migrate_storage();

  const leave = () => MOUSE_IN_WINDOW.set(false);
  const enter = () => MOUSE_IN_WINDOW.set(true);
</script>

<svelte:window
  onblur={leave}
  onfocus={enter}
  on:hashchange={() => window.location.reload()} />
<svelte:body onmouseleave={leave} onmouseenter={enter} />

<main class:obs={is_in_obs()}>
  <Settings />
  <Clockwatch />
</main>

<style>
  .obs {
    color: white;
  }
</style>
