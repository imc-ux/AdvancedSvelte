<script lang="ts">
  import ProgressBar from '@/components/sveltecomponents/ProgressBar.svelte';
  export let params;
  export let value: string = params.value;
</script>

<ProgressBar {value} />
