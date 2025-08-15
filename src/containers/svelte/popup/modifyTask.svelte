<!-- Summary:任务管理修改页面 -->
<script lang="ts">
  import "@/styles/core/white.css";
  import "@/styles/core/index.scss";
  import {
    Input,
    TextArea,
    Text,
    Button,
    Slider,
  } from "@/components/sveltecomponents";
  import {
    DatePicker,
    DatePickerInput,
    Checkbox,
  } from "carbon-components-svelte";
  import { onMount, onDestroy } from "svelte";
  import { UsersInfo } from "@/vo/userManager/index";
  import modifyTaskStore from "@/store/modifyTaskStore";
  import { autorun } from "mobx";
  import { setWaiting, removeWaiting } from "@/utils/loaderUtils";
  import CustomAlert, { AlertIcon } from "@/components/CustomAlert";
  import { ModifyTaskAlert } from "@/constant/alert/Task";
  import Save from "carbon-icons-svelte/lib/Save.svelte";
  import { UserInfo } from "@/utils/Settings";
  import { taskModifyInfo, userPermission } from "@/vo/taskManager/index";
  import { deepClone } from "@/utils/CommonUtils";

  export let params;
  export let onClose;
  let bizList = [];
  let taskTitle = "";
  let taskUserId = "";
  let taskContent = "";
  let taskProgress: number;
  let modifyFlag = "";
  let taskRemark: string = "";
  let startDate = "";
  let endDate = "";
  let breakFlag = "";
  let undoneFlagchecked: boolean;
  let breaked: boolean;
  let UserPermissionAC = [];
  let readonly: boolean;
  let disabled: boolean;
  let count = 2;
  let isDisplay = false;
  let permissionData: any[] = [];
  let taskUserIdList: any[] = [];

  onMount(() => {
    setWaiting();
    modifyInfo();
    searchUserList();

    // ongetUserPermissionHandler();
    getUserActivePermission();
    onOuterContainerStyleHandler();
    taskUserIdList = taskUserId.split(",");
  });

  onDestroy(() => {
    disposer();
    modify();
    // userPermission();
    getPermission();
  });

  function countOver() {
    count--;
    if (count === 0) {
      removeWaiting();
    }
  }

  function getUserActivePermission() {
    const info: string = UserInfo.userId;
    modifyTaskStore.getUserActivePermission(info);
  }

  const getPermission = autorun(() => {
    if (modifyTaskStore.getUserActivePermissionResult) {
      const permissionList = deepClone(
        modifyTaskStore.getUserActivePermissionResult
      );
      modifyTaskStore.getUserActivePermissionResult = null;
      countOver();
      if (!permissionList.error) {
        permissionData = permissionList.data?.split(",");
        if (!permissionData?.includes("S_C")) {
          readonly = true;
          disabled = true;
          isDisplay = true;
          document.getElementById("title-input").className = "not-allowed";
          document.getElementById("task-content").className = "not-allowed ";
          document.getElementById("breakFlag").remove();
          document.getElementById(
            "outer-container"
          ).parentElement.style.height = "610px";
        } else {
          document.getElementById(
            "outer-container"
          ).parentElement.style.height = "650px";
        }
      }
    }
  });

  const disposer = autorun(() => {
    if (modifyTaskStore.userListResult) {
      const value = JSON.parse(JSON.stringify(modifyTaskStore.userListResult));
      modifyTaskStore.userListResult = null;
      countOver();
      if (!value.error) {
        bizList = value.data;
      } else {
        CustomAlert(ModifyTaskAlert.INTERNET_ERROR, AlertIcon.ERROR);
      }
    }
  });

  const modify = autorun(() => {
    if (modifyTaskStore.taskModifyResult) {
      const value = JSON.parse(
        JSON.stringify(modifyTaskStore.taskModifyResult)
      );
      modifyTaskStore.taskModifyResult = null;
      countOver();
      if (!value.error) {
        modifyTask();
        onClose("Y");
        CustomAlert(value.msg, AlertIcon.SUCCESS);
      } else {
        CustomAlert(value.msg, AlertIcon.ERROR);
      }
    }
  });

  // const userPermission = autorun(() => {
  //   if (modifyTaskStore.userPermissionResult) {
  //     const value = JSON.parse(JSON.stringify(modifyTaskStore.userPermissionResult));
  //     modifyTaskStore.userPermissionResult = null;
  //     countOver();
  //     if (!value.error) {
  //       UserPermissionAC = value.data;
  //       if (!value.data.includes('L')) {
  //         readonly = true;
  //         disabled = true;
  //         isDisplay = true;
  //         document.getElementById('title-input').className = 'not-allowed';
  //         document.getElementById('task-content').className = 'not-allowed ';
  //         document.getElementById('breakFlag').remove();
  //       }
  //     }
  //   }
  // });

  function modifyInfo() {
    taskTitle = params.taskTitle;
    taskUserId = params.taskUserId;
    taskContent = params.taskContent;
    taskProgress = Number(params.taskProgress);
    startDate = params.startTime;
    endDate = params.endTime;
    breakFlag = params.breakFlag;
    if (breakFlag === "Y") {
      breaked = true;
    } else {
      breaked = false;
    }
    if (modifyFlag === "Y") {
      undoneFlagchecked = true;
    } else {
      undoneFlagchecked = false;
    }
  }

  function searchUserList() {
    const info: UsersInfo = {};
    info.blockflag = "N";
    info.usertype = "U";
    info.iStart = 0;
    info.iPageCount = 10;
    modifyTaskStore.getUserList(info);
  }

  function onTitleInputChangeHandler(e: CustomEvent) {
    taskTitle = e.detail.data;
  }

  function onbizListSelectedChangeHandler(e: Event) {
    const bizListCheckBox = e.target as HTMLInputElement;
    if (!taskUserIdList.includes(bizListCheckBox.defaultValue)) {
      taskUserIdList.push(bizListCheckBox.defaultValue);
    } else {
      taskUserIdList = taskUserIdList.filter(
        (value) => value !== bizListCheckBox.defaultValue
      );
    }
    taskUserId = taskUserIdList.toString();
  }

  function onTaskContentChangeHandler(e: CustomEvent) {
    taskContent = e.detail.data;
  }

  function onRemarkContentChangeHandler(e: CustomEvent) {
    taskRemark = e.detail.data;
  }

  function onDatePickerChangeHandler(e: CustomEvent) {
    const datePicker = e.detail.dateStr;
    startDate = datePicker.from;
    endDate = datePicker.to;
  }

  function onSliderChangeHandler(e: CustomEvent) {
    const slider = e.detail.value;
    taskProgress = slider;
    if (taskProgress < 0) {
      taskProgress = 0;
    }
    if (taskProgress > 100) {
      taskProgress = 100;
    }
  }

  function onUndoneFlagCheckedChangeHandler(e: Event) {
    const undoneCheckBox = e.target as HTMLInputElement;
    undoneFlagchecked = undoneCheckBox.checked;
    if (undoneCheckBox.checked === true) {
      modifyFlag = "Y";
    } else {
      modifyFlag = "";
    }
  }

  function onBreakFlagChangeHandler(e: Event) {
    const breakedFlagCheckbox = e.target as HTMLInputElement;
    breaked = breakedFlagCheckbox.checked;
    if (breakedFlagCheckbox.checked === true) {
      breakFlag = "Y";
    } else {
      breakFlag = "N";
    }
  }

  function onModifyHandler() {
    if (!validate()) {
      return;
    }
    const info: taskModifyInfo = {};
    info.taskNo = params.taskNo;
    info.taskTitle = taskTitle.trim();
    info.taskUserId = taskUserId;
    info.taskContent = taskContent.trim();
    info.startDate = startDate.trim();
    info.endDate = endDate.trim();
    info.taskProgress = taskProgress;
    info.taskRemark = taskRemark.trim();
    info.breakFlag = breakFlag;
    info.userId = UserInfo.userId;
    info.undoneFlag = modifyFlag;

    modifyTaskStore.modifyTaskInfo(info);
  }

  function modifyTask() {
    params.taskTitle = taskTitle;
    params.taskUserId = taskUserId;
    params.taskContent = taskContent;
    params.startDate = startDate;
    params.endDate = endDate;
    params.taskProgress = taskProgress;
    params.taskRemark = taskRemark;
    params.breakFlag = breakFlag;
    params.undoneFlag = modifyFlag;
  }

  function validate() {
    if (
      !taskUserId.includes(UserInfo.userId) &&
      !permissionData?.includes("S_C")
    ) {
      CustomAlert(
        ModifyTaskAlert.NOT_THE_PERSON_IN_CHARGE_OF_THIS_PROJECT,
        AlertIcon.ERROR
      );
      return false;
    }
    if (params.breakFlag === "Y" && !permissionData?.includes("S_C")) {
      CustomAlert(
        ModifyTaskAlert.CAN_NOT_BE_MODIFIED_IN_SUSPENDED_STATE,
        AlertIcon.ERROR
      );
      return false;
    }
    if (taskTitle.trim() === "") {
      CustomAlert(ModifyTaskAlert.PLEASE_ENTER_A_TITLE, AlertIcon.ERROR);
      return false;
    }
    if (taskUserId === "") {
      CustomAlert(
        ModifyTaskAlert.PLAESE_CHOOSE_PERSON_IN_CHARGE,
        AlertIcon.ERROR
      );
      return false;
    }
    if (startDate === "" || endDate === "") {
      CustomAlert(ModifyTaskAlert.PLEASE_CHOOSE_DATE, AlertIcon.ERROR);
      return false;
    }
    if (String(taskProgress) === "") {
      CustomAlert(ModifyTaskAlert.PLEASE_ENTER_PROGRESS, AlertIcon.ERROR);
      return false;
    }
    if (
      taskTitle === params.taskTitle &&
      taskUserId === params.taskUserId &&
      taskContent === params.taskContent &&
      startDate === params.startTime &&
      endDate === params.endTime &&
      taskProgress === Number(params.taskProgress) &&
      breakFlag === params.breakFlag &&
      modifyFlag !== "Y"
    ) {
      CustomAlert(ModifyTaskAlert.CAN_NOT_MODIFY_PROGRESS, AlertIcon.ERROR);
      return false;
    }
    if (
      (startDate !== params.startTime || endDate !== params.endTime) &&
      (taskRemark === params.taskRemark ||
        taskRemark === "" ||
        taskRemark === null)
    ) {
      CustomAlert(
        ModifyTaskAlert.TO_MODIFY_THE_SCHEDULE_YUO_NEED_TO_MODIFY_THE_NOTES,
        AlertIcon.ERROR
      );
      return false;
    }
    if (
      (taskProgress !== Number(params.taskProgress) && taskRemark === "") ||
      taskRemark === null
    ) {
      CustomAlert(
        ModifyTaskAlert.TO_MODIFY_THE_PROGRESS_YOU_NEED_TO_MODIFY_THE_NOTES,
        AlertIcon.ERROR
      );
      return false;
    }
    if (taskRemark !== "" && String(taskRemark).length < 5) {
      CustomAlert(
        ModifyTaskAlert.THE_NOTES_IS_NOT_LESS_THAN_5,
        AlertIcon.ERROR
      );
      return false;
    }
    if (modifyFlag === "Y" && (taskRemark === "" || taskRemark === null)) {
      CustomAlert(
        ModifyTaskAlert.PLEASE_NOTE_THE_REASON_FOR_NOT_PROCEEDING,
        AlertIcon.ERROR
      );
      return false;
    }
    if (taskProgress !== Number(params.taskProgress) && modifyFlag === "Y") {
      CustomAlert(
        ModifyTaskAlert.MODIFYING_PROGRESS_CAN_NOT_BE_SELECTED_AS_NOT_IN_PROGRESS,
        AlertIcon.ERROR
      );
      return false;
    }
    return true;
  }

  // function ongetUserPermissionHandler() {
  //   const info: userPermission = {};
  //   info.userId = UserInfo.userId;
  //   // info.userId = 'wangpingyue';
  //   info.pageId = 'task';
  //   modifyTaskStore.getUserPermission(info);
  // }

  function onOuterContainerStyleHandler() {
    document.getElementById(
      "outer-container"
    ).parentElement.style.paddingRight = "0px";
    document.getElementById(
      "outer-container"
    ).parentElement.style.paddingBottom = "8px";
    document.getElementById(
      "outer-container"
    ).parentElement.style.marginBottom = "0rem";
    document.getElementById(
      "outer-container"
    ).parentElement.parentElement.style.maxHeight = "none";
  }
