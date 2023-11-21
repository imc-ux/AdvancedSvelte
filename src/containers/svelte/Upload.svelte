<!--
/**
 * Summary: 上传系统
 * Created: 2022/07/06
 * Author1: ljh
 * Author2: kang jiaqi
 * © 2022 iMarketChina Co.,Ltd. All rights reserved.
 */
 -->
<script lang="ts">
  import '@/styles/core/white.css';
  import '@/styles/core/index.scss';
  import Add from 'carbon-icons-svelte/lib/Add.svelte';
  import FolderParent from 'carbon-icons-svelte/lib/FolderParent.svelte';
  import Download from 'carbon-icons-svelte/lib/Download.svelte';
  import Checkmark from 'carbon-icons-svelte/lib/Checkmark.svelte';
  import Collaborate from 'carbon-icons-svelte/lib/Collaborate.svelte';
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
  import Search from 'carbon-icons-svelte/lib/Search.svelte';
  import Reset from 'carbon-icons-svelte/lib/Reset.svelte';
  import Close from 'carbon-icons-svelte/lib/Close.svelte';
  import type { GridReadyEvent } from 'ag-grid-community';
  import { onMount, onDestroy } from 'svelte';
  import { Checkbox } from 'carbon-components-svelte';
  import { Button, Box, Text, AdvancedSelect, BatchInput } from '@/components/sveltecomponents';
  import { IconButton } from '@/components/renderers/index';
  import uploadSveletColumn from '@/components/columns/uploadColumnsSvelte';
  import pageStore from '@/store/UploadStore';
  import userMgmtMainStore from '@/store/UserMgmtMainStore';
  import { autorun } from 'mobx';
  import CustomAlert, { AlertIcon } from '@/components/CustomAlert';
  import { UsersInfo } from '@/vo/userManager/index';
  import { JtracListSearchInfo, JtracInfo } from '@/vo/uploadManager/index';
  import { CreatePop } from '@/components/Popup';
  import AddJtrac from '@/containers/svelte/popup/AddJtrac.svelte';
  import conflictdetail from '@/containers/svelte/popup/conflictdetail.svelte';
  import filelist from '@/containers/svelte/popup/filelist.svelte';
  import userInformation from '@/containers/svelte/popup/userInformation.svelte';
  import jtraclist from '@/containers/svelte/popup/jtraclist.svelte';
  import fileDetail from '@/containers/svelte/popup/fileDetail.svelte';
  import DataGrid from '@/components/sveltecomponents/DataGrid.svelte';
  import { itemPages, systemTypeList } from '@/constant/constant';
  import XLSX from 'xlsx';
  import { UserInfo, JTRAC_TITLE, JTRAC_TITLE_H5 } from '@/utils/Settings';
  import { setWaiting, removeWaiting } from '@/utils/loaderUtils';
  import { UploadAlert } from '@/constant/alert/upload';
  import { deepClone } from '@/utils/CommonUtils';
  import Renderer from '@/constant/Renderer';
  import Storage from '@/utils/Storage';
  import { DateInput } from 'date-picker-svelte';
  import { format, subMonths } from 'date-fns';

  let dateFrom: Date = new Date();
  let dateTo: Date = new Date();
  let initDateFrom: Date = new Date();
  let initDateTo: Date = new Date();
  let dateFromStr: string = '';
  let dateToStr: string = '';
  let selectedUploader: string = '';
  let jtracNo: string = '';
  let modules: string = '';
  let searchType: string = '';
  let checkedItem: string = '已传45';
  let exModules: string = '/main/index.js,/main/runtime.js'; //"/main/index.js,/main/runtime.js,/main/common.js,/menu/index.js";
  let jtracNoTotal: number = 0;
  let moduleTotal: number = 0;
  let exModuleTotal: number = 2;
  let page: number = 1;
  let searchSign: boolean = false;
  let selectedPageSize: number = 20;
  let totalSign: boolean = false;
  let downloadSearchSign: boolean = false;
  let dateEmpty: boolean = false;
  let uploaderList: any[] = [];
  let rowData: any[] = [];
  let searchData: any[] = [];
  let downloadData: any[] = [];
  let allData: any[] = [];
  let permissionData: any[] = [];
  let arrHeadTitleNameWidth: any[] = [];
  let arrHeadTitleName: any[] = [];
  let userInformationList: any[] = [];
  let checkBoxArr: any[] = [
    { defaultValue: '待检查', checked: true },
    { defaultValue: '待上传', checked: true },
    { defaultValue: '已传45', checked: true },
    { defaultValue: '已传IDC', checked: false },
  ];
  let searchInfo: any = {};
  let selectedUploaderValue: any = null;
  let selectedPageSizeValue: any = itemPages[0];
  let currentPage: number = 0;
  let pageCount: number = 10;
  let gridApi: any;

  onMount(() => {
    let currentTheme = Storage.getLocalItem('svelte-theme') ?? 'ux-leaf';
    if (currentTheme.includes('-theme')) {
      currentTheme = 'ux-leaf';
    }
    document.body.setAttribute('data-theme', currentTheme);
    window.addEventListener('message', themeChangeHandler, false);
    const date = new Date();
    dateFrom = subMonths(date, 3);
    dateTo = date;
    initDateFrom = dateFrom;
    initDateTo = dateTo;
    setWaiting();
    searchUploader();
    getUserActivePermission();
    getUserList();
  });

  onDestroy(() => {
    uploader();
    getUserActivePermissionList();
    upLoadListSearch();
    UpdateStatus();
    upLoadListDelete();
    searchUserList();
    window.removeEventListener('message', themeChangeHandler, false);
  });

  function themeChangeHandler(e: MessageEvent) {
    if (e.data.type === 'theme-changed') {
      document.body.setAttribute('data-theme', e.data.data);
    }
  }

  const uploader = autorun(() => {
    if (pageStore.userListResult) {
      const value = deepClone(pageStore.userListResult);
      pageStore.userListResult = null;
      removeWaiting();
      if (!value.error) {
        uploaderList = value.data;
        const user: any = {
          blockFlag: '',
          id: '',
          name: '--请选择--',
          password: '',
          permissionGroup: '',
          userType: '',
        };
        uploaderList.unshift(user);
        selectedUploaderValue = uploaderList[0];
      } else {
        CustomAlert(UploadAlert.INTERNET_ERROR, AlertIcon.ERROR);
      }
    }
  });

  const getUserActivePermissionList = autorun(() => {
    if (pageStore.getUserActivePermissionResult) {
      const value = deepClone(pageStore.getUserActivePermissionResult);
      pageStore.getUserActivePermissionResult = null;
      removeWaiting();
      if (!value.error) {
        permissionData = value.data.split(',');
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

  const upLoadListSearch = autorun(() => {
    if (pageStore.searchUniqJtracListResult) {
      const value = deepClone(pageStore.searchUniqJtracListResult);
      pageStore.searchUniqJtracListResult = null;
      removeWaiting();
      if (!value.error) {
        let ac = [];
        let bc = [];
        let cc = [];
        value.data?.forEach((elem: any) => {
          elem.selected = false;
          elem.id = elem.nid;
          elem.isDetail = true;
          elem.createDate = elem.createDate?.substr(0, 19);
          elem.reviewerName = uploaderList?.find(v => v.id === elem.reviewer)?.name;
          if (!elem.labelList || elem.labelList === 'null') {
            elem.labelList = '';
          }
          if (elem.labelList) {
            cc = elem.labelList.split(',');
            elem.labelListChange = `(${cc.length})${cc[0]}`;
          } else {
            elem.labelListChange = '';
          }
          if (elem.fileList.lastIndexOf(',') === elem.fileList.length - 1) elem.fileList = elem.fileList.slice(0, elem.fileList.length - 1);
          if (elem.moduleList.lastIndexOf(',') === elem.moduleList.length - 1) elem.moduleList = elem.moduleList.slice(0, elem.moduleList.length - 1);
          ac = elem.fileList.split(',');
          elem.fileListChange = `(${ac.length})${ac[0]}`;
          elem.srFileList = elem.fileList.replace(/,/g, '\r');
          bc = elem.moduleList.replace(/\r/g, ',').split(',');
          elem.moduleListChange = `(${bc.length})${bc[0]}`;
          if (elem.status === 'R') {
            elem.statusChange = '待检查';
          } else if (elem.status === 'A') {
            elem.statusChange = '待上传';
          } else if (elem.status === 'B') {
            elem.statusChange = '已传45';
          } else {
            elem.statusChange = '已传IDC';
          }
          elem.versionLists = elem.versionList.split(',');
          elem.systemTypeLists = elem.systemTypes.split(',');
          elem.versionNo = '';
          if (elem.versionLists.length > 1) {
            if (elem.systemTypeLists.length === elem.versionLists.length) {
              for (let i = 0; i < elem.versionLists.length; i++) {
                let systemStr = systemTypeList.find(v => v.id === elem.systemTypeLists[i])?.imk;
                elem.versionNo += systemStr + ':' + elem.versionLists[i] + ' ';
              }
            } else {
              elem.versionNo = elem.systemTypeLists.toString() + elem.versionList.toString();
            }
          } else {
            elem.versionNo = elem.systemTypes + ':' + elem.versionList;
          }
          if (elem.bizDeveloperName === null || elem.bizDeveloperName === '' || elem.bizDeveloperName === 'null') {
            elem.bizDeveloperName = '';
          }
          if (!elem.systemTypes || String(elem.systemTypes) === 'null') {
            elem.systemTypes = '';
          }
          if (!elem.systemType || String(elem.systemType) === 'null') {
            elem.systemType = '';
          }
          if (!elem.version || String(elem.version) === 'null') {
            elem.version = '';
          }
          if (!elem.detail || String(elem.detail) === 'null') {
            elem.detail = '';
          }
          elem.conflictFiles = '';
          elem.detailFlag = false;
          if (elem.JtracRepeatNum > 1) {
            const multModules: any[] = [];
            const sourceModules = elem.moduleList.replace(/\r/g, ',').split(',');
            sourceModules.forEach(data => {
              if (!multModules.includes(data) && data) {
                multModules.push(data);
              }
            });
            elem.moduleListChange = `(${multModules.length})${multModules[0]}`;
            elem.moduleList = multModules.join(',');
            elem.srModuleList = elem.moduleList.replace(/,/g, '\r');
            elem.detailFlag = true;
            let labelModules: any[] = [];
            if (elem.labelList) {
              let sourceLabelModules = elem.labelList.split(',');
              sourceLabelModules.forEach(data => {
                if (!isInArray(labelModules, data) && data !== '') {
                  labelModules.push(data);
                }
              });
              elem.labelListChange = `(${labelModules.length})${labelModules[0]}`;
              elem.labelList = labelModules.join(',');
            }
          } else {
            elem.srModuleList = elem.moduleList.replace(/,/g, '\r');
          }
        });
        if (searchType === 'search') {
          if (!totalSign) {
            searchData = value.data;
            // 2次查询
            totalSign = true;
            let request: JtracListSearchInfo = {};
            request.status = 'B';
            request.jtracUniqFlag = 'Y';
            request.iStart = 0;
            request.iPageCount = 10000;
            searchType = 'search';
            setWaiting();
            pageStore.searchUniqJtracList(request);
          } else {
            allData = copyArr(value.data);
            searchData = getConflictFile(allData, searchData);
            totalSign = false;
            searchType = '';
            rowData = searchData;
            searchSign = true;
          }
          pageCount = Math.ceil(rowData?.[0]?.totalCount / selectedPageSizeValue.code);
        } else if (searchType === 'download') {
          if (!downloadSearchSign) {
            downloadData = value.data;
            // 2次查询
            downloadSearchSign = true;
            let request: JtracListSearchInfo = {};
            request.status = 'B';
            request.jtracUniqFlag = 'Y';
            request.iStart = 0;
            request.iPageCount = 10000;
            searchType = 'download';
            setWaiting();
            pageStore.searchUniqJtracList(request);
          } else {
            allData = copyArr(value.data);
            downloadData = getConflictFile(allData, downloadData);
            searchType = '';
            downloadDataHandler(downloadData);
          }
        }
      } else {
        CustomAlert(UploadAlert.INTERNET_ERROR, AlertIcon.ERROR);
      }
    }
  });

  const UpdateStatus = autorun(() => {
    if (pageStore.updateMultJtracStatusResult) {
      const value = deepClone(pageStore.updateMultJtracStatusResult);
      pageStore.updateMultJtracStatusResult = null;
      removeWaiting();
      if (!value.error) {
        CustomAlert(UploadAlert.UPDATE_SUCCESS, AlertIcon.SUCCESS);
        onBtnSearchClickHandler();
      } else {
        CustomAlert(value.msg, AlertIcon.ERROR);
      }
    }
  });

  const upLoadListDelete = autorun(() => {
    if (pageStore.deleteJtracInfoResult) {
      const value = deepClone(pageStore.deleteJtracInfoResult);
      pageStore.deleteJtracInfoResult = null;
      removeWaiting();
      if (!value.error) {
        CustomAlert(UploadAlert.DELETE_SUCCESS, AlertIcon.SUCCESS);
        onBtnSearchClickHandler();
      } else {
        CustomAlert(value.msg, AlertIcon.ERROR);
      }
    }
  });

  function searchUploader() {
    const info: UsersInfo = {};
    info.blockflag = 'N';
    info.usertype = 'U';
    info.iStart = 0;
    info.iPageCount = 20;
    setWaiting();
    pageStore.getUserList(info);
  }

  function getUserActivePermission() {
    const info = UserInfo.userId;
    setWaiting();
    pageStore.getUserActivePermission(info);
  }

  function getUserList() {
    const info: UsersInfo = {};
    info.iPageCount = 100;
    info.iStart = 0;
    userMgmtMainStore.getUserList(info);
  }

  function onBtnAddJtracClickHandler() {
    CreatePop('新增Jtrac', AddJtrac, {}, onPopCloseSearchHandler, {
      width: '750px',
      height: '500px',
    });
  }

  function onPopCloseSearchHandler(data: string) {
    if (data === 'Y') {
      if (searchInfo) {
        onBtnSearchClickHandler();
      }
    }
  }

  function onBtnSearchClickHandler() {
    totalSign = false;
    const info: JtracListSearchInfo = {
      dateFrom: dateFrom ? format(dateFrom, 'yyyy-MM-dd') : '',
      dateTo: dateTo ? format(dateTo, 'yyyy-MM-dd') : '',
      status: getStatus(checkBoxArr),
      clientDeveloperId: selectedUploader,
      jtracNo: jtracNo,
      modules: modules,
      jtracUniqFlag: 'Y',
      iStart: 0,
      iPageCount: selectedPageSize,
    };
    page = 1;
    currentPage = 0;
    searchInfo = info;
    searchType = 'search';
    setWaiting();
    pageStore.searchUniqJtracList(info);
  }

  function getStatus(data: any[]): string {
    let arr: any[] = [];
    data.forEach(ele => {
      if (ele.checked) {
        arr.push(ele.defaultValue);
      }
    });
    const statusArr: any[] = [];
    if (arr.includes('待检查')) {
      statusArr.push('R');
    }
    if (arr.includes('待上传')) {
      statusArr.push('A');
    }
    if (arr.includes('已传45')) {
      statusArr.push('B');
    }
    if (arr.includes('已传IDC')) {
      statusArr.push('C');
    }
    return statusArr.toString();
  }

  function isInArray(arr: any[], value: string): boolean {
    arr.forEach(data => {
      if (value === data) {
        return true;
      }
    });
    return false;
  }

  function copyArr(arr: any[]): any[] {
    let res: any[] = [];
    arr.forEach(data => {
      res.push(data);
    });
    return res;
  }

  function onBtnClearClickHandler() {
    dateFrom = initDateFrom;
    dateTo = initDateTo;
    dateFromStr = format(dateFrom, 'yyyy-MM-dd');
    dateToStr = format(dateTo, 'yyyy-MM-dd');
    dateEmpty = true;
    selectedUploader = '';
    selectedUploaderValue = uploaderList[0];
    jtracNo = '';
    modules = '';
    exModules = '/main/index.js,/main/runtime.js'; //'/main/index.js,/main/runtime.js,/main/common.js,/menu/index.js';
    jtracNoTotal = 0;
    moduleTotal = 0;
    exModuleTotal = 2;
    checkBoxArr = [
      { defaultValue: '待检查', checked: true },
      { defaultValue: '待上传', checked: true },
      { defaultValue: '已传45', checked: true },
      { defaultValue: '已传IDC', checked: false },
    ];
    selectedPageSizeValue = itemPages[0];
  }

  function onBtnClearExModulesClickHandler() {
    exModules = '';
    exModuleTotal = 0;
  }

  function onBtnUpdateStatusIdcClickHandler() {
    onBtnUpdateStatusClickHandler('IDC');
  }

  function onBtnUpdateStatus45ClickHandler() {
    onBtnUpdateStatusClickHandler('45');
  }

  function onBtnUpdateStatusClickHandler(status: string) {
    if (rowData.length === 0) {
      CustomAlert(UploadAlert.PLZ_SEARCH, AlertIcon.WARNING);
      return;
    }
    let selectedRowIds = [];
    rowData.forEach(elem => {
      if (elem.selected) {
        selectedRowIds.push(elem.id);
      }
    });
    let jtracAc = [];
    let errorAc = [];
    if (selectedRowIds !== null && selectedRowIds.length > 0) {
      let tempData: any[] = [];
      rowData.forEach(data => {
        if (selectedRowIds.includes(data.id)) {
          tempData.push(data);
        }
      });
      if (status === 'IDC') {
        tempData.forEach(data => {
          if (data.status !== 'B') {
            errorAc.push(String(data.jtracNo));
          } else {
            jtracAc.push(String(data.jtracNo));
          }
        });
      } else if (status === '45') {
        tempData.forEach(data => {
          if (data.status !== 'A') {
            errorAc.push(String(data.jtracNo));
          } else {
            jtracAc.push(String(data.jtracNo));
          }
        });
      }
    }
    if (errorAc.length > 0) {
      CustomAlert(UploadAlert.CHOOSE_STATUS, AlertIcon.WARNING);
      return;
    }
    if (jtracAc.length === 0) {
      CustomAlert(UploadAlert.CHOOSE_DATA, AlertIcon.WARNING);
      return;
    }
    if (status === 'IDC') {
      CustomAlert(`确定要变更jtrac: ${jtracAc.join(',')} 为已传IDC状态吗?`, AlertIcon.PROMPT, statusChangeHandler);
    } else if (status === '45') {
      CustomAlert(`确定要变更jtrac: ${jtracAc.join(',')} 为已传45状态吗?`, AlertIcon.PROMPT, statusChangeHandler);
    }

    function statusChangeHandler(data: string) {
      if (data === 'Y') {
        const info: JtracInfo = {};
        if (status === 'IDC') {
          info.status = 'C';
          info.orgStatus = 'B';
        } else if (status === '45') {
          info.status = 'B';
          info.orgStatus = 'A';
        }
        info.jtracNo = jtracAc.join(',');
        setWaiting();
        pageStore.updateMultJtracStatus(info);
      }
    }
  }

  function onBtnDeleteClickHandler() {
    if (searchData.length === 0) {
      CustomAlert(UploadAlert.SEARCH_DATA, AlertIcon.WARNING);
      return;
    }
    let selectedRowIds = [];
    rowData.forEach(elem => {
      if (elem.selected) {
        selectedRowIds.push(elem.id);
      }
    });
    let jtracAc: any[] = [];
    let errorAc: any[] = [];
    let nid: any[] = [];
    if (selectedRowIds !== null && selectedRowIds.length > 0) {
      let tempData: any[] = [];
      rowData.forEach(data => {
        if (selectedRowIds.includes(data.id)) {
          tempData.push(data);
        }
      });
      tempData.forEach(data => {
        if (data.status === 'C' || Number(data.JtracRepeatNum) > 1) {
          errorAc.push(String(data.jtracNo));
        } else {
          jtracAc.push(String(data.jtracNo));
          nid.push(String(data.nid));
        }
      });
    }
    if (errorAc.length > 0) {
      CustomAlert(UploadAlert.CHOOSE_STATUS, AlertIcon.WARNING);
      return;
    }
    if (jtracAc.length === 0) {
      CustomAlert(UploadAlert.CHOOSE_DATA, AlertIcon.WARNING);
      return;
    }
    CustomAlert(`确定要删除jtrac: ${jtracAc.join(',')} 吗?`, AlertIcon.PROMPT, deleteHandler);

    function deleteHandler(data: string) {
      if (data === 'Y') {
        let info: JtracInfo = {};
        info.nid = nid.join(',');
        setWaiting();
        pageStore.deleteJtracInfo(info);
      }
    }
  }

  function onBtnSumitClickHandler() {
    if (searchData.length === 0) {
      CustomAlert(UploadAlert.PLZ_SEARCH, AlertIcon.WARNING);
      return;
    }
    let selectedRowIds = [];
    rowData.forEach(elem => {
      if (elem.selected) {
        selectedRowIds.push(elem.id);
      }
    });
    let jtracArrStr: string = '';
    let jtracNoAc: any[] = [];
    let conflictArrStr: string = '';
    let errorAc: any[] = [];
    if (selectedRowIds !== null && selectedRowIds.length > 0) {
      let tempData: any[] = [];
      rowData.forEach(data => {
        if (selectedRowIds.includes(data.id)) {
          tempData.push(data);
        }
      });
      tempData.forEach(data => {
        if (data.status !== 'B') {
          errorAc.push(String(data.jtracNo));
        } else {
          let targetNo = data.jtracNo;
          jtracArrStr += (jtracArrStr === '' ? '' : '*') + targetNo;
          jtracNoAc.push(targetNo);
        }
      });
    }
    if (errorAc.length > 0) {
      CustomAlert(UploadAlert.CHOOSE_STATUS, AlertIcon.WARNING);
      return;
    }
    if (!jtracNoAc.length) {
      CustomAlert(UploadAlert.CHOOSE_DATA, AlertIcon.WARNING);
      return;
    }
    conflictArrStr = getConflictArrStr(getJtracAc(jtracNoAc), []);
    CreatePop('冲突详细', conflictdetail, { jtracAc: jtracArrStr, conflictAc: conflictArrStr }, onPopCloseSearchHandler, {
      width: '1000px',
      height: '600px',
    });
  }

  function getConflictFile(value: any[], curAc: any[]): any[] {
    let orgArray: any[] = [];
    let curArray: any[] = [];
    let conflictAc: any[] = [];
    let conflictJtrac: string = '';
    for (let j = 0; j < curAc.length; j++) {
      curAc[j].bizDebeloperShow = curAc[j].bizDebeloperName || curAc[j].bizDebeloper;
      if (curAc[j].status !== 'B') continue;
      curAc[j].conflictFiles = '';
      conflictAc = [];
      conflictAc.push(curAc[j].jtracNo);
      conflictJtrac = curAc[j].jtracNo;
      orgArray = getOrgArray(filterModule(curAc[j].moduleList.split(',')));
      for (let m = 0; m < orgArray.length; m++) {
        for (let n = 0; n < value.length; n++) {
          if (conflictJtrac === value[n].jtracNo) continue;
          curArray = filterModule(value[n].moduleList.split(','));
          for (let k = 0; k < curArray.length; k++) {
            if (
              curArray[k].indexOf('/MPRefresh.mxml') !== -1 ||
              curArray[k].indexOf('/GERP_upLoad.mxml') !== -1 ||
              curArray[k].indexOf('/BuyerRefresh.mxml') !== -1 ||
              curArray[k].indexOf('/SupplierRefresh.mxml') !== -1 ||
              curArray[k].indexOf('/BuyerExportRefresh.mxml') !== -1
            )
              continue;
            if (curArray[k].indexOf(orgArray[m]) !== -1) {
              if (String(curAc[j].conflictFiles).indexOf(value[n].jtracNo) === -1) {
                curAc[j].conflictFiles += (curAc[j].conflictFiles === '' ? '' : ',') + value[n].jtracNo;
                conflictAc.push(value[n].jtracNo);
                break;
              }
            }
          }
        }
      }
    }
    return curAc;
  }

  function getOrgArray(orgArray: any[]): any[] {
    let index: number;
    let result: any[] = [];
    orgArray.forEach(data => {
      if (data.indexOf('全编') !== -1) {
        data = data.substring(0, data.indexOf('全编'));
        result.push(`/${data}/`);
      } else {
        index = data.lastIndexOf('/');
        if (index >= 0) result.push(data.substr(index + 1));
        else result.push(data);
      }
    });
    return result;
  }

  function filterModule(value: any[]): any[] {
    let inputExceptionAR = exModules.split(',');
    if (inputExceptionAR && inputExceptionAR.length > 0) {
      let filterModuleAR = [];
      let InputMap = new Map<string, string>();
      for (let i = 0; i < inputExceptionAR.length; i++) {
        let key = inputExceptionAR[i];
        if (!InputMap.get(key)) {
          InputMap.set(key, inputExceptionAR[i]);
        }
      }
      for (let j = 0; j < value.length; j++) {
        if (!InputMap.get(value[j])) {
          filterModuleAR.push(value[j]);
        }
      }
      return filterModuleAR;
    } else {
      return value;
    }
  }

  function getConflictArrStr(jtracAc: any[], conflictAc: any[]): string {
    let array: any[] = [];
    let addConfictAc: any[] = [];
    let conflictAcStr: string = '';
    jtracAc.forEach(iData => {
      if (iData.conflictFiles) {
        array = iData.conflictFiles.split(',');
        array.push(iData.jtracNo);
        array.forEach(data => {
          if (conflictAc.indexOf(data) === -1 && data !== '') {
            conflictAc.push(data);
            addConfictAc.push(data);
          }
        });
      }
    });
    if (addConfictAc.length) {
      getConflictArrStr(getJtracAc(addConfictAc), conflictAc);
    }
    conflictAc.forEach(data => {
      conflictAcStr += conflictAcStr === '' ? data : '*' + data;
    });
    return conflictAcStr;
  }

  function getJtracAc(jtracNoAc: any[]): any[] {
    let jtracAc: any[] = [];
    jtracNoAc.forEach(iData => {
      searchData.forEach(data => {
        if (data.jtracNo === iData) {
          jtracAc.push(data);
        }
      });
    });
    return jtracAc;
  }

  function onBtnCheckStatusClickHandler() {
    if (searchData.length === 0) {
      CustomAlert(UploadAlert.PLZ_SEARCH, AlertIcon.WARNING);
      return;
    }
    let selectedRowIds = [];
    rowData.forEach(elem => {
      if (elem.selected) {
        selectedRowIds.push(elem.id);
      }
    });
    let jtracArrStr: string = '';
    let jtracNoAc: any[] = [];
    if (selectedRowIds !== null && selectedRowIds.length > 0) {
      let tempData: any[] = [];
      rowData.forEach(data => {
        if (selectedRowIds.includes(data.id)) {
          tempData.push(data);
        }
      });
      tempData.forEach(data => {
        let targetNo = data.jtracNo;
        jtracArrStr += (jtracArrStr === '' ? '' : '*') + targetNo;
        jtracNoAc.push(targetNo);
      });
    }
    if (!jtracNoAc.length) {
      CustomAlert(UploadAlert.CHOOSE_DATA, AlertIcon.WARNING);
      return;
    }
    CreatePop('查看状态', conflictdetail, { jtracAc: jtracArrStr, conflictAc: null }, onPopCloseSearchHandler, { width: '1000px', height: '600px' });
  }

  function onBtnDownloadClickHandler() {
    if (searchData.length === 0) {
      CustomAlert(UploadAlert.SEARCH_DATA, AlertIcon.WARNING);
      return;
    }
    let params = searchInfo;
    params.iStart = 0;
    params.iPageCount = 10000;
    searchType = 'download';
    setWaiting();
    pageStore.searchUniqJtracList(params);
  }

  function downloadDataHandler(data: any[]) {
    downloadSearchSign = false;
    let filename = '上传信息.xlsx';
    data = deepClone(data);
    data.forEach(iData => {
      //version
      let reg = /[,]/g;
      for (let n in iData) {
        if (n === 'jtracNo') {
          iData['JtracNo'] = iData[n];
          delete iData[n];
        } else if (n === 'createDate') {
          iData['日期'] = iData[n];
          delete iData[n];
        } else if (n === 'clientDeveloperName') {
          iData['负责人'] = iData[n];
          delete iData[n];
        } else if (n === 'bizDeveloperName') {
          iData['后台负责人'] = iData[n];
          delete iData[n];
        } else if (n === 'version') {
          iData['版本号'] = iData[n];
          delete iData[n];
        } else if (n === 'systemTypes') {
          iData['系统区分'] = iData[n];
          delete iData[n];
        } else if (n === 'statusChange') {
          iData['状态'] = iData[n];
          delete iData[n];
        } else if (n === 'JtracRepeatNum') {
          iData['提交次数'] = iData[n];
          delete iData[n];
        } else if (n === 'fileList') {
          iData['文件列表'] = iData[n];
          delete iData[n];
        } else if (n === 'moduleList') {
          iData['模块'] = iData[n];
          delete iData[n];
        } else if (n === 'labelListChange') {
          iData['标注'] = iData[n];
          delete iData[n];
        } else if (n === 'conflictFiles') {
          iData['直接冲突'] = iData[n];
          delete iData[n];
        } else {
          delete iData[n];
        }
      }
    });
    let arrTitle: any[] = uploadSveletColumn;
    arrTitle.forEach(data => {
      if (data.value !== '详细' && data.value) {
        arrHeadTitleName.push(data.value);
        arrHeadTitleNameWidth.push({ wpx: data.width?.replace('px', '') });
      }
    });
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(data, { header: arrHeadTitleName });
    ws['!cols'] = arrHeadTitleNameWidth;
    XLSX.utils.book_append_sheet(wb, ws);
    XLSX.writeFile(wb, filename);
  }

  function onBtnJtracNoLinkClickHandler(data: any) {
    if (String(data.jtracNo).indexOf(JTRAC_TITLE) < 0 && String(data.jtracNo).indexOf(JTRAC_TITLE_H5) < 0) {
      onBtnModuleLinkClickHandler(data);
    } else {
      CreatePop('Jtrac详细', fileDetail, { jtracNo: data.jtracNo }, onPopCloseSearchHandler, { width: '600px', height: '630px' });
    }
  }

  function onModulesChangeHandler(e: any) {
    modules = e.detail.data;
  }

  function onJtracNoChangeHandler(e: any) {
    jtracNo = e.detail.data;
  }

  function onCheckBoxChangeHandler(e: any) {
    let arr: any[] = [];
    checkBoxArr.forEach(ele => {
      if (e.target.defaultValue === ele.defaultValue) {
        ele.checked = e.target.checked;
      }
      if (ele.checked) {
        checkedItem = ele.defaultValue;
        arr.push(ele);
      }
    });
    if (arr.length === 0) {
      checkBoxArr.forEach(ele => {
        if (ele.defaultValue === checkedItem) {
          ele.checked = true;
        }
      });
    }
    checkBoxArr = checkBoxArr;
  }

  function onBtnFileLinkClickHandler(data: any) {
    let info: any = {};
    info.jtracNo = data.jtracNo;
    info.filelist = data.fileList;
    info.systemType = data.systemType;
    info.status = data.status;
    info.nid = data.nid;
    info.version = data.version;
    info.detail = data.detail;
    info.file = 'A';
    info.label = data.labelList;
    info.reviewer = data.reviewer;
    info.urgencyFlag = data.urgencyFlag;
    info.bizDeveloper = data.bizDeveloper ?? '';
    CreatePop('文件列表', filelist, { info }, onPopCloseSearchHandler, {
      width: '700px',
      height: '630px',
    });
  }

  function onBtnModuleLinkClickHandler(data: any) {
    let info: any = {};
    info.jtracNo = data.jtracNo;
    info.modulelist = data.moduleList;
    info.systemType = data.systemType;
    info.status = data.status;
    info.nid = data.nid;
    info.version = data.version;
    info.detail = data.detail;
    info.file = 'B';
    info.label = data.labelList;
    info.reviewer = data.reviewer;
    info.urgencyFlag = data.urgencyFlag;
    info.bizDeveloper = data.bizDeveloper ?? '';
    CreatePop('模块列表', filelist, { info }, onPopCloseSearchHandler, {
      width: '700px',
      height: '630px',
    });
  }

  function onUploaderSelectHandler(value: any) {
    selectedUploader = value.id;
    selectedUploaderValue = value;
  }

  function onPageSizeSelectHandler(value: any) {
    selectedPageSize = value.code;
    selectedPageSizeValue = value;
  }

  function onPageChange(v: any) {
    if (page === v.detail.page) {
      return;
    }
    const info = {
      dateFrom: searchInfo.dateFrom,
      dateTo: searchInfo.dateTo,
      status: searchInfo.status,
      clientDeveloperId: searchInfo.clientDeveloperId,
      jtracNo: searchInfo.jtracNo,
      modules: searchInfo.modules,
      jtracUniqFlag: searchInfo.jtracUniqFlag,
      iStart: (v.detail.page - 1) * selectedPageSize,
      iPageCount: selectedPageSize,
    };
    page = v.detail.page;
    searchType = 'search';
    currentPage = v.detail.page;
    setWaiting();
    pageStore.searchUniqJtracList(info);
  }

  function onBtnDetailLinkClickHandler(e) {
    if (e.field === 'fileListChange') {
      onBtnFileLinkClickHandler(e.value);
    } else if (e.field === 'moduleListChange') {
      onBtnModuleLinkClickHandler(e.value);
    }
  }

  function onBtnCheckBoxHandler(e: any) {
    if (e.value1 !== undefined) {
      e.value.selected = e.value1;
    }
  }

  function onGridReadyHandler(params: GridReadyEvent) {
    gridApi = params.api;
    gridApi?.addEventListener(Renderer.Renderer_LinkButton, onBtnLinkHandler);
    gridApi?.addEventListener(Renderer.Renderer_Select_Check_Box, onBtnCheckBoxHandler);
    gridApi?.addEventListener(Renderer.Renderer_Icon_Button, onBtnDetailLinkClickHandler);
  }

  function onBtnLinkHandler(e: any) {
    if (e.field === 'jtracNo') {
      onBtnJtracNoLinkClickHandler(e.value);
    } else if (e.field === 'fileListChange') {
      onBtnFileLinkClickHandler(e.value);
    } else if (e.field === 'moduleListChange') {
      onBtnModuleLinkClickHandler(e.value);
    } else if (e.field === 'detailFlag') {
      CreatePop('查看详细', jtraclist, { jtracNo: e.value.jtracNo, jtracStatus: e.value.status }, onPopCloseSearchHandler, {
        width: '1100px',
        height: '600px',
      });
    } else if (e.field === 'clientDeveloperName') {
      openUserInfoPop(e.value.clientDeveloperName.split(','), e.value.clientDeveloperIds.split(','));
    } else if (e.field === 'reviewerName') {
      openUserInfoPop(e.value.reviewerName.split(','), e.value.reviewer.split(','));
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

  function dateToInputHandler(e: CustomEvent<any>): void {
    throw new Error('Function not implemented.');
  }
</script>

<Box column class="outter">
  <Box column class="grid-x callout-padding main-minWidth">
    <Box f={1} class="grid-x margin-bottom" verticalAlign="middle">
      <Box width="500px" height="30px">
        <Box width="68px" className="main-text" verticalAlign="middle">
          <Text>提交时间</Text>
        </Box>
        <Box width="370px">
          <DateInput
            bind:value={dateFrom}
            bind:text={dateFromStr}
            format="yyyy-MM-dd"
            valid={true}
            closeOnSelection={true}
            on:Input={dateToInputHandler}
          />
          <DateInput
            class="margin-left-s"
            bind:value={dateTo}
            bind:text={dateToStr}
            format="yyyy-MM-dd"
            valid={true}
            closeOnSelection={true}
            on:Input={dateToInputHandler}
          />
        </Box>
      </Box>
      <Box f={1} height="30px" class="box-width">
        <Box width="55px" className="main-text " class="text-min-width" verticalAlign="middle">
          <Text>提交人</Text>
        </Box>
        <Box f={1} class="components-height select-width">
          <AdvancedSelect
            options={uploaderList}
            optionIdentifier="id"
            labelIdentifier="name"
            onSubmit={v => onUploaderSelectHandler(v)}
            bind:value={selectedUploaderValue}
          />
        </Box>
      </Box>
      <Box width="100px" />
      <Box f={1} height="30px" class="box-width">
        <Box width="68px" className="main-text" verticalAlign="middle">
          <Text>jtracNo</Text>
        </Box>
        <Box f={1}>
          <Box class="input-box">
            <BatchInput bind:value={jtracNo} bind:dataTotal={jtracNoTotal} on:blur={onJtracNoChangeHandler} />
          </Box>
        </Box>
      </Box>
    </Box>
    <Box f={1} class="gap-height" verticalAlign="middle" />
    <Box class="grid-x margin-bottom" verticalAlign="middle">
      <Box width="500px" height="30px">
        <Box width="68px" className="main-text" verticalAlign="middle">
          <Text>状态</Text>
        </Box>
        <Box width="370px" class="components-height" verticalAlign="middle">
          {#each checkBoxArr as value}
            <Checkbox bind:checked={value.checked} labelText={value.defaultValue} {value} on:change={onCheckBoxChangeHandler} />
          {/each}
        </Box>
      </Box>
      <Box f={1} height="30px" class="box-width">
        <Box width="55px" className="main-text " class="text-min-width" verticalAlign="middle">
          <Text>模块</Text>
        </Box>
        <Box f={1} class="input-box">
          <BatchInput bind:value={modules} bind:dataTotal={moduleTotal} on:blur={onModulesChangeHandler} />
        </Box>
      </Box>
      <Box width="100px" />
      <Box f={1} height="30px" class="box-width">
        <Box width="68px" className="main-text" verticalAlign="middle">
          <Text>例外模块</Text>
        </Box>
        <Box f={1}>
          <Box class="input-box">
            <BatchInput bind:value={exModules} bind:dataTotal={exModuleTotal} />
          </Box>
        </Box>
        <IconButton currentIcon={Close} on:click={onBtnClearExModulesClickHandler} />
      </Box>
    </Box>
  </Box>
  <Box class="margin-bottom ">
    <Box f={2} horizontalAlign="left">
      {#if permissionData.includes('J_A')}
        <Button class="button-normal" size="small" kind="tertiary" icon={Add} on:click={onBtnAddJtracClickHandler}>新增</Button>
      {/if}
      {#if permissionData.includes('J_E')}
        <Button kind="tertiary" icon={FolderParent} class="margin-left-s button-normal" on:click={onBtnUpdateStatusIdcClickHandler}>IDC</Button>
      {/if}
      {#if permissionData.includes('J_D')}
        <Button kind="tertiary" icon={FolderParent} class="margin-left-s button-normal" on:click={onBtnUpdateStatus45ClickHandler}>45</Button>
      {/if}
      {#if permissionData.includes('J_B')}
        <Button kind="tertiary" icon={TrashCan} class="margin-left-s button-normal" on:click={onBtnDeleteClickHandler}>删除</Button>
      {/if}
      <Button kind="tertiary" icon={Download} class="margin-left-s button-normal" on:click={onBtnDownloadClickHandler}>下载</Button>
      {#if permissionData.includes('J_A')}
        <Button kind="tertiary" icon={Checkmark} class="margin-left-s button-normal" on:click={onBtnSumitClickHandler}>确认全部冲突</Button>
      {/if}
      {#if permissionData.includes('J_A')}
        <Button kind="tertiary" icon={Collaborate} class="margin-left-s button-normal" on:click={onBtnCheckStatusClickHandler}>查看状态</Button>
      {/if}
      <Box width="120px" height="30px" class="margin-left-s margin_top">
        <AdvancedSelect
          options={itemPages}
          optionIdentifier="code"
          labelIdentifier="name"
          onSubmit={v => onPageSizeSelectHandler(v)}
          bind:value={selectedPageSizeValue}
        />
      </Box>
    </Box>
    <Box f={1} horizontalAlign="right">
      <Button kind="secondary" class=" button-normal" icon={Search} on:click={onBtnSearchClickHandler}>SEARCH</Button>
      <Button kind="secondary" icon={Reset} class="margin-left-s button-normal" on:click={onBtnClearClickHandler}>RESET</Button>
    </Box>
  </Box>
  <DataGrid
    id="upload-mgmt-Grid"
    columnDefs={uploadSveletColumn}
    {rowData}
    {currentPage}
    {pageCount}
    headerRows={2}
    onGridReady={onGridReadyHandler}
    {onPageChange}
  />
</Box>

<style lang="scss">
  @import '../../styles/theme/var';
  @import '../../styles/theme/mixin';

  :global(.linkButton) {
    display: flex;
    justify-content: space-evenly;
  }

  :global(.left-text) {
    text-align: left;
  }

  :global(.not-find-rowdata-div) {
    margin-left: 0px;
    border: 1px solid lightgray;
  }

  :global(.not-find-rowdata) {
    color: lightgrey;
    width: 100%;
    overflow: auto;
    padding-right: 0px;
    text-align: center;
    height: 200px;
    line-height: 200px;
  }

  :global(.main-bottom > .pagination-nav > .option.prev) {
    margin-top: 3px;
  }

  :global(.input-box, .input-box > div, .input-box input) {
    width: 100% !important;
  }

  :global(.main-bottom > .pagination-nav > .option.next) {
    margin-top: 3px;
  }

  :global(.svelte-select.svelte-15ynnp5.svelte-15ynnp5.svelte-15ynnp5) {
    min-height: 30px !important;
    line-height: 30px !important;
    border-radius: 0% !important;
    font-size: 12px !important;
    cursor: pointer !important;
  }

  :global(.svelte-select.svelte-fpyony.svelte-fpyony.svelte-fpyony) {
    min-height: 30px !important;
    line-height: 30px !important;
    border-radius: 0% !important;
    font-size: 12px !important;
    cursor: pointer !important;
  }

  :global(.outter) {
    display: flex !important;
    flex-direction: column !important;
    width: auto;
    height: 100% !important;
    min-width: 1422px;
  }

  :global(.components-height) {
    height: 30px !important;
  }

  :global(svg.svelte-whdbu1) {
    width: var(--clear-icon-width, 15px);
    height: var(--clear-icon-width, 15px);
    color: var(--clear-icon-color, #595959);
  }

  :global(.button-normal) {
    margin-bottom: 4px;
    font-size: 13px;
    font-family: 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif, '微软雅黑';
    margin-top: 5px;
  }

  :global(.text-min-width) {
    min-width: 55px !important;
  }

  :global(.select-width > .svelte-select) {
    border: 1px solid #cacaca !important;
    width: 100% !important;
  }

  :global(.select-width) {
    width: 100% !important;
  }

  :global(.box-width) {
    width: 100% !important;
  }

  :global(.gap-height) {
    height: 10px !important;
  }

  :global(.dataTable) {
    min-width: 1203px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  :global(.upload-noData) {
    padding: 230px 49%;
    height: 500px;
    border: 1px solid lightgray;
    min-width: 1200px;
  }

  :global(.upload-noData-text) {
    color: lightgrey;
    min-width: 500px;
    overflow: auto;
  }

  :global(.bx--form-item.bx--checkbox-wrapper) {
    max-width: 76px;
  }

  :global(.bx--modal-content p) {
    padding-right: 0px;
  }
</style>
