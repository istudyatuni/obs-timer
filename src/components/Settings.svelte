<script module>
  import GithubIcon from "~icons/tabler/brand-github";

  import SettingsCheckbox from "@/components/SettingsCheckbox.svelte";
  import SettingsClockwatchPosition from "@/components/SettingsClockwatchPosition.svelte";
  import SettingsFontOptions from "@/components/SettingsFontOptions.svelte";
  import SettingsTimeInput from "@/components/SettingsTimeInput.svelte";
  import SettingsTimerEntry from "@/components/SettingsTimerEntry.svelte";

  import { HIDE_UI, SETTINGS_HIDDEN, STATE, STORED_TIMERS } from "@/lib/stores";
  import { is_in_obs } from "@/lib/obs";
</script>

<div class="settings-wrapper">
  <div class:hidden={$SETTINGS_HIDDEN || $HIDE_UI} class="settings">
    <SettingsTimeInput />
    <SettingsCheckbox bind:checked={$STATE.clockwatch_tick_when_closed}
      >Tick when page is closed</SettingsCheckbox>
    <SettingsCheckbox bind:checked={$STATE.hide_empty_hour}
      >Hide empty hours</SettingsCheckbox>
    <SettingsCheckbox bind:checked={$STATE.auto_hide_settings}
      >Hide settings automatically</SettingsCheckbox>
    <SettingsCheckbox bind:checked={$STATE.hide_help}
      >Hide help</SettingsCheckbox>
    <details>
      <summary>Style settings</summary>
      <SettingsFontOptions />
      <SettingsClockwatchPosition />
    </details>
    <p class="current-timer">
      Current timer: {decodeURIComponent(window.location.hash || "default")}
    </p>
    <details class:hidden={$STORED_TIMERS.length === 1}>
      <summary>Saved timers</summary>
      <ul>
        {#each $STORED_TIMERS.toSorted() as timer_name (timer_name)}
          <SettingsTimerEntry name={timer_name} />
        {/each}
      </ul>
    </details>
    <div class:hidden={$STATE.hide_help}>
      <p>To create more timers add a hash to the URL: <code>#my-timer</code></p>
      <div class="footer" class:hidden={is_in_obs()}>
        <a href="https://github.com/istudyatuni/simple-timer"
          ><GithubIcon width="30" height="30" /></a>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .settings-wrapper {
    position: absolute;
    width: 100%;
    max-height: 100%;
    overflow-y: scroll;

    pointer-events: none;
    z-index: 1;

    &::-webkit-scrollbar {
      scrollbar-width: none;
    }
  }
  .settings {
    background-color: hsl(0, 0%, 90%);
    width: 20em;
    border-radius: 1em;
    padding: 1em;
    margin: 1em auto;

    pointer-events: initial;
  }
  details {
    margin-top: 8px;
  }
  summary::marker {
    color: hsl(0, 0%, 70%);
  }
  .current-timer {
    font-style: italic;
  }
  .footer {
    text-align: center;
  }
</style>
