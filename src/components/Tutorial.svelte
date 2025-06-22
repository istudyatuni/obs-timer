<script module>
  import { GLOBAL_STATE, set_tutorial_done } from "@/lib/stores";
</script>

{#if !$GLOBAL_STATE.tutorial_done}
  <div class="wrapper">
    <div>
      <p>Hover timer to open settings</p>
      <div class="center">
        <div>
          <button onclick={set_tutorial_done}>OK</button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  @use "@/colors.scss";

  .wrapper {
    width: 100%;
    height: 100%;

    & > div {
      width: fit-content;
      margin: auto;
      margin-top: 45vh;
    }
  }
  .center {
    width: 100%;

    & > div {
      width: fit-content;
      margin: auto;
    }
  }
  :global(.obs) p {
    @extend %obs-color;
  }
</style>
