<!--
/**
 * Summary: 冲突详细
 * Created: 2022/10/31
 * Author1: kang jiaqi
 * © 2022 iMarketChina Co.,Ltd. All rights reserved.
 */
 -->
<script lang="ts">
  import "@/styles/core/white.css";
  import "@/styles/core/index.scss";
  import {
    Button,
    Input,
    Box,
    Text,
    DataGridEx,
  } from "@/components/sveltecomponents";
  import { onMount, onDestroy } from "svelte";
  import Copy from "carbon-icons-svelte/lib/Copy.svelte";
  import pageStore from "@/store/conflictdetailStore";
  import { autorun } from "mobx";
  import conflictdetailColumns from "@/components/columns/conflictdetailColumns";
  import copy from "copy-to-clipboard";
  import { deepClone } from "@/utils/CommonUtils";

  let waitingUploadNum: string = "";
  let conflictNum: string = "";
  let conflictNo: string = "";
  let arrCount: number = 0;
  let selectedNoArr: any[] = [];
  let rowData: any[] = [];
  let jtracDetail: any[] = [];
  const labelCodes = ["summary"];
  const centerCodes = ["jtracNo", "status"];
  const leftCodes = ["summary"];

  export let params: any;

  onMount(() => {
    selectedNoArr = params.jtracAc.split("*");
    conflictNo = params.conflictAc;
    initData();
  });

  onDestroy(() => {
    getJtracDetail();
  });

  const getJtracDetail = autorun(() => {
    if (pageStore.readJtracResult) {
      const value = deepClone(pageStore.readJtracResult);
      pageStore.readJtracResult = null;
      arrCount--;
      if (!value.error) {
        let data = value.data;
        let table = data.split("</table");
        let tds = table[3].split("</td>");
        let fillData = [];
        for (let i = 0; i < tds.length; i++) {
          if (i % 2 !== 0) {
            tds[i] = tds[i].replace(/<td.*?>/, "");
            fillData.push(tds[i]);
          }
        }
        fillData[6] = fillData[6]
          ?.replace(/<br\/>/g, "\n")
          ?.replace(/&gt;/g, ">");
        fillData[6] = fillData[6]
          ?.replace(/&lt;/g, "<")
          ?.replace(/&amp;/g, "&");
        fillData[6] = fillData[6]?.replace(/&nbsp;/g, " ");
        for (let j = 0; j < fillData.length; j++) {
          fillData[j] = fillData[j].substr(12, fillData[j].length);
        }
        let detail: any = {};
        detail.labelCodes = labelCodes;
        detail.centerCodes = centerCodes;
        detail.leftCodes = leftCodes;
        detail.jtracNo = fillData[0];
        detail.relevantProject = fillData[1];
        detail.status = fillData[2];
        detail.initiator = fillData[3];
        detail.receiver = fillData[4];
        detail.summary = fillData[5];
        detail.detail = fillData[6];
        detail.emmergency = fillData[7];
        detail.system = fillData[8];
        detail.pageName = fillData[9];
        detail.requester = fillData[10];
        detail.reason = fillData[11];
        detail.OPReqReason = fillData[12];
        detail.clientDeveloper = fillData[13];
        detail.bizDeveloper = fillData[14];
        detail.devStartDate = fillData[15];
        detail.devEndDate = fillData[16];
        detail.SVNversion = fillData[17];
        detail.DBChange = fillData[18];
        detail.migration = fillData[19];
        detail.updateClass = fillData[20];
        detail.versatilityCodeChange = fillData[21];
        detail.configTableChange = fillData[22];
        detail.tester = fillData[23];
        detail.testStartDate = fillData[24];
        detail.testEndDate = fillData[25];
        detail.openAgain = fillData[26];
        detail.preJtracNo = fillData[27];
        detail.daemon = fillData[28];
        jtracDetail.push(detail);
      }
      if (arrCount === 0) rowData = jtracDetail;
    }
  });

  function initData() {
    if (conflictNo === null) {
      getJtracInfo(selectedNoArr);
    } else {
      let conflictNoArr = conflictNo.split("*");
      let conflictJtracNo = conflictNoArr.toString();
      conflictNum = conflictJtracNo;
      let textAreaUpload = selectedNoArr.toString();
      waitingUploadNum = textAreaUpload;
      getJtracInfo(conflictNoArr);
    }
  }

  function getJtracInfo(jtracArr: any[]) {
    arrCount = jtracArr.length;
    jtracArr.forEach((data) => {
      pageStore.readJtrac(data);
    });
  }

  function onBtnCopyClickHandler() {
    copy(conflictNum);
    return;
  }
</script>

{#if conflictNo !== null}
  <Box f={1} class="grid-x margin-bottom">
    <Box width="70px" className="main-text" verticalAlign="middle">
      <Text>待传号码</Text>
    </Box>
  </Box>
  <Box>
    <Input bind:value={waitingUploadNum} />
  </Box>
  <Box height="10px" class="grid-x" verticalAlign="middle" />
  <Box f={1} class="grid-x margin-bottom">
    <Box width="70px" className="main-text" verticalAlign="middle">
      <Text>冲突号码</Text>
    </Box>
  </Box>
  <Box class="grid-x margin-bottom">
    <Box f={5}>
      <Input bind:value={conflictNum} />
    </Box>
    <Box f={1} horizontalAlign="left" class="copy-button-padding">
      <Button
        kind="secondary"
        class="button-normal conflictdetail-button"
        icon={Copy}
        on:click={onBtnCopyClickHandler}>复制</Button>
    </Box>
  </Box>
{/if}
<Box height="10px" class="grid-x" verticalAlign="middle" />
<DataGridEx
  columnsDefs={conflictdetailColumns}
  {rowData}
  className=""
  pageShowFlag={false} />

<style>
  :global(.conflictdetail-button) {
    margin-top: 0px !important;
  }

  :global(.copy-button-padding) {
    padding: 0px 50px;
  }
</style>
