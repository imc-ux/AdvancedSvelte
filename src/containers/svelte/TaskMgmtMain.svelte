<!-- Summary:任务管理主页面 -->
<script lang="ts">
  import { AdvancedSelect, Button, BatchInput, Text } from '@/components/sveltecomponents';
  import { Checkbox } from 'carbon-components-svelte';
  import { autorun } from 'mobx';
  import { onMount, onDestroy } from 'svelte';
  import taskMgmtMainStore from '@/store/TaskMgmtMainStore';
  import CustomAlert, { AlertIcon } from '@/components/CustomAlert';
  import { UsersInfo } from '@/vo/userManager';
  import { items, progressTask, statusTask } from '@/constant/constant';
  import { setWaiting, removeWaiting } from '@/utils/loaderUtils';
  import taskColumns from '@/components/columns/taskMgmtColumns';
  import { taskInfo, userPermission } from '@/vo/taskManager/index';
  import Search from 'carbon-icons-svelte/lib/Search.svelte';
  import Reset from 'carbon-icons-svelte/lib/Reset.svelte';
  import Download from 'carbon-icons-svelte/lib/Download.svelte';
  import XLSX from 'xlsx';
  import { CreatePop } from '@/components/Popup';
  import ModifyTask from '@/containers/svelte/popup/modifyTask.svelte';
  import DocumentBlank from 'carbon-icons-svelte/lib/DocumentBlank.svelte';
  import TaskDetail from '@/containers/svelte/popup/TaskDetail.svelte';
  import { UserInfo } from '@/utils/Settings';
  import Storage, { StorageType } from '@/utils/Storage';
  import { deepClone } from '@/utils/CommonUtils';
  import { TaskMgmtAlert } from '@/constant/alert/Task';
  import { Add, TaskAdd } from 'carbon-icons-svelte';
  import AddTask from '@/containers/svelte/popup/AddTask.svelte';
  import type { GridReadyEvent } from 'ag-grid-community';

  import DataGrid from '@/components/sveltecomponents/DataGrid.svelte';

  let bizList = [];
  let rowData: any[] | null = null;
  let selectedBizList = UserInfo.userId;
  let selectedItems = 20;
  let selectedBizListValue = null;
  let selectedItemsValue = null;
  let taskTitle: string = '';
  let taskTitleTotal = 0;
  let taskProgress = 'AB';
  let breakFlag: string = 'N';
  let pageCount = 0;
  let pageSize = 20;
  let searchInfo: any = {};
  let currentPage = 0;
  let arrHeadTitleNameWidth: any[] = [];
  let arrHeadTitleName: any[] = [];
  let defaultUser = null;
  let breakSelect: boolean;
  const loginUser = Storage.getSessionItem(StorageType.UserName);
  let permissionValue: any;
  let gridApi: any;
  const linkCodes = ['taskTitle'];
  const labelCodes = ['userName', 'status'];
  const progressCode = ['taskProgress'];
  onMount(() => {
    const currentTheme = Storage.getLocalItem('svelte-theme') ?? 'green-theme';
    document.body.setAttribute('data-theme', currentTheme);
    window.addEventListener('message', themeChangeHandler, false);
    setWaiting();
    // if (loginUser === null || loginUser === '') {
    //   window.location.href = 'login.html';

    // }
    searchUserList();
    userPermission();
  });

  onDestroy(() => {
    disposer();
    disposerSearchTask();
    user();
    window.removeEventListener('message', themeChangeHandler, false);
    gridApi?.removeEventListener('LinkButtonClick', onItemRendererLinkButtonHandler);
    gridApi?.removeEventListener('IconButtonClick', onTaskDetailOpenHandler);
  });

  function themeChangeHandler(e: MessageEvent) {
    if (e.data.type === 'theme-changed') {
      document.body.setAttribute('data-theme', e.data.data);
    }
  }

  function onGridReadyHandler(params: GridReadyEvent) {
    gridApi = params.api;
    gridApi?.addEventListener('LinkButtonClick', onItemRendererLinkButtonHandler);
    gridApi?.addEventListener('IconButtonClick', onTaskDetailOpenHandler);
  }

  const disposer = autorun(() => {
    if (taskMgmtMainStore.userPermissionResult) {
      permissionValue = deepClone(taskMgmtMainStore.userPermissionResult);
      taskMgmtMainStore.userPermissionResult = null;
      removeWaiting();
      if (!permissionValue.error) {
        if (!permissionValue.data.includes('K')) {
          document.getElementById('add-task').remove();
        }
      }
      searchUserList();
    }
  });

  const user = autorun(() => {
    if (taskMgmtMainStore.userListResult) {
      const value = deepClone(taskMgmtMainStore.userListResult);
      taskMgmtMainStore.userListResult = null;
      removeWaiting();
      if (!value.error) {
        bizList = value.data;
        const user: {} = {
          name: '--请选择--',
          id: '',
          password: '',
          permissionGroup: '',
          userType: '',
          blockFlag: '',
        };
        bizList.unshift(user);
        selectedItemsValue = items[0];
        selectedBizListValue = bizList[0];
        selectedBizList = bizList[0].id;
        if (!permissionValue?.data.includes('K')) {
          bizList.find((i) => {
            if (i.id === UserInfo.userId) {
              selectedBizListValue = i;
              selectedBizList = i.id;
              defaultUser = i;
            }
          });
        }
      } else {
        CustomAlert(TaskMgmtAlert.INTERNET_ERROR, AlertIcon.ERROR);
      }
    }
  });

  const disposerSearchTask = autorun(() => {
    if (taskMgmtMainStore.taskListResult) {
      const value = JSON.parse(JSON.stringify(taskMgmtMainStore.taskListResult));
      taskMgmtMainStore.taskListResult = null;
      removeWaiting();
      if (value.error) {
        CustomAlert(TaskMgmtAlert.INTERNET_ERROR, AlertIcon.ERROR);
        return;
      }
      value.data?.forEach((i) => {
        i.linkCodes = linkCodes;
        i.labelCodes = labelCodes;
        i.isDetail = 'Y';
        i.progressCode = progressCode;
        i.startTime = onDateConvert(i.startDate);
        i.endTime = onDateConvert(i.endDate);
        i.id = i.taskNo;
        if (i.breakFlag === 'N') {
          if (Number(i.taskProgress) === 100) {
            i.status = '完成';
          } else if (Number(i.taskProgress) > 0 && Number(i.taskProgress) < 100) {
            i.status = '进行中';
          } else if (Number(i.taskProgress) === 0) {
            i.status = '发布';
          }
        }
        if (i.breakFlag === 'Y') {
          i.status = '中止';
        }
        if (i.modifyFlag === 'Y') {
          i.btnIcon = DocumentBlank;
        }
      });
      if (value.data.length > 0) {
        pageSize = selectedItems;
        pageCount = Math.ceil(value.data?.[0]?.totalCount / pageSize);
      }
      rowData = value.data;
    }
  });

  function onDateConvert(e: string) {
    const date = new Date(e);
    let month = Number(date.getMonth() + 1).toString();
    let day = Number(date.getDate()).toString();
    if (Number(month) < 10) {
      month = `0${month.toString()}`;
    }
    if (Number(day) < 10) {
      day = `0${day.toString()}`;
    }
    return `${date.getFullYear()}-${month}-${day} `;
  }

  function onDownLoadDataHandler(data: any[]) {
    const filename = '任务管理.xlsx';
    data = JSON.parse(JSON.stringify(data));
    data.forEach((row) => {
      changedKeys(row, 'taskTitle', '标题');
      changedKeys(row, 'userName', '负责人');
      changedKeys(row, 'startTime', '开始日期');
      changedKeys(row, 'endTime', '结束日期');
      changedKeys(row, 'taskProgress', '进度');
      changedKeys(row, 'status', '状态');
      dataDownloadChoose(row);
    });
    taskColumns.forEach((i) => {
      if (i?.headerName !== '详细' && i.headerName) {
        arrHeadTitleName.push(i.headerName);
        // arrHeadTitleNameWidth.push({ wpx: i.width.replace('px', '') });
        arrHeadTitleNameWidth.push({ wpx: i.width });
      }
    });
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(data, { header: arrHeadTitleName });
    ws['!cols'] = arrHeadTitleNameWidth;
    XLSX.utils.book_append_sheet(wb, ws);
    XLSX.writeFile(wb, filename);
  }

  function changedKeys(data: any, from: string, to: string) {
    data[to] = data[from];
    delete data[from];
  }

  function dataDownloadChoose(data: any) {
    for (let key in data) {
      if (key !== '标题' && key !== '负责人' && key !== '开始日期' && key !== '结束日期' && key !== '进度' && key !== '状态') {
        delete data[key];
      }
    }
  }

  function searchUserList() {
    const info: UsersInfo = {};
    info.blockflag = 'N';
    info.usertype = 'U';
    info.iStart = 0;
    info.iPageCount = 10;
    taskMgmtMainStore.getUserList(info);
  }

  function onBizListSeletedHandler(value: any) {
    selectedBizList = value.id;
    selectedBizListValue = value;
  }

  function onItemsSelectedHandler(value: any) {
    selectedItems = value.code;
    selectedItemsValue = value;
  }

  function onProgressTaskChangeHandler(e: Event) {
    const statusCheckbox = e.target as HTMLInputElement;
    const currentIndex = progressTask.findIndex((i) => i.value === statusCheckbox.defaultValue);
    progressTask[currentIndex].checked = statusCheckbox.checked;
    breakSelect = progressTask.every((i) => !i.checked);
    if (breakSelect) {
      statusCheckbox.checked = true;
      progressTask[currentIndex].checked = statusCheckbox.checked;
    }
    if (progressTask[currentIndex].value === '发布') {
      if (progressTask[currentIndex].checked) {
        taskProgress = onUniqueHandler(`A${taskProgress}`);
      } else {
        taskProgress = taskProgress.replace('A', '');
      }
    }
    if (progressTask[currentIndex].value === '进行中') {
      if (progressTask[currentIndex].checked) {
        taskProgress = onUniqueHandler(`B${taskProgress}`);
      } else {
        taskProgress = taskProgress.replace('B', '');
      }
    }
    if (progressTask[currentIndex].value === '完成') {
      if (progressTask[currentIndex].checked) {
        taskProgress = onUniqueHandler(`C${taskProgress}`);
      } else {
        taskProgress = taskProgress.replace('C', '');
      }
    }
  }

  function onStatusTaskChangeHandler(e: Event) {
    const checkbox = e.target as HTMLInputElement;
    const currentIndex = statusTask.findIndex((i) => i.value === checkbox.defaultValue);
    statusTask[currentIndex].checked = checkbox.checked;
    breakSelect = statusTask.every((i) => !i.checked);
    if (breakSelect) {
      checkbox.checked = true;
      statusTask[currentIndex].checked = checkbox.checked;
    }
    if (statusTask[currentIndex].checked) {
      breakFlag = onUniqueHandler(`${breakFlag}${statusTask[currentIndex].value}`);
    } else {
      breakFlag = breakFlag.replace(statusTask[currentIndex].value, '');
    }
  }

  function onUniqueHandler(str: string) {
    let newStr = '';
    for (let i = 0; i < str.length; i++) {
      if (newStr.search(str[i]) === -1) {
        newStr += str[i];
      }
    }
    return newStr;
  }

  function onSearchTaskHandler() {
    const info: taskInfo = {
      taskTitle: taskTitle,
      taskUserId: selectedBizList,
      taskProgress: taskProgress,
      breakFlag: breakFlag,
      iStart: 0,
      iPageCount: selectedItems,
    };
    currentPage = 0;
    searchInfo = info;
    setWaiting();
    taskMgmtMainStore.searchTaskList(info);
  }

  function onItemRendererLinkButtonHandler(e: any) {
    CreatePop('任务修改', ModifyTask, e.detail.data, onClosePopHandler, { width: '650px' });
  }

  function onClosePopHandler(data: string) {
    if (data === 'Y') {
      if (searchInfo) {
        setWaiting();
        currentPage = 0;
        taskMgmtMainStore.searchTaskList(searchInfo);
        document.getElementById('task-data-table-id').scrollTop = 0;
      }
    }
  }

  function onSearchConditionResetHandler() {
    selectedBizListValue = defaultUser;
    selectedItemsValue = items[0];
    taskTitle = '';
    taskTitleTotal = 0;
    taskProgress = 'AB';
    selectedBizList = UserInfo.userId;
    progressTask[0].checked = true;
    progressTask[1].checked = true;
    progressTask[2].checked = false;
    breakFlag = 'N';
    statusTask[0].checked = true;
    statusTask[1].checked = false;
  }

  function onPageChange(e: CustomEvent) {
    const info = {
      taskUserId: searchInfo.taskUserId,
      taskTitle: searchInfo.taskTitle,
      taskProgress: searchInfo.taskProgress,
      breakFlag: searchInfo.breakFlag,
      iStart: e.detail.page * pageSize,
      iPageCount: selectedItems,
    };
    currentPage = e.detail.page;
    taskMgmtMainStore.searchTaskList(info);
  }

  function onRowDataDownloadHandler() {
    if (!rowData?.length) {
      CustomAlert(TaskMgmtAlert.DOWNLOAD_DATA, AlertIcon.WARNING);
      return;
    } else {
      onDownLoadDataHandler(rowData);
    }
  }

  function onTaskDetailOpenHandler(e: any) {
    if (e.detail.colDef.field === 'modifyFlag') CreatePop('查看详细', TaskDetail, e.detail.data);
  }

  function onAddBtnClickHandler() {
    CreatePop('新增任务', AddTask, {}, onClosePopHandler, { width: '650px', height: '455px' });
  }

  function userPermission() {
    const info: userPermission = {};
    info.userId = UserInfo.userId;
    info.pageId = 'task';
    taskMgmtMainStore.getUserPermission(info);
  }
