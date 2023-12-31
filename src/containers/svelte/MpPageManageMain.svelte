<!--
/**
 * Summary: MP页面管理
 * Created: 2022/08/24
 * Author1: ljh
 * Author2: kang jiaqi
 * © 2022 iMarketChina Co.,Ltd. All rights reserved.
 */
 -->
<script lang="ts">
  import '@/styles/core/white.css';
  import '@/styles/core/index.scss';
  import { Button, Box, BatchInput, Text, AdvancedSelect, SelectEx } from '@/components/sveltecomponents';
  import Add from 'carbon-icons-svelte/lib/Add.svelte';
  import CustomAlert, { AlertIcon } from '@/components/CustomAlert';
  import Search from 'carbon-icons-svelte/lib/Search.svelte';
  import Reset from 'carbon-icons-svelte/lib/Reset.svelte';
  import pageColumn from '@/components/columns/mpPageManageColumns';
  import { UsersInfo } from '@/vo/userManager/index';
  import { onMount, onDestroy } from 'svelte';
  import pageStore from '@/store/MpPageManageStore';
  import userMgmtMainStore from '@/store/UserMgmtMainStore';
  import { PageManageAlert } from '@/constant/alert/Base';
  import { CreatePop } from '@/components/Popup';
  import { setWaiting, removeWaiting } from '@/utils/loaderUtils';
  import { autorun } from 'mobx';
  import { types, itemPages, managementTypeList } from '@/constant/constant';
  import addPageManager from '@/containers/svelte/popup/addPageManager.svelte';
  import modifyManager from '@/containers/svelte/popup/modifyManager.svelte';
  import { deepClone } from '@/utils/CommonUtils';
  import Storage from '@/utils/Storage';
  import type { GridReadyEvent } from 'ag-grid-community';
  import DataGrid from '@/components/sveltecomponents/DataGrid.svelte';
  import Renderer from '@/constant/Renderer';
  import userInformation from '@/containers/svelte/popup/userInformation.svelte';
  import { UserInfo } from '@/utils/Settings';
  import XLSX from 'xlsx';
  import Download from 'carbon-icons-svelte/lib/Download.svelte';

  let selectedType: string = '';
  let selectedItem: number = 20;
  let searchType: string = 'search';
  let rowData: any[] | null = null;
  let bizList = [];
  let userID: string = '';
  let userName: string = '';
  let pageSize = 20;
  let userIDTotal = 0;
  let userNameTotal = 0;
  let searchInfo: any = {};
  let selectedDeveloperValue = [];
  let selectedItemValue: object = itemPages[0];
  let currentPage = 1;
  let pageCount: number = 10;
  let permissionData: any[] = [];
  let userInformationList: any[] = [];
  const linkCodes = ['code'];
  const labelCodes = ['name', 'developerName'];

  let gridApi: any;

  onMount(() => {
    setWaiting();
    searchBizDebeloper();
    getUserActivePermission();
    getUserList();
    let currentTheme = Storage.getLocalItem('svelte-theme') ?? 'ux-leaf';
    if (currentTheme.includes('-theme')) {
      currentTheme = 'ux-leaf';
    }
    document.body.setAttribute('data-theme', currentTheme);
    window.addEventListener('message', themeChangeHandler, false);
  });

  onDestroy(() => {
    disposer();
    disposerSearch();
    getPermission();
    searchUserList();
    window.removeEventListener('message', themeChangeHandler, false);
  });

  function themeChangeHandler(e: MessageEvent) {
    if (e.data.type === 'theme-changed') {
      document.body.setAttribute('data-theme', e.data.data);
    }
  }

  function getUserActivePermission() {
    const info: string = UserInfo.userId;
    pageStore.getUserActivePermission(info);
  }

  function getUserList() {
    const info: UsersInfo = {};
    info.iPageCount = 100;
    info.iStart = 0;
    userMgmtMainStore.getUserList(info);
  }

  const disposer = autorun(() => {
    if (pageStore.userListResult) {
      const value = deepClone(pageStore.userListResult);
      pageStore.userListResult = null;
      removeWaiting();
      if (!value.error) {
        for (let i = 0; i < value.data.length; i++) {
          value.data[i].text = value.data[i].name;
        }
        bizList = value.data;
      } else {
        CustomAlert(PageManageAlert.INTERNET_ERROR, AlertIcon.ERROR);
      }
    }
  });

  const getPermission = autorun(() => {
    if (pageStore.getUserActivePermissionResult) {
      const permisisonList = deepClone(pageStore.getUserActivePermissionResult);
      pageStore.getUserActivePermissionResult = null;
      removeWaiting();
      if (!permisisonList.error) {
        permissionData = permisisonList.data?.split(',');
      }
    }
  });

  const searchUserList = autorun(() => {
    if (userMgmtMainStore.userListResult) {
      const userList = deepClone(userMgmtMainStore.userListResult);
      if (!userList.error) {
        userInformationList = userList.data;
      }
    }
  });

  const disposerSearch = autorun(() => {
    if (pageStore.getMpPageMgmtListResult) {
      const value = deepClone(pageStore.getMpPageMgmtListResult);
      pageStore.getMpPageMgmtListResult = null;
      removeWaiting();
      if (value.error) {
        CustomAlert(PageManageAlert.INTERNET_ERROR, AlertIcon.ERROR);
        return;
      }
      value.data?.forEach(elem => {
        elem.linkCodes = linkCodes;
        elem.labelCodes = labelCodes;
        if (!elem.developerName || elem.developerName === 'null') {
          elem.developerName = '';
        }
        if (!elem.reviewerName || elem.reviewerName === 'null') {
          elem.reviewerName = '';
        }

        if (!elem.management || elem.management === 'null') {
          elem.management = '';
          elem.managementName = '';
        } else {
          let info = managementTypeList.find(v => v.code === elem.management);
          if (info) {
            elem.managementName = info.name;
          } else {
            elem.managementName = '';
          }
        }
        if (elem.type === 'buyer') {
          elem.typeName = 'Buyer主页';
        } else if (elem.type === 'supplier') {
          elem.typeName = 'Supplier主页';
        } else if (elem.type === 'gerp') {
          elem.typeName = 'GERP主页';
        } else if (elem.type === 'buyerExp') {
          elem.typeName = 'BuyerEXP主页';
        } else if (elem.type === 'main') {
          elem.typeName = 'MP主页';
        } else if (elem.type === 'pop') {
          elem.typeName = 'Popup';
        } else if (elem.type === 'renderer') {
          elem.typeName = 'Renderer';
        }
      });
      if (searchType === 'search') {
        if (value.data.length > 0) {
          pageSize = selectedItem;
        }
        rowData = value.data;
        pageCount = Math.ceil(rowData?.[0]?.totalCount / pageSize);
      } else {
        downloadDataHandler(value.data);
      }
    }
  });

  function downloadDataHandler(data: any[]) {
    let filename = 'MP管理.xlsx';
    data = deepClone(data);
    data.forEach(iData => {
      let reg = /[,]/g;
      for (let n in iData) {
        if (n === 'code') {
          iData['ID'] = iData[n];
          delete iData[n];
        } else if (n === 'name') {
          iData['Name'] = iData[n];
          delete iData[n];
        } else if (n === 'managementName') {
          iData['Management'] = iData[n];
          delete iData[n];
        } else if (n === 'typeName') {
          iData['Type'] = iData[n];
          delete iData[n];
        } else if (n === 'developerName') {
          iData['页面负责人'] = iData[n];
          delete iData[n];
        } else if (n === 'reviewerName') {
          iData['检查负责人'] = iData[n];
          delete iData[n];
        } else {
          delete iData[n];
        }
      }
    });
    let arrHeadTitleName: any[] = [];
    let arrHeadTitleNameWidth: any[] = [{ wpx: 400 }, { wpx: 300 }, { wpx: 200 }, { wpx: 200 }, { wpx: 150 }, { wpx: 150 }];
    let arrTitle: any[] = pageColumn;
    arrTitle.forEach(data => {
      if (data.value) {
        arrHeadTitleName.push(data.value);
      }
    });
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(data, { header: arrHeadTitleName });
    ws['!cols'] = arrHeadTitleNameWidth;
    XLSX.utils.book_append_sheet(wb, ws);
    XLSX.writeFile(wb, filename);
  }

  function searchBizDebeloper() {
    const info: UsersInfo = {};
    info.blockflag = 'N';
    info.usertype = 'U';
    info.iStart = 0;
    info.iPageCount = 10;
    pageStore.getUserList(info);
  }

  function onBtnAddClickHandler() {
    CreatePop('MP管理页面-新增', addPageManager, {}, onBtnCloseHandler, {
      width: '630px',
      height: '680px',
    });
  }

  function onBtnSearchClickHandler() {
    const info: any = {
      code: userID,
      name: userName,
      type: selectedType,
      iStart: 0,
      iPageCount: selectedItem,
    };
    if (selectedDeveloperValue.length > 0) {
      info.developer = selectedDeveloperValue.toString();
    }
    searchType = 'search';
    currentPage = 1;
    searchInfo = info;
    setWaiting();
    pageStore.getMpPageMgmtList(info);
  }

  function onBtnDownLoadClickHandler() {
    if (rowData && rowData.length > 0) {
      searchInfo.iStart = 0;
      searchInfo.iPageCount = 100000;
      searchType = 'download';
      setWaiting();
      pageStore.getMpPageMgmtList(searchInfo);
    }
  }

  function onBtnClearClickHandler() {
    userID = '';
    userName = '';
    selectedItem = 20;
    userIDTotal = 0;
    userNameTotal = 0;
    selectedType = '';
    selectedDeveloperValue = [];
    selectedItemValue = itemPages[0];
  }

  function onBtnLinkHandler(e: any) {
    if (e.field === 'code') {
      CreatePop('MP管理页面-详细', modifyManager, e.value, onBtnCloseHandler, {
        width: '900px',
        height: '700px',
      });
    } else if (e.field === 'developerName') {
      openUserInfoPop(e.value.developerName.split(','), e.value.developer.split(','));
    } else if (e.field === 'reviewerName') {
      openUserInfoPop(e.value.reviewerName.split(','), e.value.reviewer.split(','));
    }
  }

  function onBtnCheckBoxHandler(e: any) {
    e.value.selected = e.value1;
  }

  function onBtnCloseHandler(data: any) {
    if (data === 'Y') {
      if (searchInfo) {
        const info = {
          code: searchInfo.code,
          name: searchInfo.name,
          type: searchInfo.type,
          developer: searchInfo.developer,
          iStart: 0,
          iPageCount: pageSize,
          item: selectedItem,
        };
        pageSize = info.item;
        currentPage = 1;
        searchType = 'search';
        setWaiting();
        pageStore.getMpPageMgmtList(info);
      }
    }
  }

  function openUserInfoPop(labelList, idList) {
    const userInfoList = [];
    idList.forEach(data => {
      userInfoList.push(userInformationList.find(info => info.id === data));
    });
    CreatePop(
      '用户信息',
      userInformation,
      {
        tabName: labelList,
        userInfoList: userInfoList,
      },
      null,
      {
        width: '600px',
        height: '400px',
      }
    );
  }

  function onPageChangeHandler(v: any) {
    const info = {
      code: searchInfo.code,
      name: searchInfo.name,
      type: searchInfo.type,
      developer: searchInfo.developer,
      iStart: (v.detail.page - 1) * pageSize,
      iPageCount: selectedItem,
    };
    currentPage = v.detail.page;
    searchType = 'search';
    setWaiting();
    pageStore.getMpPageMgmtList(info);
  }

  function onTypeSelectHandler(value: any) {
    selectedType = value.code;
  }

  function onDeveloperSelectHandler(value: any) {
    let ValueArr = [];
    value.forEach(data => {
      ValueArr.push(data.id);
    });
    selectedDeveloperValue = ValueArr;
  }

  function onItemSelectHandler(value: any) {
    selectedItem = value.code;
    selectedItemValue = value;
  }

  function onGridReadyHandler(params: GridReadyEvent) {
    gridApi = params.api;
    gridApi?.addEventListener(Renderer.Renderer_LinkButton, onBtnLinkHandler);
    gridApi?.addEventListener(Renderer.Renderer_Select_Check_Box, onBtnCheckBoxHandler);
  }
