<script module>
  import Clockwatch from "./components/Clockwatch.svelte";
  import Settings from "./components/Settings.svelte";

  import { migrate_storage } from "./lib/stores";
</script>

<script>
  migrate_storage();
</script>

<Clockwatch />
<Settings />
