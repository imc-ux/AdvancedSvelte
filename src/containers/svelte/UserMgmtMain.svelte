<!--
/**
 * Summary: 用户信息管理
 * Created: 2023/05/16
 * Author1: wangrui
 * Author2:
 */
-->
<script lang="ts">
  import "@/styles/core/white.css";
  import "@/styles/core/index.scss";
  import { autorun } from "mobx";
  import { onMount, onDestroy } from "svelte";
  import Storage, { StorageType } from "@/utils/Storage";
  import {
    AdvancedSelect,
    Button,
    Input,
    Text,
  } from "@/components/sveltecomponents";
  import DataGrid from "@/components/sveltecomponents/DataGrid.svelte";
  import Add from "carbon-icons-svelte/lib/Add.svelte";
  import Save from "carbon-icons-svelte/lib/Save.svelte";
  import Search from "carbon-icons-svelte/lib/Search.svelte";
  import Reset from "carbon-icons-svelte/lib/Reset.svelte";
  import Download from "carbon-icons-svelte/lib/Download.svelte";
  import userMgmtColumns from "@/components/columns/userMgmtMainColumns";
  import { userTypeList, blockFlagList, items } from "@/constant/constant";
  import userMgmtMainStore from "@/store/UserMgmtMainStore";
  import { PermissionInfo, UsersInfo } from "@/vo/userManager";
  import { UserInfo } from "@/utils/Settings";
  import { deepClone } from "@/utils/CommonUtils";
  import CustomAlert, { AlertIcon } from "@/components/CustomAlert";
  import { UserMgmtMainAlert } from "@/constant/alert/user";
  import { removeWaiting, setWaiting } from "@/utils/loaderUtils";
  import { GridApi, GridReadyEvent } from "ag-grid-community";
  import RENDERER_EVENT from "@/constant/Renderer";
  import XLSX from "xlsx";
  import { CreatePop } from "@/components/Popup";
  import ModifyUser from "./popup/modifyUser.svelte";
  import AddUser from "./popup/AddUser.svelte";
  import { getImagesServerUrl } from "@/utils/CommonUtils";

  let userId = "";
  let userName = "";
  let userTypeCodeSelected = "";
  let userTypeSelected = null;
  let blockFlagCodeSelected = "N";
  let blockFlagSelected = blockFlagList[2];
  let rowData: any[] | null = null;
  let itemCodeSelected = 20;
  let itemSelected = items[0];
  let currentPage = 0;
  let pageCount = 0;
  let pageSize = 20;
  let gridApi: any;
  let selectedRows: any[] | null = [];
  let selectedArr: any[] = [];
  let arrHeadTitleNameWidth: any[] = [];
  let arrHeadTitleName: any[] = [];
  let searchInfo = null;
  let permissionData: any[] = [];

  onMount(() => {
    userTypeCodeSelected = "U";
    userTypeSelected = userTypeList[1];
    let currentTheme = Storage.getLocalItem("svelte-theme") ?? "ux-leaf";
    if (currentTheme.includes("-theme")) {
      currentTheme = "ux-leaf";
    }
    document.body.setAttribute("data-theme", currentTheme);
    window.addEventListener("message", themeChangeHandler, false);

    let loginUserInfo = Storage.getSessionItem(StorageType.UserName);
    if (loginUserInfo === null || loginUserInfo === "") {
      window.location.href = "login.html";
    } else {
      setWaiting();
      getUserActivePermission();
    }
  });

  onDestroy(() => {
    window.removeEventListener("message", themeChangeHandler, false);
    getUserActivePermissionList();
    searchUserList();
    modifyUserMulti();
    gridApi?.remove(RENDERER_EVENT.Render_Select, onSelectChangeHandler);
    gridApi?.remove(
      RENDERER_EVENT.Renderer_Select_Check_Box,
      onRowsCheckedHandler
    );
    gridApi?.addEventListener(
      RENDERER_EVENT.Renderer_LinkButton,
      onOpenModifyPopupHandler
    );
  });

  const getUserActivePermissionList = autorun(() => {
    if (userMgmtMainStore.getUserActivePermissionResult) {
      const permissionList = deepClone(
        userMgmtMainStore.getUserActivePermissionResult
      );
      removeWaiting();
      if (!permissionList.error) {
        permissionData = permissionList.data.split(",");
      }
    }
  });

  const searchUserList = autorun(() => {
    if (userMgmtMainStore.userListResult) {
      const userList = deepClone(userMgmtMainStore.userListResult);
      removeWaiting();
      if (!userList.error) {
        rowData = userList.data;
        rowData.forEach((value) => {
          if (value.usertype === "U") {
            value.show = "前台";
          } else if (value.usertype === "P") {
            value.show = "后台";
          } else {
            value.show = "";
          }
          if (value.figure === "figures/figure000.jpg") {
            value.display = false;
          } else {
            value.display = true;
          }
        });
        pageSize = itemCodeSelected;
        pageCount = Math.ceil(userList.data?.[0]?.totalCount / pageSize);
        rowData.forEach((i) => {
          i.selected = false;
          i.password = i.password.toLocaleUpperCase();
        });
      }
    }
  });

  const modifyUserMulti = autorun(() => {
    if (userMgmtMainStore.modifyUserMultiResult) {
      const modifyUserList = deepClone(userMgmtMainStore.modifyUserMultiResult);
      removeWaiting();
      if (!modifyUserList.error) {
        CustomAlert(
          UserMgmtMainAlert.MODIFY_USER_MULTI_SUCCESS,
          AlertIcon.SUCCESS
        );
        onSearchBtnClickHandler();
      } else {
        CustomAlert(UserMgmtMainAlert.INTERNET_ERROR, AlertIcon.ERROR);
      }
    }
  });

  function themeChangeHandler(e: MessageEvent) {
    if (e.data.type === "theme-changed") {
      document.body.setAttribute("data-theme", e.data.data);
    }
  }

  function getUserActivePermission() {
    const info = UserInfo.userId;
    userMgmtMainStore.getUserActivePermission(info);
  }

  function onIdChangeHandler(event: CustomEvent) {
    userId = event.detail.data;
  }

  function onNameChangeHandler(event: CustomEvent) {
    userName = event.detail.data;
  }

  function onUserTypeSelectedHandler(e: any) {
    userTypeCodeSelected = e.id;
    userTypeSelected = e;
  }

  function onBlockFlagSelectedHandler(e: any) {
    blockFlagSelected = e;
    blockFlagCodeSelected = e.id;
  }

  function onItemSelectedHandler(e: any) {
    itemSelected = e;
    itemCodeSelected = e.code;
  }

  function onSaveBtnClickHandler() {
    rowData?.forEach((row) => {
      if (row.selected) {
        selectedRows.push(row);
      } else {
        selectedRows = selectedRows.filter((value) => value.id !== row.id);
      }
    });
    if (!selectedRows?.length) {
      CustomAlert(UserMgmtMainAlert.SELECTED_NO_ROWS, AlertIcon.ERROR);
      return;
    } else {
      userMgmtMainStore.modifyUserMulti(selectedRows);
    }
  }

  function onDataDownLoadHandler() {
    if (!rowData?.length) {
      CustomAlert(UserMgmtMainAlert.PLEASE_SEARCH_DATA, AlertIcon.ERROR);
      return;
    } else {
      onDownLoadBtnClickHandler(rowData);
    }
  }

  function onDownLoadBtnClickHandler(data: any[]) {
    const filename = "用户信息.xlsx";
    data = JSON.parse(JSON.stringify(data));
    data.forEach((row) => {
      if (row.usertype === "U") {
        row.usertype = "前台";
      }
      if (row.usertype === "P") {
        row.usertype = "后台";
      }
      if (row.figure) {
        row.figure = getImagesServerUrl() + row.figure;
      }
      changedKeys(row, "id", "ID");
      changedKeys(row, "name", "姓名");
      changedKeys(row, "usertype", "类型");
      changedKeys(row, "blockflag", "注销");
      changedKeys(row, "figure", "头像");
      changedKeys(row, "ip", "IP");
      dataDownloadChoose(row);
    });
    userMgmtColumns.forEach((value) => {
      if (value.headerName) {
        if (value.headerName === "头像") {
          value.width = 450;
        }
        if (!arrHeadTitleName.some((i) => i === value.headerName)) {
          arrHeadTitleName.push(value.headerName);
          arrHeadTitleNameWidth.push({ wpx: value.width });
        }
      }
    });
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(data, { header: arrHeadTitleName });
    ws["!cols"] = arrHeadTitleNameWidth;
    XLSX.utils.book_append_sheet(wb, ws);
    XLSX.writeFile(wb, filename);
  }

  function changedKeys(data: any, from: string, to: string) {
    data[to] = data[from];
    delete data[from];
  }

  function dataDownloadChoose(data: any) {
    for (let key in data) {
      if (
        key !== "ID" &&
        key !== "姓名" &&
        key !== "类型" &&
        key !== "注销" &&
        key !== "头像" &&
        key !== "IP"
      ) {
        delete data[key];
      }
    }
  }

  function onAddBtnClickHandler() {
    CreatePop("新增用户", AddUser, {}, onClosePopHandler, {
      width: "600px",
      height: "450px",
    });
  }

  function onSearchBtnClickHandler() {
    const info: UsersInfo = {};
    info.iStart = 0;
    info.iPageCount = itemCodeSelected;
    if (userId.trim()) {
      info.id = userId.trim();
    }
    if (userName.trim()) {
      info.name = userName.trim();
    }
    if (userTypeCodeSelected) {
      info.usertype = userTypeCodeSelected;
    }
    if (blockFlagCodeSelected) {
      info.blockflag = blockFlagCodeSelected;
    }
    searchInfo = info;
    currentPage = 0;
    setWaiting();
    userMgmtMainStore.getUserList(info);
  }

  function onPageChange(e: CustomEvent) {
    const info: UsersInfo = {};
    info.iStart = e.detail.page * pageSize;
    info.iPageCount = itemCodeSelected;
    if (userId.trim()) {
      info.id = userId.trim();
    }
    if (userName.trim()) {
      info.name = userName.trim();
    }
    if (userTypeCodeSelected) {
      info.usertype = userTypeCodeSelected;
    }
    if (blockFlagCodeSelected) {
      info.blockflag = blockFlagCodeSelected;
    }
    currentPage = e.detail.page;
    userMgmtMainStore.getUserList(info);
  }

  function onResetBtnClickHandler() {
    userId = "";
    userName = "";
    blockFlagCodeSelected = "N";
    blockFlagSelected = blockFlagList[2];
    itemCodeSelected = 20;
    itemSelected = items[0];
    userTypeCodeSelected = "U";
    userTypeSelected = userTypeList[1];
  }

  function onGridReady(params: GridReadyEvent) {
    gridApi = params.api;
    gridApi?.addEventListener(
      RENDERER_EVENT.Render_Select,
      onSelectChangeHandler
    );
    gridApi?.addEventListener(
      RENDERER_EVENT.Renderer_Select_Check_Box,
      onRowsCheckedHandler
    );
    gridApi?.addEventListener(
      RENDERER_EVENT.Renderer_LinkButton,
      onOpenModifyPopupHandler
    );
  }

  function onSelectChangeHandler(e) {
    e.detail.newValue = e.value.id;
    selectedArr.push(e.detail);
    e.detail.data.selected = true;
    e.detail.data[e.detail.column.colId] = e.detail.newValue;
    const params = {
      force: true,
    };
    gridApi.refreshCells(params);
  }

  function onRowsCheckedHandler(e) {
    if (e.value1 !== undefined) {
      e.value.selected = e.value1;
    }
  }

  function onOpenModifyPopupHandler(e) {
    CreatePop("修改用户信息", ModifyUser, e.value, onClosePopHandler, {
      width: "600px",
      height: "500px",
    });
  }

  function onClosePopHandler(data: string) {
    if (data === "Y") {
      if (searchInfo) {
        setWaiting();
        currentPage = 0;
        userMgmtMainStore.getUserList(searchInfo);
      }
    }
  }
