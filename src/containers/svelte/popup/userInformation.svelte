<script lang="ts">
  import "@/styles/core/white.css";
  import "@/styles/core/index.scss";
  import { onMount } from "svelte";
  import { Box, Text, Tabs } from "@/components/sveltecomponents";
  import { getImagesServerUrl } from "@/utils/CommonUtils";

  export let params;
  let id: string;
  let name: string;
  let ip: string;
  let userType: string;
  let blockFlag: string;
  let figure: string = "";
  let tabList: any[];
  let labelList: any[];
  let showTabs: boolean = false;

  onMount(() => {
    labelList = params.tabName;
    tabList = params.userInfoList;
    if (labelList.length > 1) {
      showTabs = true;
      tabList = userSort(labelList, params.userInfoList);
    }
    tabsUserInfoChange(0);
  });

  function userSort(tab: string[], list: any[]) {
    const currentArr = [];
    tab.forEach((name: string) => {
      list.forEach((data: any) => {
        if (name === data.name) {
          currentArr.push(data);
        }
      });
    });
    return currentArr;
  }

  function onTabsChangeHandle(event) {
    tabsUserInfoChange(event.detail.data);
  }

  function tabsUserInfoChange(index) {
    id = tabList[index].id;
    name = tabList[index].name;
    ip = tabList[index].ip;
    userType = tabList[index].usertype;
    blockFlag = tabList[index].blockflag;
    figure = tabList[index].figure;
  }
</script>

<div>
  {#if showTabs}
    <Box class="tabs">
      <Tabs {labelList} on:change={onTabsChangeHandle} />
    </Box>
  {/if}
  <Box>
    <Box class="background_gray_border left_box svelte-lnhus4-font">
      <Text class="center_text">ID</Text>
    </Box>
    <Box f={1} class="border_right_left_top right_box" horizontalAlign="left">
      <Text>{id}</Text>
    </Box>
  </Box>
  <Box>
    <Box class="background_gray left_box">
      <Text class="center_text">姓名</Text>
    </Box>
    <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
      <Text>{name}</Text>
    </Box>
  </Box>
  <Box>
    <Box class="background_gray left_box">
      <Text class="center_text">用户类型</Text>
    </Box>
    <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
      <Text>{userType}</Text>
    </Box>
  </Box>
  <Box>
    <Box class="background_gray left_box">
      <Text class="center_text">注销</Text>
    </Box>
    <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
      <Text>{blockFlag}</Text>
    </Box>
  </Box>
  <Box>
    <Box class="background_gray left_box">
      <Text class="center_text">IP</Text>
    </Box>
    <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
      <Text>{ip}</Text>
    </Box>
  </Box>
  <Box>
    <Box class="background_gray left_box">
      <Text class="center_text">头像</Text>
    </Box>
    <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
      <!-- svelte-ignore a11y-missing-attribute -->
      <img
        style="width: 95px;height: 95px"
        src={getImagesServerUrl() + figure} />
    </Box>
  </Box>
</div>

<style lang="scss">
  :global(.left_box) {
    width: 180px !important;
    line-height: 30px !important;
    justify-content: center !important;
    overflow: hidden;
    font-size: 14px;
  } 

  :global(.right_box) {
    width: 450px !important;
    line-height: 30px;
    padding-left: 15px;
    font-size: 14px;
  }

  :global(.left_img_box) {
    width: 180px !important;
    line-height: 100px !important;
    justify-content: center !important;
    overflow: hidden;
    font-size: 14px;
  }

  :global(.right_img_box) {
    width: 450px !important;
    line-height: 100px;
    padding-left: 15px;
    font-size: 14px;
  } 

  :global(.tabs) {
    height: 40px;
    margin-bottom: 8px;
  }
</style>
