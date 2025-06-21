<script module>
  import { LOCAL_STATE_KEY_PREFIX } from "../lib/hashes";
  import { LOCAL_STORAGE } from "../lib/stores";
</script>

<script>
  let { name } = $props();

  let wait_confirm = $state(false);

  function handle_remove_timer(name) {
    if (!wait_confirm) {
      wait_confirm = true;
      return;
    }

    LOCAL_STORAGE.delete(LOCAL_STATE_KEY_PREFIX + name);
  }
  function cancel_remove_timer() {
    wait_confirm = false;
  }
</script>

<li class="pad-top">
  {#if name !== ""}
    {name}
  {:else}
    <i>default</i>
  {/if}
  {#if name !== window.location.hash}
    <button
      class:danger={wait_confirm}
      onclick={() => handle_remove_timer(name)}>
      {#if wait_confirm}
        confirm?
      {:else}
        remove
      {/if}
    </button>
    {#if wait_confirm}
      <button onclick={cancel_remove_timer}>cancel</button>
    {/if}
  {/if}
</li>
