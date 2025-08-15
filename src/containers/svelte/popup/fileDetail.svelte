<!--
/**
 * Summary: Jtrac详细
 * Created: 2022/09/21
 * Author1: ljh
 * Author2: kang jiaqi
 * © 2022 iMarketChina Co.,Ltd. All rights reserved.
 */
 -->
<script lang="ts">
  import "@/styles/core/white.css";
  import "@/styles/core/index.scss";
  import { Box, Text } from "@/components/sveltecomponents";
  import jtracStore from "@/store/jtracDetailStore";
  import { onMount, onDestroy } from "svelte";
  import { autorun } from "mobx";
  import { deepClone } from "@/utils/CommonUtils";

  export let params;
  let jtracNo: string = "";
  let relevantProject: string = "";
  let status: string = "";
  let initiator: string = "";
  let receiver: string = "";
  let summary: string = "";
  let detail: string = "";
  let emmergency: string = "";
  let system: string = "";
  let pageName: string = "";
  let requester: string = "";
  let reason: string = "";
  let OPReqReason: string = "";
  let clientDeveloper: string = "";
  let bizDeveloper: string = "";
  let devStartDate: string = "";
  let devEndDate: string = "";
  let SVNversion: string = "";
  let DBChange: string = "";
  let migration: string = "";
  let updateClass: string = "";
  let versatilityCodeChange: string = "";
  let configTableChange: string = "";
  let tester: string = "";
  let testStartDate: string = "";
  let testEndDate: string = "";
  let openAgain: string = "";
  let preJtracNo: string = "";
  let daemon: string = "";
  let openAgainDate: string = "";
  let showUI: boolean = false;
  let jtracShowUI: boolean = true;
  let changeDate: string = "";
  let changeStatus: string = "";
  let solveDate: string = "";
  let diffName: string = "";
  let developDiff: string = "";
  let processingMethod: string = "";
  let openJtrac: string = "";

  onMount(() => {
    searchJtracDetail();
  });

  onDestroy(() => {
    disposer();
  });

  const disposer = autorun(() => {
    if (jtracStore.readJtracResult) {
      const value = deepClone(jtracStore.readJtracResult);
      jtracStore.readJtracResult = null;
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
          .replace(/<br\/>/g, "\n")
          .replace(/&gt;/g, ">");
        fillData[6] = fillData[6].replace(/&lt;/g, "<").replace(/&amp;/g, "&");
        fillData[6] = fillData[6].replace(/&nbsp;/g, " ");
        for (let j = 0; j < fillData.length; j++) {
          fillData[j] = fillData[j].substr(12, fillData[j].length);
        }
        if (fillData[0]) showUI = true;
        jtracNo = fillData[0] ?? "";
        relevantProject = fillData[1] ?? "";
        status = fillData[2] ?? "";
        initiator = fillData[3] ?? "";
        receiver = fillData[4] ?? "";
        summary = fillData[5] ?? "";
        detail = fillData[6] ?? "";
        if (jtracNo.indexOf("V2A") >= 0) {
          jtracShowUI = true;
          emmergency = fillData[7] ?? "";
          system = fillData[8] ?? "";
          pageName = fillData[9] ?? "";
          requester = fillData[10] ?? "";
          reason = fillData[11] ?? "";
          OPReqReason = fillData[12] ?? "";
          clientDeveloper = fillData[13] ?? "";
          bizDeveloper = fillData[14] ?? "";
          devStartDate = fillData[15] ?? "";
          devEndDate = fillData[16] ?? "";
          SVNversion = fillData[17] ?? "";
          DBChange = fillData[18] ?? "";
          migration = fillData[19] ?? "";
          updateClass = fillData[20] ?? "";
          versatilityCodeChange = fillData[21] ?? "";
          configTableChange = fillData[22] ?? "";
          tester = fillData[23] ?? "";
          testStartDate = fillData[24] ?? "";
          testEndDate = fillData[25] ?? "";
          preJtracNo = fillData[26] ?? "";
          daemon = fillData[27] ?? "";
          openAgain = fillData[28] ?? "";
          openAgainDate = fillData[29] ?? "";
        } else {
          jtracShowUI = false;
          system = fillData[7] ?? "";
          pageName = fillData[8] ?? "";
          changeDate = fillData[9] ?? "";
          changeStatus = fillData[10] ?? "";
          solveDate = fillData[11] ?? "";
          diffName = fillData[12] ?? "";
          developDiff = fillData[13] ?? "";
          processingMethod = fillData[14] ?? "";
          clientDeveloper = fillData[15] ?? "";
          bizDeveloper = fillData[16] ?? "";
          tester = fillData[17] ?? "";
          openJtrac = fillData[18] ?? "";
        }
      }
    }
  });

  function searchJtracDetail() {
    jtracStore.readJtrac(params.jtracNo?.trim());
  }
</script>

