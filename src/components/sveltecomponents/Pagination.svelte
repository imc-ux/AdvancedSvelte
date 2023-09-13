<script lang="ts">
  import { PaginationNav } from 'carbon-components-svelte';
  import { Text } from '@/components/sveltecomponents';

  export let currentPage: number;
  export let pageCount: number;
  export let total: number;
  export let onPageChange = (e: CustomEvent) => {};
  export let display: string = 'flex';
</script>

<div class=" main-bottom" style="display:{display}">
  <div>
    <Text class="page-text">Total {total} Item(s)</Text>
  </div>
  <PaginationNav page={currentPage} total={pageCount} on:change={onPageChange} />
</div>

<style>
  .main-bottom {
    margin-top: 15px;
    min-width: 1100px;

    justify-content: center;
    align-items: center;
  }

  :global(.page-text) {
    margin-right: 15px;
    height: 30px;
    line-height: 30px;
  }

  :global(.bx--btn.bx--btn--icon-only.bx--tooltip__trigger:focus) {
    border-color: #08adaa;
  }
</style>
