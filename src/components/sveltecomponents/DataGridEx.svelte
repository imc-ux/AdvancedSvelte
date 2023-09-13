<!--
/**
 * Summary: DataGrid
 * Created: 2023/03/14
 * Author1: lixiaozheng
 * description:
 * rowData中增加字段用来判断renderer显示
 * linkCodes：string[]，值是cell的key组成的数组，显示Link
 * labelCodes：string[]，值是cell的key组成的数组，显示Label
 */
-->
<script lang="ts">
  import { DataTable } from "carbon-components-svelte";
  import { onMount } from "svelte";
  import { Label, Link, IconButton, ProgressBar } from "@/components/renderers";
  import { Pagination } from "@/components/sveltecomponents";

  export let columnsDefs: any[] | null = null;
  export let rowData: any[] | null = null;
  export let onLinkClick = (e, i?) => {};
  export let onBtnClick = (row: any, cell: any) => {};
  export let currentPage: number = 1;
  export let pageCount: number = 10;
  export let total: number = 0;
  export let onPageChange = (e: CustomEvent) => {};
  export let display: string = "flex";
  export let batchSelection = false;
  export let checkClass = "";
  export let id = "data-table-id";
  export let pageShowFlag: boolean = true;
  export let selectedRowIds: any[] = [];
  export let maxHeight: string = "700px";
  export let className = "dataTable dataTable-width tr-height";

  onMount(() => {
    // 如果存在选择框，可以自定义选择框的样式
    const checkAll = document.getElementsByClassName(
      "bx--table-column-checkbox"
    )[0];
    checkAll?.classList.add(checkClass);
  });
</script>

<DataTable
  style="max-height:{maxHeight}"
  {id}
  bind:selectedRowIds
  size="medium"
  {batchSelection}
  headers={columnsDefs}
  rows={rowData || []}
  class={className}>
  <svelte:fragment slot="cell" let:row let:cell>
    {#if row.linkCodes?.includes(cell.key)}
      {#if row.leftCodes?.includes(cell.key)}
        <Link
          {cell}
          on:click={() => onLinkClick(row, cell)}
          class="link-color left-justify" />
      {:else if row.rightCodes?.includes(cell.key)}
        <Link
          {cell}
          on:click={() => onLinkClick(row, cell)}
          class="link-color right-justify" />
      {:else if row.centerCodes?.includes(cell.key)}
        <Link
          {cell}
          on:click={() => onLinkClick(row, cell)}
          class="link-color center-justify" />
      {:else}
        <Link
          {cell}
          on:click={() => onLinkClick(row, cell)}
          class="link-color" />
      {/if}
    {:else if row.labelCodes?.includes(cell.key)}
      {#if row.leftCodes?.includes(cell.key)}
        <Label {cell} title={cell.value} class="left-text" />
      {:else if row.rightCodes?.includes(cell.key)}
        <Label {cell} title={cell.value} class="right-text" />
      {:else if row.centerCodes?.includes(cell.key)}
        <Label {cell} title={cell.value} class="center-text" />
      {:else}
        <Label {cell} title={cell.value} />
      {/if}
    {:else if row.btnCodes?.findIndex((ele) => ele.code === cell.key) > -1 && cell.value === row.isDetail}
      <IconButton
        currentIcon={row.btnCodes[
          row.btnCodes.findIndex((ele) => ele.code === cell.key)
        ].icon}
        on:click={() => onBtnClick(row, cell)} />
    {:else if row.btnCodes?.findIndex((ele) => ele.code === cell.key) > -1 && cell.value !== row.isDetail}
      {""}
    {:else if row.progressCode?.includes(cell.key)}
      <ProgressBar value={cell.value} />
    {:else if row.leftCodes?.includes(cell.key)}
      <Label {cell} class="left-text" />
    {:else if row.rightCodes?.includes(cell.key)}
      <Label {cell} class="right-text" />
    {:else if row.centerCodes?.includes(cell.key)}
      <Label {cell} class="center-text" />
    {:else}
      <Label {cell} />
    {/if}
  </svelte:fragment>
</DataTable>
{#if pageShowFlag}
  {#if rowData?.length > 0}
    <Pagination {currentPage} {pageCount} {total} {onPageChange} {display} />
  {:else if rowData?.length === 0}
    <div class="not-find-rowdata-div">
      <p class="not-find-rowdata">NoData</p>
    </div>
  {/if}
{/if}

<style>
  .not-find-rowdata-div {
    margin-left: 0px;
    border: 1px solid lightgray;
  }

  .not-find-rowdata {
    color: lightgrey;
    width: 100%;
    overflow: auto;
    padding-right: 0px;
    text-align: center;
    height: 200px;
    line-height: 200px;
  }

  :global(.bx--data-table td, .bx--data-table tbody th) {
    padding-right: 5px;
    padding-left: 5px;
  }

  :global(.left-justify) {
    display: flex;
    justify-content: start;
  }

  :global(.right-justify) {
    display: flex;
    justify-content: end;
  }

  :global(.center-justify) {
    display: flex;
    justify-content: center;
  }

  :global(.center-text) {
    text-align: center;
  }

  :global(.left-text) {
    text-align: left;
  }

  :global(.right-text) {
    text-align: right;
  }
</style>
