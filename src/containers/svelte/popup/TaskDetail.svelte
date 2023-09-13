<!-- Summary任务管理详细页面 -->
<script lang="ts">
  import { Text, AdvancedSelect } from '@/components/sveltecomponents';
  import taskDetailStore from '@/store/TaskDetailStore';
  import { onDestroy, onMount } from 'svelte';
  import { autorun } from 'mobx';
  import { taskModifyTypeInfo, taskDetailInfo } from '@/vo/taskManager/index';
  import CustomAlert, { AlertIcon } from '@/components/CustomAlert';
  import taskDetailColumns from '@/components/columns/TaskDetailColums';
  // import { DataGridEx } from '@/components/sveltecomponents';
  import DataGrid from '@/components/sveltecomponents/DataGrid.svelte';
  import { setWaiting, removeWaiting } from '@/utils/loaderUtils';

  let taskChangeItem = [];
  let selectedItem = '';
  let selectedItemValue = '';
  let rowData: any[] | null = null;
  let count = 2;
  export let params;
  const labelCodes = ['changeRemark'];

  onMount(() => {
    setWaiting();
    searchTaskDetail();
    searchTaskDetailData();
    onTaskDetailStyle();
  });

  onDestroy(() => {
    disposer();
    disposerSearchTaskDetail();
  });

  function countOver() {
    count--;
    if (count === 0) {
      removeWaiting();
    }
  }

  const disposer = autorun(() => {
    if (taskDetailStore.taskChangeItemResult) {
      const value = JSON.parse(JSON.stringify(taskDetailStore.taskChangeItemResult));
      taskDetailStore.taskChangeItemResult = null;
      countOver();
      if (!value.error) {
        taskChangeItem = value.data;
        taskChangeItem.unshift({ changeId: '', changeName: '--请选择--' });
        selectedItemValue = taskChangeItem[0];
      } else {
        CustomAlert('网络错误', AlertIcon.ERROR);
      }
    }
  });

  const disposerSearchTaskDetail = autorun(() => {
    if (taskDetailStore.taskDetailResult) {
      const value = JSON.parse(JSON.stringify(taskDetailStore.taskDetailResult));
      taskDetailStore.taskDetailResult = null;
      countOver();
      if (!value.error) {
        rowData = value.data;
        value.data?.forEach((i) => {
          i.id = i.nid;
          i.labelCodes = labelCodes;
        });
      } else {
        CustomAlert('网络错误', AlertIcon.ERROR);
      }
    }
  });

  function searchTaskDetail() {
    const info: taskModifyTypeInfo = {};
    info.author = '';
    info.nid = '';
    info.technologyTitle = '';
    taskDetailStore.getTaskChangeItem(info);
  }

  function searchTaskDetailData() {
    const info: taskDetailInfo = {};
    info.taskNo = params.taskNo;
    info.changeItemId = selectedItem;
    taskDetailStore.getTaskDetail(info);
  }

  function onTaskItemChangeHandler(e: any) {
    selectedItem = e.changeId;
    selectedItemValue = e;
    searchTaskDetailData();
  }

  function onTaskDetailStyle() {
    document.getElementById('task-detail-outer').parentElement.parentElement.style.width = '800px';
    document.getElementById('task-detail-outer').parentElement.parentElement.style.height = '600px';
    document.getElementById('task-detail-outer').parentElement.style.marginBottom = '0px';
    document.getElementById('task-detail-outer').parentElement.style.padding = '8px 8px 0px 8px';
  }
</script>

<div id="task-detail-outer">
  <div class="title-text"><Text class="modify-type-text">修改类型</Text></div>
  <div class="advanced-select">
    <AdvancedSelect
      options={taskChangeItem}
      bind:value={selectedItemValue}
      optionIdentifier="changeId"
      labelIdentifier="changeName"
      onSubmit={onTaskItemChangeHandler}
    />
  </div>
  <div class="data-table task-detail-table">
    <!-- <DataGridEx {rowData} columnsDefs={taskDetailColumns} display="none" /> -->
    <DataGrid columnDefs={taskDetailColumns} {rowData} pageShowFlag={false} />
  </div>
</div>

<style>
  .title-text {
    width: 100%;
  }

  .advanced-select {
    height: 35px;
    margin-top: 10px;
  }

  .data-table {
    margin-top: 10px;
    height: 445px;
    margin-bottom: 10px;
    overflow-y: auto;
    border: 1px solid lightgray;
  }

  :global(.data-table > .dataTable-width) {
    max-height: 443px;
  }

  :global(.data-table > .not-find-rowdata-div) {
    height: auto !important;
    border: 0px;
    margin-left: 0px;
  }

  /* .no-data {
    width: 100%;
    height: 450px;
    display: flex;
    justify-content: center;
    color: lightgray;
  } */

  :global(.advanced-select > .svelte-select.svelte-15ynnp5.svelte-15ynnp5.svelte-15ynnp5) {
    border-radius: 0px;
    min-height: 35px;
  }

  :global(.modify-type-text) {
    font-size: 16px;
  }

  :global(.data-table > .bx--data-table-container) {
    padding-top: 0px;
  }

  :global(.data-table > .bx--data-table-container > .bx--data-table tbody > tr) {
    height: 35px;
  }

  :global(.data-table > .bx--data-table-container > .bx--data-table tbody > tr > td) {
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-top: 0px;
    padding-bottom: 0px;
    border-right: 1px solid #e6e6e6;
  }

  :global(.task-detail-table > .bx--data-table-container > .bx--data-table tbody > tr > td:nth-child(3)) {
    text-align: left;
  }

  :global(.data-table > .bx--data-table-container > .bx--data-table tbody > tr > td > p) {
    padding-right: 0px;
  }

  /* :global(.bx--data-table th) {
    position: sticky;
    top: 0px;
  } */
</style>
