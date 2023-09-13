<!--
/**
 * Summary: 查看详细
 * Created: 2022/11/02
 * Author1: kang jiaqi
 * © 2022 iMarketChina Co.,Ltd. All rights reserved.
 */
 -->
<script lang="ts">
  import "@/styles/core/white.css";
  import "@/styles/core/index.scss";
  import { Button, Box } from "@/components/sveltecomponents";
  import { onMount, onDestroy } from "svelte";
  import TrashCan from "carbon-icons-svelte/lib/TrashCan.svelte";
  import pageStore from "@/store/jtraclistStore";
  import { autorun } from "mobx";
  import { CreatePop } from "@/components/Popup";
  import CustomAlert, { AlertIcon } from "@/components/CustomAlert";
  import jtracListColumns from "@/components/columns/jtraclistColumns";
  import filelist from "@/containers/svelte/popup/filelist.svelte";
  import { setWaiting, removeWaiting } from "@/utils/loaderUtils";
  import { JtracListAlert } from "@/constant/alert/upload";
  import { deepClone } from "@/utils/CommonUtils";
  import type { GridReadyEvent } from "ag-grid-community";
  import DataGrid from "@/components/sveltecomponents/DataGrid.svelte";
  import RENDERER_EVENT from "@/constant/Renderer";

  let rowData: any[] = [];
  let linkCodes = ["fileListChange", "moduleListChange"];
  let leftCodes = ["fileListChange", "moduleListChange"];
  let centerCodes = [
    "jtracNo",
    "createDate",
    "systemType",
    "version",
    "clientDeveloper",
    "bizDeveloperName",
    "statusChange",
  ];
  let gridApi: any;
  export let params: any;
  export let onClose;

  onMount(() => {
    onSearch();
  });

  onDestroy(() => {
    search();
    deleteJtracInfo();
  });

  const search = autorun(() => {
    if (pageStore.searchJtracListResult) {
      const value = deepClone(pageStore.searchJtracListResult);
      pageStore.searchJtracListResult = null;
      removeWaiting();
      if (!value.error) {
        let reg = /[,]/g;
        value.data?.forEach((elem: any) => {
          elem.id = elem.nid;
          if (elem.status === "R") {
            elem.statusChange = "待检查";
          } else if (elem.status === "A") {
            elem.statusChange = "待上传";
          } else if (elem.status === "B") {
            elem.statusChange = "已传45";
          } else {
            elem.statusChange = "已传IDC";
          }
          let fileArr: any = elem.fileList.split(",");
          let moduleArr: any = elem.moduleList.split(",");
          elem.selected = false;
          elem.linkCodes = linkCodes;
          elem.leftCodes = leftCodes;
          elem.centerCodes = centerCodes;
          elem.fileListChange = "(" + fileArr.length + ")" + fileArr[0];
          elem.moduleListChange = "(" + moduleArr.length + ")" + moduleArr[0];
          elem.sFileList = elem.fileList.replace(reg, "\n");
          elem.sModuleList = elem.moduleList.replace(reg, "\n");
          elem.labelList = elem.labelList.replace(reg, "\n");
          if (
            elem.bizDeveloperName === null ||
            elem.bizDeveloperName == "" ||
            elem.bizDeveloperName === "null"
          ) {
            elem.bizDeveloperName = "";
          }
          if (!elem.systemType || String(elem.systemType) === "null") {
            elem.systemType = "";
          }
          if (!elem.version || String(elem.version) === "null") {
            elem.version = "";
          }
          if (!elem.detail || String(elem.detail) === "null") {
            elem.detail = "";
          }
        });
        rowData = value.data;
      } else {
        CustomAlert(JtracListAlert.INTERNET_ERROR, AlertIcon.ERROR);
      }
    }
  });

  const deleteJtracInfo = autorun(() => {
    if (pageStore.deleteJtracInfoResult) {
      const value = deepClone(pageStore.deleteJtracInfoResult);
      pageStore.deleteJtracInfoResult = null;
      removeWaiting();
      if (!value.error) {
        CustomAlert(
          JtracListAlert.DELETE_SUCCESS,
          AlertIcon.SUCCESS,
          onClose("Y")
        );
      }
    }
  });

  function onSearch() {
    let info = {
      dateTo: "",
      dateFrom: "",
      modules: "",
      jtracNo: params.jtracNo,
      status: params.jtracStatus,
      iStart: "0",
      iPageCount: "1000",
      jtracUniqFlag: "",
      clientDeveloperId: "",
    };
    setWaiting();
    pageStore.searchJtracList(info);
  }

  function onBtnDeleteClickHandler() {
    let checkArr: number[] = [];
    let statusArr: string[] = [];
    for (let i = 0; i < rowData.length; i++) {
      if (rowData[i].selected) {
        checkArr.push(rowData[i].data.nid);
        statusArr.push(rowData[i].data.status);
      }
    }
    if (checkArr.length === 0) {
      CustomAlert(JtracListAlert.CHOOSE_DELETE_DATA, AlertIcon.WARNING);
      return;
    }
    if (statusArr.includes("C")) {
      CustomAlert(JtracListAlert.CHOOSE_STATUS, AlertIcon.WARNING);
      return;
    }
    CustomAlert(JtracListAlert.CONFIRM_DELETE, AlertIcon.PROMPT, deleteHandler);

    function deleteHandler(data: string) {
      if (data === "Y") {
        let info: any = {};
        info.nid = checkArr.join(",");
        setWaiting();
        pageStore.deleteJtracInfo(info);
      }
    }
  }

  function onGridReadyHandler(params: GridReadyEvent) {
    gridApi = params.api;
    gridApi?.addEventListener(
      RENDERER_EVENT.Renderer_LinkButton,
      onBtnLinkHandler
    );
    gridApi?.addEventListener(
      RENDERER_EVENT.Renderer_Select_Check_Box,
      onBtnCheckBoxHandler
    );
  }

  function onBtnCheckBoxHandler(e: any) {
    if (e.value1 !== undefined) {
      e.value.selected = e.value1;
    }
  }

  function onBtnLinkHandler(e: any) {
    if (e.field === "fileListChange") {
      let data = e.value;
      let info: any = {};
      info.jtracNo = data.jtracNo;
      info.filelist = data.fileList;
      info.detail = data.detail;
      info.version = data.version;
      info.systemType = data.systemType;
      info.nid = data.nid;
      info.reviewer = data.reviewer;
      info.file = "A";
      info.label = data.list;
      CreatePop("文件列表", filelist, { info }, onPopCloseHandler, {
        width: "630px",
        height: "600px",
      });
    } else if (e.field === "moduleListChange") {
      let info: any = {};
      let data = e.value;
      info.jtracNo = data.jtracNo;
      info.modulelist = data.moduleList;
      info.detail = data.detail;
      info.version = data.version;
      info.systemType = data.systemType;
      info.nid = data.nid;
      info.reviewer = data.reviewer;
      info.file = "B";
      info.label = data.list;
      CreatePop("模块列表", filelist, { info }, onPopCloseHandler, {
        width: "630px",
        height: "600px",
      });
    }
  }

  function onPopCloseHandler() {}
</script>

<div style="height:500px">
  <Box width="70px" className="main-text" verticalAlign="middle">
    <Button
      kind="secondary"
      class=" button-normal"
      icon={TrashCan}
      on:click={onBtnDeleteClickHandler}>删除</Button>
  </Box>
  <DataGrid
    id="jtracList-mgmt-Grid"
    columnDefs={jtracListColumns}
    {rowData}
    pageShowFlag={false}
    onGridReady={onGridReadyHandler} />
</div>