</script>

<div class="outer">
  <div class="flex-div top-box">
    <div class="flex-div top-first-div">
      <div class="top-text1">
        <Text>负责人</Text>
      </div>
      <div class="top-select space top_text1_sapce">
        <AdvancedSelect
          options={bizList}
          optionIdentifier="id"
          labelIdentifier="name"
          bind:value={selectedBizListValue}
          onSubmit={onBizListSeletedHandler}
        />
      </div>
    </div>
    <div class="flex-div top-div">
      <div class="top-text2">
        <Text>标题</Text>
      </div>
      <div class="top-select batch-input-z-index">
        <BatchInput bind:value={taskTitle} bind:dataTotal={taskTitleTotal} mode={1} />
      </div>
    </div>
    <div class="flex-div top-second-right">
      <div class="flex-div task-progress">
        <div class="top-text3 status-text">
          <Text>状态</Text>
        </div>
        <div class="flex-div status-div ">
          {#each progressTask as progress}
            <Checkbox labelText={progress.value} value={progress.value} checked={progress.checked} on:change={onProgressTaskChangeHandler} />
          {/each}
        </div>
      </div>
      <div class="flex-div top-last-div ">
        <div class="top-text3">
          <Text>中止</Text>
        </div>
        <div class="flex-div  break-flag-status">
          {#each statusTask as status}
            <Checkbox labelText={status.value} value={status.value} checked={status.checked} on:change={onStatusTaskChangeHandler} />
          {/each}
        </div>
      </div>
    </div>
  </div>
  <div class="flex-div top-second-width task-search">
    <div class="flex-div top-second-left">
      <div class="add-button" id="add-task">
        <Button icon={Add} size="small" kind="tertairy" on:click={onAddBtnClickHandler} class="button-normal">新增</Button>
      </div>
      <div class="load-button add-button ">
        <Button icon={Download} size="small" kind="tertiary" on:click={onRowDataDownloadHandler} class="button-normal">下载</Button>
      </div>
    </div>
    <div class="flex-div flex-end top-second-right">
      <div class="item-select">
        <AdvancedSelect options={items} bind:value={selectedItemsValue} onSubmit={onItemsSelectedHandler} />
      </div>
      <div class="seartch-button">
        <Button icon={Search} size="small" kind="tertiary" on:click={onSearchTaskHandler} class="button-normal ">SEARCH</Button>
      </div>
      <div class="reset-button">
        <Button icon={Reset} size="small" kind="tertiary" on:click={onSearchConditionResetHandler} class="button-normal ">RESET</Button>
      </div>
    </div>
  </div>
  <DataGrid id="task-mgmt-Grid" columnDefs={taskColumns} {rowData} {pageCount} {currentPage} {onPageChange} onGridReady={onGridReadyHandler} />
  <!-- <DataGridEx
    id="task-data-table-id"
    {rowData}
    columnsDefs={taskColumns}
    {currentPage}
    {pageCount}
    total={rowData?.[0]?.totalCount}
    onLinkClick={onTaskModifyPageOpenHandler}
    onBtnClick={onTaskDetailOpenHandler}
    {onPageChange}
  /> -->

  <!-- <div style="justify-content:center; align-item:center">
    <div id="task-mgmt-Grid" style="height: 700px" />
    {#if rowData}
      <div>
        <Pagination total={rowData?.[0]?.totalCount} {pageCount} {currentPage} {onPageChange} />
      </div>
    {/if}
  </div> -->
</div>

<style lang="scss">
  @import '../../styles/theme/var';
  @import '../../styles/theme/mixin';

  .outer {
    display: flex !important;
    flex-direction: column !important;
    width: auto;
    height: 100% !important;
    min-width: 1422px;
  }

  .flex-div {
    display: flex;
  }

  .top-second-width {
    min-width: 1400px;
    height: 40px;
    line-height: 40px;
  }

  .top-second-left {
    width: 50%;
  }

  .top-second-right {
    width: 50%;
  }

  .top-box {
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #cacaca;
    padding: 10px 0px;
  }

  .top-first-div {
    width: 100%;
    margin-left: 5px;
  }

  .top-div {
    width: 100%;
    margin-left: 60px;
  }

  .task-progress {
    width: 400px;
    margin-right: 100px;
    margin-left: 80px;
  }

  .top-text1 {
    width: 49px !important;
    height: 30px;
    line-height: 30px;
  }
  .top-text2 {
    width: 60px !important;
    height: 30px;
    line-height: 30px;
  }
  .top-text3 {
    width: 29px !important;
    height: 30px;
    line-height: 30px;
  }
  .space {
    margin-right: 25px;
  }
  .top_text1_sapce {
    margin-left: -4px;
  }
  .top-select {
    width: 100% !important;

    /* margin-left: 15px; */
  }

  /* .status-text { */
  /* margin-left: -30px; */
  /* } */

  .status-div {
    width: 200px;
    margin-left: 10px;
    padding-top: 3px;
    margin-top: -3px;
  }

  .break-flag-status {
    width: 80px;
    margin-left: 10px;
    padding-top: 3px;
    margin-top: -3px;
  }

  .top-last-div {
    margin-left: -200px;
  }

  .load-button {
    height: 30px;
    line-height: 30px;
  }

  .item-select {
    width: 145px;
    height: 30px;
    line-height: 30px;
    position: absolute;
    margin-right: 7px;
    right: 248px;
    margin-top: 2px;
  }

  .flex-end {
    position: relative;
  }

  .seartch-button {
    position: absolute;
    margin-right: 7px;
    margin-top: 2px;
    margin-bottom: 1px;
    right: 115px;
  }

  .reset-button {
    position: absolute;
    margin-top: 2px;
    margin-bottom: 1px;
    right: 0px;
  }

  .add-button {
    margin-right: 4px;
    /* margin-top: 2px; */
    height: 100%;
  }

  :global(.batch-input-z-index > div) {
    width: 100% !important;
  }

  :global(.batch-input-z-index > div > div) {
    z-index: 100 !important;
  }

  :global(.svelte-select) {
    min-height: 30px !important;
    line-height: 30px !important;
    border-radius: 0% !important;
  }

  :global(.top-select > .svelte-select) {
    margin-left: 15px !important;
    height: 30px;
  }

  :global(.top-select > div > div > div > div > .bx--text-input) {
    width: 100% !important;
    border-bottom: 0px;
    border: 1px solid #cacaca;
    height: 30px;
    line-height: 30px;
    background-color: #fff;
  }

  :global(.load-button > .bx--btn) {
    height: 30px !important;
  }

  :global(.load-button > .bx--btn--sm) {
    min-height: 1rem !important;
  }

  :global(.item-select > .svelte-select.svelte-15ynnp5) {
    border-radius: 0% !important;
    height: 24px !important;
    margin-top: 6px !important;
  }

  :global(.button-normal) {
    font-family: 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif, '微软雅黑';
    font-size: 13px;
  }

  :global(.seartch-button > .bx--btn) {
    height: 30px !important;
  }

  :global(.seartch-button > .bx--btn--sm) {
    min-height: 1rem !important;
  }

  :global(.flex-div > div > .bx--btn) {
    height: 30px !important;
    margin-top: 6px;
  }

  :global(.flex-div > div > .bx--btn--sm) {
    min-height: 1rem !important;
  }

  :global(.item) {
    height: 24px !important;
    line-height: 24px !important;
    font-size: 13px;
  }

  :global(.svelte-select > .value-container) {
    padding: 0px !important;
  }

  :global(.bx--data-table-container) {
    position: relative;
  }

  :global(.datatable > table > tbody > tr > td > p) {
    height: 35px;
    line-height: 35px;
  }

  :global(.datatable-width) {
    max-height: 720px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  :global(.datatable-width > table > tbody) {
    max-height: 300px !important;
    /* overflow-y: auto !important; */
  }

  :global(.bx--data-table th) {
    position: sticky;
    top: 0px;
  }

  :global(.bx--data-table th:last-of-type) {
    position: sticky;
  }

  :global(.tr-height > table > thead > tr) {
    height: 35px;
    line-height: 35px;
  }

  :global(.tr-height > table > tbody > tr) {
    height: 35px;
    line-height: 35px;
  }

  :global(.bx--table-header-label) {
    @include themifyList('background-color', $theme-color);
    color: #fff;
    height: 35px;
    line-height: 35px;
  }

  :global(.bx--data-table--md .bx--table-header-label) {
    padding-top: 0px;
    padding-bottom: 0px;
  }

  :global(.bx--data-table th) {
    padding-left: 0px;
    padding-right: 0px;
    text-align: center;
    position: sticky;
  }

  :global(.bx--data-table th:first-of-type) {
    position: sticky;
  }

  :global(.datatable-width > .bx--data-table th:nth-child(5)) {
    z-index: 10;
  }

  :global(.datatable-width > .bx--data-table th:last-of-type) {
    z-index: 10;
  }

  :global(.flex-div > div > table > tbody > tr > td) {
    background-color: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0px;
  }

  :global(.flex-div > div > table > tbody > tr td:last-child) {
    border-right: 1px solid #e6e6e6;
    min-width: 130px;
  }

  :global(.flex-div > div > table > tbody > tr td:not(:nth-child(5))) {
    text-align: center;
  }

  :global(.flex-div > div > table > tbody > tr td:first-child) {
    text-align: left;
    padding-left: 10px;
    border-left: 1px solid #e6e6e6;
  }

  :global(.flex-div > div > table > tbody > tr td:nth-child(5)) {
    text-align: left;
    padding-left: 10px;
  }

  :global(.option.prev) {
    position: absolute;
    margin-top: 4px;
    margin-left: -15px;
  }

  :global(.option.next) {
    position: absolute;
    margin-top: 4px;
  }

  :global(.option.number) {
    margin-left: 10px;
    margin-top: 1px;
    cursor: pointer;
  }

  :global(.option.number.active) {
    @include themifyList('color', $theme-color);
  }

  :global(.bx--data-table th) {
    position: sticky;
  }

  :global(.svelte-select.focused) {
    border-width: 1px !important;
    border-style: solid !important;
    @include themifyListIpt('border-color', $theme-color);
  }

  :global(.bx--text-input:focus) {
    outline: none;
    border-width: 1px !important;
    border-style: solid !important;
    @include themifyListIpt('border-color', $theme-color);
  }

  :global(.bx--checkbox-label::before) {
    outline: none !important;
  }

  :global(.alert-box > .bx--modal-container > .bx--modal-header) {
    @include themifyListIpt('background-color', $theme-color);
  }

  :global(.top-select > .flex-display > .bx--form-item) {
    min-width: 300px;
  }

  :global(.outer + div > .is-visible > .bx--modal-container) {
    width: 600px;
    background-color: #fff;
  }

  :global(.outer + div > .alert-box > .bx--modal-container) {
    width: auto;
    background-color: #fff;
  }

  :global(.outer ~ div > div > div > .bx--modal-header > h3) {
    font-size: 18px;
    color: #fff;
  }

  :global(.outer ~ div > div > div > .bx--modal-header > .bx--modal-close > .bx--modal-close__icon) {
    fill: #fff;
  }

  :global(.bx--btn--ghost.bx--btn--sm) {
    height: 35px;
    line-height: 35px;
    background-color: none;
  }

  :global(.bx--btn--ghost) {
    @include themifyList('color', $theme-color);
    background-color: none;
    border: none;
  }

  :global(.bx--btn--ghost:hover) {
    @include themifyList('color', $theme-color);
    cursor: pointer;
    border: none;
    background-color: #e6e6e6;
  }

  :global(.bx--btn--ghost:focus) {
    outline: none;
    border: 0px;
    box-shadow: none;
    background-color: none;
  }

  :global(.bx--btn--ghost:active) {
    background-color: #e6e6e6;
  }

  :global(.datatable-width > table > tbody > tr > td > .bx--link) {
    font-size: 13px;
  }

  :global(.task-search + .dataTable > table > thead > tr > th:nth-child(5)) {
    z-index: 1;
  }
  //---------------ag-Grid-------------------------

  :global(.ag-paging-panel) {
    justify-content: center;
  }

  :global(a) {
    color: #08adaa;
    cursor: pointer;
  }
</style>