</script>

<div style="display: flex; flex-direction:column;height:100%">
  <div class="flex search">
    <div class="vertical-align">
      <div class="user-type-margin"><Text>用户类型</Text></div>
      <div class="flex-residue" style="width: 450px;">
        <AdvancedSelect
          optionIdentifier="id"
          labelIdentifier="value"
          options={userTypeList}
          bind:value={userTypeSelected}
          onSubmit={onUserTypeSelectedHandler}
        />
      </div>
    </div>
    <div class="vertical-align flex-residue">
      <div class="text-margin"><Text>ID</Text></div>
      <div class="flex-residue">
        <Input bind:value={userId} on:Input={onIdChangeHandler} />
      </div>
    </div>
    <div class="vertical-align flex-residue">
      <div class="text-margin"><Text>姓名</Text></div>
      <div class="flex-residue">
        <Input bind:value={userName} on:Input={onNameChangeHandler} />
      </div>
    </div>
    <div class="vertical-align flex-residue">
      <div class="text-margin"><Text>block</Text></div>
      <div class="flex-residue">
        <AdvancedSelect
          optionIdentifier="id"
          labelIdentifier="value"
          bind:value={blockFlagSelected}
          options={blockFlagList}
          onSubmit={onBlockFlagSelectedHandler}
        />
      </div>
    </div>
  </div>
  <div class="flex  ">
    <div class="flex button-left">
      {#if permissionData.includes("U_B")}
        <div id="save">
          <Button
            class="button-normal button-text-vertical-align"
            size="small"
            kind="tertiary"
            icon={Save}
            on:click={onSaveBtnClickHandler}>保存</Button
          >
        </div>
      {/if}

      <div class="button-margin-left">
        <Button
          class="button-normal button-text-vertical-align"
          size="small"
          kind="tertiary"
          icon={Download}
          on:click={onDataDownLoadHandler}>下载</Button
        >
      </div>

      {#if permissionData.includes("U_A")}
        <div id="addNewUser" class="button-margin-left">
          <Button
            class="button-normal button-text-vertical-align"
            size="small"
            kind="tertiary"
            icon={Add}
            on:click={onAddBtnClickHandler}>新增用户</Button
          >
        </div>
      {/if}
    </div>
    <div class="flex  flex-residue" style="justify-content:flex-end ;">
      <div class="select-width button-margin-right">
        <AdvancedSelect
          options={items}
          bind:value={itemSelected}
          onSubmit={onItemSelectedHandler}
        />
      </div>
      <div class="button-margin-right">
        <Button
          class="button-normal button-text-vertical-align"
          size="small"
          kind="tertiary"
          icon={Search}
          on:click={onSearchBtnClickHandler}>SEARCH</Button
        >
      </div>
      <div>
        <Button
          class="button-normal button-text-vertical-align"
          size="small"
          kind="tertiary"
          icon={Reset}
          on:click={onResetBtnClickHandler}>RESET</Button
        >
      </div>
    </div>
  </div>
  <div class="flex-residue">
    <DataGrid
      columnDefs={userMgmtColumns}
      {rowData}
      {currentPage}
      {pageCount}
      {onPageChange}
      {onGridReady}
      headerRows={2}
    />
  </div>
</div>

<style>
  .flex {
    display: flex;
  }

  .search {
    width: 100%;
    height: 50px;
  }

  .flex-residue {
    flex: 1;
  }

  .text-margin {
    margin: 0px 5px 0px 30px;
  }

  .user-type-margin {
    margin: 0px 5px 0px 0px;
  }

  .vertical-align {
    display: flex;
    align-items: center;
  }

  .button-left {
    width: 50%;
    justify-content: flex-start;
  }

  .select-width {
    width: 140px;
  }

  .button-margin-left {
    margin-left: 5px;
  }

  .button-margin-right {
    margin-right: 5px;
  }

  :global(.button-text-vertical-align) {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  :global(.flex-residue > .svelte-select) {
    min-height: 30px !important;
  }

  :global(.select-width > .svelte-select) {
    min-height: 30px !important;
  }
</style>