</script>

<div id="outer-container">
  <div class="max-width button-height">
    <Button
      size="small"
      kind="tertiary"
      class="button-normal"
      icon={Save}
      on:click={onModifyHandler}>保存</Button>
  </div>
  <div class="contant">
    <div class="flex">
      <div class="left">
        <Text class="left-min-height">标题</Text>
      </div>
      <div class="right border-top">
        <Input
          id="title-input"
          bind:value={taskTitle}
          on:input={onTitleInputChangeHandler}
          readOnly={readonly}
          maxAscii={100} />
      </div>
    </div>
    <div class="flex">
      <div class="left"><Text class="left-person">负责人</Text></div>
      <div class="flex right checkbox">
        {#each bizList as bizList}
          <Checkbox
            labelText={bizList.name}
            value={bizList.id}
            checked={taskUserIdList?.includes(bizList.id)}
            on:change={onbizListSelectedChangeHandler}
            {disabled} />
        {/each}
      </div>
    </div>
    <div class="flex">
      <div class="left"><Text class="left-content">任务要求</Text></div>
      <div class="right textarea-border">
        <TextArea
          id="task-content"
          bind:value={taskContent}
          height="120px"
          on:input={onTaskContentChangeHandler}
          readOnly={readonly}
          maxCount={200}
          class="textarea-resize {readonly ? 'not-allowed' : ''}" />
      </div>
    </div>
    <div class="flex">
      <div class="left"><Text class="left-min-height">日程</Text></div>
      <div class="right date-picker">
        <DatePicker
          bind:valueFrom={startDate}
          bind:valueTo={endDate}
          dateFormat="Y-m-d"
          datePickerType="range"
          short={true}
          on:change={onDatePickerChangeHandler}
          class="date-picker-input">
          <DatePickerInput
            size="sm"
            bind:value={startDate}
            pattern="\\d{4}\\/\\d{2}\\/\\d{2}"
            {disabled} />
          <!-- <span class="date-single">~</span> -->
          <DatePickerInput
            size="sm"
            bind:value={endDate}
            pattern="\\d{4}\\/\\d{2}\\/\\d{2}"
            {disabled} />
        </DatePicker>
      </div>
    </div>
    <div class="flex">
      <div class="left"><Text class="left-min-height">进度</Text></div>
      <div class="right slider">
        <Slider bind:value={taskProgress} on:change={onSliderChangeHandler} />
      </div>
    </div>
    <div class="flex">
      <!-- <div class="flex-div remark-container"> -->
      <div class="left"><Text class="left-remark">备注(完成内容)</Text></div>
      <div class="right {isDisplay ? 'border-bottom' : ''}">
        <div class="remark-checkbox">
          <Checkbox
            labelText="未进行"
            bind:value={modifyFlag}
            checked={undoneFlagchecked}
            on:change={onUndoneFlagCheckedChangeHandler} />
        </div>
        <!-- </div> -->
        <div class=" remark-text-area textarea-border">
          <TextArea
            bind:value={taskRemark}
            on:input={onRemarkContentChangeHandler}
            maxCount={200}
            class="textarea-resize" />
        </div>
      </div>
    </div>
    <div class="flex" id="breakFlag">
      <div class="left"><Text class="left-min-height">中止</Text></div>
      <div class="container right">
        <div style="margin-bottom:-10px">
          <Checkbox
            bind:value={breakFlag}
            bind:checked={breaked}
            on:change={onBreakFlagChangeHandler} />
        </div>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @import "../../../styles/theme/var";
  @import "../../../styles/theme/mixin";

  .max-width {
    width: 100%;
  }

  .button-height {
    height: 30px;
  }

  .flex {
    display: flex;
  }

  .right {
    width: 100%;
    padding: 2px 5px;
    border-right: 1px solid #cacaca;
  }

  .checkbox {
    flex-wrap: wrap;
    padding: 10px 2px;
  }

  .border-top {
    border-top: 1px solid #cacaca;
  }

  :global(.left-remark) {
    height: 188px;
    line-height: 188px;
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

  .container {
    padding-bottom: 10px;
    border-bottom: 1px solid #cacaca;
  }

  .border-bottom {
    border-bottom: 1px solid #cfcfcf;
  }  

  :global(.white-space > .bx--checkbox-wrapper:last-of-type) {
    margin-bottom: 0.25rem;
  }  

  .contant {
    margin-top: 5px;
    margin-right: 8px;
  }  

  :global(.white-space > .bx--checkbox-wrapper) {
    width: 100px;
    background-color: #e6e6e6;
  }

  :global(.title-input > div > div > div > .bx--text-input) {
    background-color: #e6e6e6;
    padding-left: 5px;
    color: #525252;
    font-size: 14px;
  }

  :global(.container > div > div > div > .bx--text-area) {
    border: 1px solid lightgray;
    background-color: #e6e6e6;
    min-height: 120px;
    padding-left: 5px !important;
    padding: 0px;
    font-size: 14px;
    color: #525252;
  }  

  :global(.remark-text-area > div > div > .bx--text-area) {
    background-color: #fff !important;
    cursor: text !important;
  }

  :global(.bx--checkbox:disabled + .bx--checkbox-label) {
    color: #525252;
    cursor: default;
  }  

  :global(.slider > div > div > div > .bx--slider__track) {
    height: 10px;
    max-width: 450px;
    border-radius: 60px;
  }

  :global(.bx--slider__track ~ .bx--slider__filled-track) {
    height: 10px;
    border-radius: 60px;
    background-color: var(--slider-bb-color);
  }

  :global(.bx--slider__track ~ .bx--slider__filled-track:focus) {
    background-color: var(--slider-bb-color);
  }

  :global(.bx--slider__thumb:focus ~ .bx--slider__filled-track) {
    background-color: var(--slider-bb-color);
  }

  .slider {
    padding-left: 10px;
  }

  :global(.slider > div > div > input) {
    border: 1px solid lightgray;
    margin-left: 40px;
    font-size: 14px;
  }

  :global(.slider > div > .bx--slider-container) {
    width: 100%;
  }

  :global(.slider > div > .bx--slider-container > .bx--slider) {
    margin: 0px;
  }

  :global(.slider > div > div > .bx--slider > .bx--slider__thumb) {
    width: 10px;
    height: 10px;
    background-color: var(--slider-bb-color);
  }

  :global(.slider > div > div > .bx--slider > .bx--slider__thumb:focus) {
    box-shadow: 0 0 0 0px #fff;
    background-color: #fff;
    border: 1px solid #cacaca;
  }

  :global(.slider > div > div > .bx--slider > .bx--slider__thumb:active) {
    box-shadow: 0 0 0 0px #fff;
    background-color: #fff;
    border: 1px solid #cacaca;
  }

  :global(.slider > div > div > .bx--slider > .bx--slider__thumb:hover) {
    background-color: #fff;
    border: 1px solid #cacaca;
  }

  :global(.bx--slider__range-label) {
    display: none;
  }

  :global(.date-picker > div > .bx--date-picker) {
    width: 100%;
    height: 30px;    
  }

  :global(
      .date-picker
        > div
        > .bx--date-picker
        > .bx--date-picker-container
        > .bx--date-picker-input__wrapper
        > .bx--date-picker__input
    ) {    
    cursor: default;
    font-size: 14px;
  }

  :global(
      .date-picker
        > div
        > .bx--date-picker
        > .bx--date-picker-container
        > .bx--date-picker-input__wrapper
        > .flatpickr-wrapper
        > .bx--date-picker__input
    ) {
    
    color: #525252;
    cursor: default;
    font-size: 14px;
  }

  :global(
      .date-picker > div > .bx--date-picker > .bx--date-picker-container > div
    ) {
    height: 30px;
    line-height: 30px;
  }
  :global(.bx--date-picker__input:focus) {
    outline: none;
    border: 1px solid #08adaa;
    height: 30px;
  }  

  :global(.flatpickr-day.today.selected) {
    outline: none;
    border: 1px solid #08adaa;    
  }

  :global(.flatpickr-day.endRange.inRange.selected) {
    outline: none;
    border: 1px solid #08adaa;    
  }

  :global(.flatpickr-day.endRange:hover) {
    outline: none;
    border: 1px solid #08adaa;    
  }  

  :global(.bx--date-picker__input:disabled ~ .bx--date-picker__icon) {
    fill: black;
  }

  :global(.not-allowed) {
    cursor: not-allowed;
  }

  :global(
      .date-picker-input
        > div
        > div
        > div
        > div
        > .bx--date-picker__input:disabled
    ) {
    border-bottom: 1px solid #cfcfcf;
    cursor: not-allowed !important;
  }

  :global(
      .date-picker-input > div > div > div > .bx--date-picker__input:disabled
    ) {
    border-bottom: 1px solid #cfcfcf;
    cursor: not-allowed !important;
  }
</style>
