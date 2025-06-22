<script module>
  import { LOCAL_STATE_KEY_PREFIX } from "@/lib/hashes";
  import { LOCAL_STORAGE } from "@/lib/stores";
  import { decode_timer_name } from "@/lib/timer";
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
  {decode_timer_name(name)}
  {#if name !== window.location.hash}
    {#if wait_confirm}
      <button onclick={cancel_remove_timer}>cancel</button>
    {/if}
    <button
      class:danger-bg={wait_confirm}
      onclick={() => handle_remove_timer(name)}>
      {#if wait_confirm}
        confirm?
      {:else}
        remove
      {/if}
    </button>
  {/if}
</li>