</script>

<Box column class="outter">
  <Box column class="grid-x  mp-top-box">
    <Box f={1} class="grid-x margin-bottom" verticalAlign="middle">
      <Box width="427px" height="30px">
        <Box width="60px" className="main-text" verticalAlign="middle" horizontalAlign="compact">
          <Text>ID</Text>
        </Box>
        <Box f={1} class="mp-input-box">
          <BatchInput bind:value={userID} bind:dataTotal={userIDTotal} mode={1} />
        </Box>
      </Box>
      <Box width="50px" />
      <Box f={1} height="30px" width="320px">
        <Box width="50px" className="main-text" verticalAlign="middle">
          <Text>Name</Text>
        </Box>
        <Box f={1} class="mp-input-box ">
          <BatchInput bind:value={userName} bind:dataTotal={userNameTotal} />
        </Box>
      </Box>
      <Box width="50px" />
      <Box f={1} class="box-width">
        <Box width="44px" className="main-text" verticalAlign="middle">
          <Text>Type</Text>
        </Box>
        <Box f={1} class="ul-top main-advancedSelect">
          <SelectEx options={types} onSubmit={v => onTypeSelectHandler(v)} bind:value={selectedType} />
        </Box>
      </Box>
      <Box f={1} class="margin-left-Max box-width">
        <Box width="82px" className="main-text" verticalAlign="middle">
          <Text>页面负责人</Text>
        </Box>
        <Box f={1} flexDisplay={false} width="auto" class="main-advancedSelect select-height" horizontalAlign="left" verticalAlign="middle">
          <SelectEx options={bizList} onSubmit={v => onDeveloperSelectHandler(v)} bind:value={selectedDeveloperValue} multiple valueField="id" />
        </Box>
      </Box>
    </Box>
  </Box>
  <Box class="margin-bottom ">
    <Box f={2} horizontalAlign="left">
      {#if permissionData?.includes('M_A')}
        <Button
          class="button-normal button-main-style margin_top_s margin_right"
          size="small"
          kind="tertairy"
          icon={Add}
          on:click={onBtnAddClickHandler}>新增</Button
        >
      {/if}
      <Button class="button-normal button-main-style margin_top_s" size="small" kind="tertairy" icon={Download} on:click={onBtnDownLoadClickHandler}
        >下载</Button
      >
    </Box>
    <Box f={1} horizontalAlign="right" class="ul-top">
      <Box class="itemStyle margin_top_s selected-height">
        <AdvancedSelect options={itemPages} bind:value={selectedItemValue} onSubmit={v => onItemSelectHandler(v)} />
      </Box>
      <Button kind="tertairy" icon={Search} class="button-normal margin_right margin_top_s button-main-style" on:click={onBtnSearchClickHandler}
        >SEARCH</Button
      >
      <Button kind="tertairy" icon={Reset} class="button-normal margin_top_s button-main-style" on:click={onBtnClearClickHandler}>RESET</Button>
    </Box>
  </Box>
  <DataGrid
    id="page-mgmt-Grid"
    columnDefs={pageColumn}
    {rowData}
    {pageCount}
    {currentPage}
    onPageChange={onPageChangeHandler}
    onGridReady={onGridReadyHandler}
  />
</Box>

<style lang="scss">
  @import '../../styles/theme/var';
  @import '../../styles/theme/mixin';

  :global(.outter) {
    display: flex !important;
    flex-direction: column !important;
    width: auto;
    height: 100% !important;
    min-width: 1422px;
  }

  :global(.mp-top-box) {
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #cacaca;
    padding: 10px 0px;
  }

  :global(.tr-height > table > thead > tr) {
    height: 35px;
    line-height: 35px;
  }

  :global(.dataTable) {
    min-width: 1203px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  :global(.tr-height > table > tbody > tr) {
    height: 35px;
    line-height: 35px;
  }

  :global(.main-bottom > .pagination-nav > .option.prev) {
    margin-top: 3px;
  }

  :global(.main-bottom > .pagination-nav > .option.next) {
    margin-top: 3px;
  }

  :global(.selected-height) {
    height: 30px !important;
  }

  :global(.button-normal) {
    font-size: 13px;
    font-family: 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif, '微软雅黑';
    color: #08adaa;
  }

  :global(.button-normal:hover) {
    background-color: #08adaa;
  }

  :global(.button-main-style) {
    height: 30px !important;
  }

  :global(.select-height > div > .svelte-select-list) {
    min-height: 290px;
  }

  :global(.batchInput input) {
    height: 30px !important;
  }

  :global(.selected-height > div) {
    min-height: 30px !important;
    line-height: 30px;
    border-radius: 0% !important;
    font-size: 13px !important;
    cursor: pointer !important;
  }

  :global(.main-advancedSelect > div) {
    min-height: 28px !important;
    line-height: 28px;
    border-radius: 0% !important;
    font-size: 12px !important;
    cursor: pointer !important;
    padding-right: 10px;
  }

  :global(.clear-select.svelte-fpyony.svelte-fpyony.svelte-fpyony) {
    width: var(--clear-icon-width, 15px);
    height: var(--clear-icon-width, 15px);
    color: var(--clear-icon-color, #595959);
    margin-right: 13px;
  }

  :global(.batch-input-z-index > div) {
    width: 100% !important;
  }

  :global(option) {
    box-shadow: 0 0 10px 100px #1882a8 inset;
  }

  :global(.mp-input-box, .mp-input-box > div, .mp-input-box input) {
    width: 100% !important;
  }

  :global(.mp-input-box > div > div > div > div > .bx--text-input) {
    line-height: 30px;
  }
</style>
