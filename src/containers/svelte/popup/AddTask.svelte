<script lang="ts">
  import "@/styles/core/white.css";
  import "@/styles/core/index.scss";
  import { Text, Input, TextArea, Button } from "@/components/sveltecomponents";
  import {
    Checkbox,
    DatePicker,
    DatePickerInput,
  } from "carbon-components-svelte";
  import addTaskStore from "@/store/AddTaskStore";
  import { onDestroy, onMount } from "svelte";
  import { setWaiting, removeWaiting } from "@/utils/loaderUtils";
  import { UsersInfo } from "@/vo/userManager";
  import { autorun } from "mobx";
  import { deepClone } from "@/utils/CommonUtils";
  import CustomAlert from "@/components/CustomAlert";
  import { AddTaskAlert } from "@/constant/alert/Task";
  import { AlertIcon } from "@/components/CustomAlert";
  import { Save } from "carbon-icons-svelte";
  import { AddTaskValue } from "@/vo/taskManager";
  import { UserInfo } from "@/utils/Settings";
  import { localeFromDateFnsLocale } from "date-picker-svelte";
  import { zhCN } from "date-fns/locale";

  let bizList = [];
  let taskUserIdAr = [];
  let taskTitle = "";
  let taskContent = "";
  let startDate = "";
  let endDate = "";
  let taskUserId = "";
  let count = 1;
  let locale = localeFromDateFnsLocale(zhCN);
  export let onClose;
  const placeholder = "同一技术请保持题目一致，特殊符号尽量只输入半角.和-";

  onMount(() => {
    setWaiting();
    searchUserList();
    getCurrentDate();
    addStyleHandler();
  });

  onDestroy(() => {
    disposer();
    addTask();
    // searchTask();
  });

  function countOver() {
    count--;
    if (count === 0) {
      removeWaiting();
    }
  }

  const disposer = autorun(() => {
    if (addTaskStore.userListResult) {
      const value = deepClone(addTaskStore.userListResult);
      addTaskStore.userListResult = null;
      countOver();
      if (!value.error) {
        bizList = value.data;
      } else {
        CustomAlert(AddTaskAlert.INTERNET_ERROR, AlertIcon.ERROR);
      }
    }
  });

  const addTask = autorun(() => {
    if (addTaskStore.addTaskResult) {
      const value = deepClone(addTaskStore.addTaskResult);
      addTaskStore.addTaskResult = null;
      countOver();
      if (!value.error) {
        CustomAlert(AddTaskAlert.ADD_TASK_SUCCESS, AlertIcon.SUCCESS);
        onClose("Y");
      } else {
        CustomAlert(AddTaskAlert.INTERNET_ERROR, AlertIcon.ERROR);
      }
    }
  });

  // const searchTask = autorun(() => {
  //   if (addTaskStore.searchTaskResult) {
  //     const value = deepClone(addTaskStore.searchTaskResult);
  //     addTaskStore.searchTaskResult = null;
  //     countOver();
  //     if (!value.error) {
  //       taskList = value.data;
  //     } else {
  //       console.log('error');
  //       CustomAlert(AddTaskAlert.SEARCH_TASK_ERROR);
  //     }
  //   }
  // });

  function onTitleInputChangeHandler(e: CustomEvent) {
    taskTitle = e.detail.data;
  }

  function onCheckboxChangeHandler(e: Event) {
    const checkbox = e.target as HTMLInputElement;
    if (checkbox.checked) {
      taskUserIdAr.push(checkbox.value);
    } else {
      taskUserIdAr = taskUserIdAr.filter((i) => i !== checkbox.value);
    }
    taskUserId = taskUserIdAr.toString();
  }

  function onContentInputChangeHandler(e: CustomEvent) {
    taskContent = e.detail.data;
  }

  function onDateInputChangeHandler(e: CustomEvent) {
    startDate = e.detail.dateStr.from;
    endDate = e.detail.dateStr.to;
  }

  function onSaveClickHandler() {
    if (!validate()) {
      return;
    }
    const info: AddTaskValue = {};
    info.taskTitle = taskTitle;
    info.taskContent = taskContent;
    info.taskUserId = taskUserId;
    info.startDate = startDate;
    info.endDate = endDate;
    info.taskAdmin = UserInfo.userId;
    // info.taskAdmin = 'wangpingyue';
    addTaskStore.addTaskInfo(info);
  }

  function searchUserList() {
    const info: UsersInfo = {};
    info.blockflag = "N";
    info.usertype = "U";
    info.iStart = 0;
    info.iPageCount = 10;
    addTaskStore.getUserList(info);
  }

  // function searchTaskList() {
  //   const info: taskInfo = {
  //     taskTitle: '',
  //     taskUserId: taskUserId,
  //     taskProgress: '',
  //     breakFlag: '',
  //     iStart: 0,
  //     iPageCount: 10000,
  //   };
  //   addTaskStore.searchTaskList(info);
  // }

  function getCurrentDate() {
    const date = new Date();
    let month = "";
    let day = "";
    if (date.getMonth() < 10) {
      month = `0${date.getMonth()}`;
    } else {
      month = date.getMonth().toString();
    }
    if (date.getDate() < 10) {
      day = `0${date.getDate()}`;
    } else {
      day = date.getDate().toString();
    }
    startDate = `${date.getFullYear()}-${Number(month) + 1}-${day}`;
    endDate = `${date.getFullYear()}-${Number(month) + 2}-${day}`;
  }

  function validate() {
    // searchTaskList();
    if (taskTitle === "") {
      CustomAlert(AddTaskAlert.TASK_TITLE_ERROR, AlertIcon.ERROR);
      return false;
    }
    // if (taskList?.findIndex((i) => i.taskTitle === taskTitle) > -1) {
    //   CustomAlert(AddTaskAlert.TASK_TITLE_SAME, AlertIcon.ERROR);
    //   return false;
    // }
    if (taskUserId === "") {
      CustomAlert(AddTaskAlert.TASK_USERID_ERROR, AlertIcon.ERROR);
      return false;
    }
    if (startDate === "" || endDate === "") {
      CustomAlert(AddTaskAlert.TASK_DATE_ERROR, AlertIcon.ERROR);
      return false;
    } else {
      return true;
    }
  }

  function addStyleHandler() {
    document.getElementById("add-task-pop").parentElement.style.padding = "8px";
  }