<div style="overflow-y:auto;height:520px">
  {#if showUI}
    <Box>
      <Box
        class="background_gray_border left_box svelte-lnhus4-font"
        horizontalAlign="left">
        <Text class="center_text">编号:</Text>
      </Box>
      <Box f={1} class="border_right_left_top right_box" horizontalAlign="left">
        <Text>{jtracNo}</Text>
      </Box>
    </Box>
    <Box>
      <Box class="background_gray left_box" horizontalAlign="left">
        <Text class="center_text">相关项目:</Text>
      </Box>
      <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
        <Text>{relevantProject}</Text>
      </Box>
    </Box>
    <Box>
      <Box class="background_gray left_box" horizontalAlign="left">
        <Text class="center_text">状态:</Text>
      </Box>
      <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
        <Text>{status}</Text>
      </Box>
    </Box>
    <Box>
      <Box class="background_gray left_box" horizontalAlign="left">
        <Text class="center_text">添加人:</Text>
      </Box>
      <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
        <Text>{initiator}</Text>
      </Box>
    </Box>
    <Box>
      <Box class="background_gray left_box" horizontalAlign="left">
        <Text class="center_text">发送给:</Text>
      </Box>
      <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
        <Text>{receiver}</Text>
      </Box>
    </Box>
    <Box>
      <Box class="background_gray left_box" horizontalAlign="left">
        <Text class="center_text">概要:</Text>
      </Box>
      <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
        <Text>{summary}</Text>
      </Box>
    </Box>
    <Box>
      <Box class="background_gray left_box" horizontalAlign="left">
        <Text class="center_text">详述:</Text>
      </Box>
      <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
        <Text class="content_left">{detail}</Text>
      </Box>
    </Box>
    {#if jtracShowUI}
      <Box>
        <Box class="background_gray left_box" horizontalAlign="left">
          <Text class="center_text">紧急程度:</Text>
        </Box>
        <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
          <Text>{emmergency}</Text>
        </Box>
      </Box>
    {/if}
    <Box>
      <Box class="background_gray left_box" horizontalAlign="left">
        <Text class="center_text">{jtracShowUI ? "System:" : "sys区分"}</Text>
      </Box>
      <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
        <Text>{system}</Text>
      </Box>
    </Box>
    <Box>
      <Box class="background_gray left_box" horizontalAlign="left">
        <Text class="center_text">Page Name:</Text>
      </Box>
      <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
        <Text>{pageName}</Text>
      </Box>
    </Box>
    {#if jtracShowUI}
      <Box>
        <Box class="background_gray left_box" horizontalAlign="left">
          <Text class="center_text">Requester:</Text>
        </Box>
        <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
          <Text>{requester}</Text>
        </Box>
      </Box>
      <Box>
        <Box class="background_gray left_box" horizontalAlign="left">
          <Text class="center_text">Reason:</Text>
        </Box>
        <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
          <Text>{reason}</Text>
        </Box>
      </Box>
      <Box>
        <Box class="background_gray left_box" horizontalAlign="left">
          <Text class="center_text">OP Req Reason:</Text>
        </Box>
        <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
          <Text>{OPReqReason}</Text>
        </Box>
      </Box>
    {:else}
      <Box>
        <Box class="background_gray left_box" horizontalAlign="left">
          <Text class="center_text">发生日期:</Text>
        </Box>
        <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
          <Text>{changeDate}</Text>
        </Box>
      </Box>
      <Box>
        <Box class="background_gray left_box" horizontalAlign="left">
          <Text class="center_text">状态:</Text>
        </Box>
        <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
          <Text>{changeStatus}</Text>
        </Box>
      </Box>
      <Box>
        <Box class="background_gray left_box" horizontalAlign="left">
          <Text class="center_text">解决日期:</Text>
        </Box>
        <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
          <Text>{solveDate}</Text>
        </Box>
      </Box>
      <Box>
        <Box class="background_gray left_box" horizontalAlign="left">
          <Text class="center_text">区分:</Text>
        </Box>
        <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
          <Text>{diffName}</Text>
        </Box>
      </Box>
      <Box>
        <Box class="background_gray left_box" horizontalAlign="left">
          <Text class="center_text">开发区分:</Text>
        </Box>
        <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
          <Text>{developDiff}</Text>
        </Box>
      </Box>
      <Box>
        <Box class="background_gray left_box" horizontalAlign="left">
          <Text class="center_text">处理方法:</Text>
        </Box>
        <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
          <Text>{processingMethod}</Text>
        </Box>
      </Box>
    {/if}
    <Box>
      <Box class="background_gray left_box" horizontalAlign="left">
        <Text class="center_text"
          >{jtracShowUI ? "Client Developer:" : "前台开发者:"}</Text>
      </Box>
      <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
        <Text>{clientDeveloper}</Text>
      </Box>
    </Box>
    <Box>
      <Box class="background_gray left_box" horizontalAlign="left">
        <Text class="center_text"
          >{jtracShowUI ? "Biz Developer:" : "后台开发者:"}</Text>
      </Box>
      <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
        <Text>{bizDeveloper}</Text>
      </Box>
    </Box>
    {#if jtracShowUI}
      <Box>
        <Box class="background_gray left_box" horizontalAlign="left">
          <Text class="center_text">DevStartDate:</Text>
        </Box>
        <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
          <Text>{devStartDate}</Text>
        </Box>
      </Box>
      <Box>
        <Box class="background_gray left_box" horizontalAlign="left">
          <Text class="center_text">DevEndDate:</Text>
        </Box>
        <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
          <Text>{devEndDate}</Text>
        </Box>
      </Box>
      <Box>
        <Box class="background_gray left_box" horizontalAlign="left">
          <Text class="center_text">SVN版本号:</Text>
        </Box>
        <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
          <Text>{SVNversion}</Text>
        </Box>
      </Box>
      <Box>
        <Box class="background_gray left_box" horizontalAlign="left">
          <Text class="center_text">DB Change:</Text>
        </Box>
        <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
          <Text>{DBChange}</Text>
        </Box>
      </Box>
      <Box>
        <Box class="background_gray left_box" horizontalAlign="left">
          <Text class="center_text">Migration:</Text>
        </Box>
        <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
          <Text>{migration}</Text>
        </Box>
      </Box>
      <Box>
        <Box class="background_gray left_box" horizontalAlign="left">
          <Text class="center_text">修改增加类:</Text>
        </Box>
        <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
          <Text>{updateClass}</Text>
        </Box>
      </Box>
      <Box>
        <Box class="background_gray left_box" horizontalAlign="left">
          <Text class="center_text">通用代码变更:</Text>
        </Box>
        <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
          <Text>{versatilityCodeChange}</Text>
        </Box>
      </Box>
      <Box>
        <Box class="background_gray left_box" horizontalAlign="left">
          <Text class="center_text">配置表变更:</Text>
        </Box>
        <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
          <Text>{configTableChange}</Text>
        </Box>
      </Box>
    {/if}
    <Box>
      <Box class="background_gray left_box" horizontalAlign="left">
        <Text class="center_text"
          >{jtracShowUI ? "CS负责人:" : "CS测试者:"}</Text>
      </Box>
      <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
        <Text>{tester}</Text>
      </Box>
    </Box>
    {#if jtracShowUI}
      <Box>
        <Box class="background_gray left_box" horizontalAlign="left">
          <Text class="center_text">Test Start Date:</Text>
        </Box>
        <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
          <Text>{testStartDate}</Text>
        </Box>
      </Box>
      <Box>
        <Box class="background_gray left_box" horizontalAlign="left">
          <Text class="center_text">Test End Date:</Text>
        </Box>
        <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
          <Text>{testEndDate}</Text>
        </Box>
      </Box>
      <Box>
        <Box class="background_gray left_box" horizontalAlign="left">
          <Text class="center_text">原Jtrac No:</Text>
        </Box>
        <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
          <Text>{preJtracNo}</Text>
        </Box>
      </Box>
      <Box>
        <Box class="background_gray left_box" horizontalAlign="left">
          <Text class="center_text">Daemon:</Text>
        </Box>
        <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
          <Text>{daemon}</Text>
        </Box>
      </Box>
      <Box>
        <Box class="background_gray left_box" horizontalAlign="left">
          <Text class="center_text">再Open 次数:</Text>
        </Box>
        <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
          <Text>{openAgain}</Text>
        </Box>
      </Box>
      <Box>
        <Box class="background_gray left_box" horizontalAlign="left">
          <Text class="center_text">再Open日:</Text>
        </Box>
        <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
          <Text>{openAgainDate}</Text>
        </Box>
      </Box>
    {:else}
      <Box>
        <Box class="background_gray left_box" horizontalAlign="left">
          <Text class="center_text">关联Jtrac号:</Text>
        </Box>
        <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
          <Text>{openJtrac}</Text>
        </Box>
      </Box>
    {/if}
  {:else}
    <Box class="data_empty" />
  {/if}
</div>

<style lang="scss">
  :global(.left_box) {
    width: 180px !important;
    line-height: 30px !important;
    justify-content: center !important;
    overflow: hidden;
    font-size: 14px;
  }

  :global(.left_text) {
    width: 100%;
    padding-left: 10px;
    text-align: left;
  }

  :global(.center_text) {
    width: 100%;
    padding-left: 10px;
    text-align: center;
  }

  :global(.right_box) {
    width: 450px !important;
    line-height: 30px;
    padding-left: 15px;
    font-size: 14px;
  }

  :global(.bottom_gap) {
    height: 10px !important;
  }

  :global(.data_empty) {
    height: 500px !important;
  }

  :global(.content_left) {
    text-align: left;
  }
</style>