</script>

<div id="add-task-pop">
  <div class="max-width button-height">
    <Button
      kind="tertiary"
      icon={Save}
      class="button-normal"
      on:click={onSaveClickHandler}>保存</Button>
  </div>
  <div class="content-margin-top">
    <div class="flex">
      <div class="left">
        <Text class="left-min-height">标题</Text>
      </div>
      <div class="right border-top" style="flex-grow:1">
        <Input
          bind:value={taskTitle}
          {placeholder}
          on:input={onTitleInputChangeHandler}
          maxAscii={100} />
      </div>
    </div>
    <div class="flex max-height">
      <div class="left">
        <Text class="left-person">负责人</Text>
      </div>
      <div class="flex right checkbox">
        {#each bizList as bizList}
          <Checkbox
            value={bizList.id}
            labelText={bizList.name}
            on:change={onCheckboxChangeHandler} />
        {/each}
      </div>
    </div>
    <div class="flex">
      <div class="left">
        <Text class="left-content">内容</Text>
      </div>
      <div class="right textarea-border">
        <TextArea
          bind:value={taskContent}
          on:input={onContentInputChangeHandler}
          height="100px"
          maxCount={200}
          class="textarea-resize" />
      </div>
    </div>
    <div class="flex">
      <div class="left">
        <Text class="left-min-height">日程</Text>
      </div>
      <div class="right date-picker-border">
        <DatePicker
          datePickerType="range"
          bind:valueFrom={startDate}
          bind:valueTo={endDate}
          dateFormat="Y-m-d"
          on:change={onDateInputChangeHandler}
          short={true}
          class="date-picker-input">
          <DatePickerInput size="sm" bind:value={startDate} />
          <DatePickerInput size="sm" bind:value={endDate} />
        </DatePicker>
      </div>
    </div>
    <div class="bottom-div" />
  </div>
</div>

<style lang="scss">
  .flex {
    display: flex;
  }

  .max-width {
    width: 100%;
  }

  .max-height {
    height: 100%;
  }

  .button-height {
    height: 30px;
  }

  .content-margin-top {
    margin-top: 5px;
  }  

  .right {
    width: 100%;
    padding: 2px 5px;
    // border-top: 1px solid #cacaca;
    border-right: 1px solid #cacaca;
  }

  .checkbox {
    flex-wrap: wrap;
    padding: 10px 2px;
  }

  .border-top {
    border-top: 1px solid #cacaca;
  }

  .bottom-div {
    height: 10px;
  }

  :global(.left-min-height) {
    height: 35px;
    line-height: 35px;
  }

  :global(.left-person) {
    height: 104px;
    line-height: 104px;
  }

  :global(.left-content) {
    height: 154px;
    line-height: 154px;
  }

  :global(.checkbox > .bx--form-item) {
    flex: 0 0 24%;
    margin-right: calc(4% / 3);
  }

  :global(.checkbox > .bx--form-item:nth-child(4n)) {
    margin-right: 0px;
  }

  :global(.checkbox > .bx--form-item:last-child) {
    margin-right: auto;
  }

  .date-picker-border {
    border-bottom: 1px solid #cacaca;
  }
  :global(
      .textarea-border
        > .bx--form-item
        > .bx--text-area__wrapper
        > .bx--text-area
    ) {
    border-bottom: 0px;
    border: 1px solid #cacaca;
    min-height: 150px;
  }  

  :global(.max-width > button) {
    max-width: none;
    position: absolute;
    right: 8px;
  }

  :global(.flex > .bx--form-item) {
    margin-top: 0px !important;
    margin-bottom: 0px !important;
  }  

  :global(
      .date-picker-input > div > div > div > div > .flatpickr-calendar.static
    ) {
    top: auto !important;
    bottom: calc(100% + 2px);
  }

  :global(.textarea-resize) {
    resize: none;
  } 
</style>
