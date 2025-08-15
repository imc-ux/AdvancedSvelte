<script>
  import "@/styles/core/app.css";
  import MessageReply from "./MessageReply.svelte";
  import { onMount } from "svelte";
  import {
    Tabs,
    Image,
    Box,
    Grid,
    Text,
    Column,
  } from "@/components/sveltecomponents";
  import BusinessBase, {
    MMessageBoardManagerKey,
  } from "@/business/BusinessBase";

  let userMessageList = [];
  let userUrl = "";
  let userName = "";

  let labelList = [];

  onMount(() => {
    search("A");
  });

  function search(type) {
    const userSearchInfo = {
      msgType: type,
      userId: "lixiaozheng",
      iStart: 0,
      iPageCount: 20,
    };
    BusinessBase.call(
      MMessageBoardManagerKey.searchMessageBoardByUser,
      userSearchInfo
    ).then((json) => {
      if (json && !json.error) {
        if (json.data.length > 0) {
          userMessageList = json.data;
          userUrl = userMessageList[0].userFigure;
          userName = userMessageList[0].userName;
          labelList = [
            `留言(${userMessageList[0].userTotalCount})`,
            `回复(${userMessageList[0].userTotalReplyCount})`,
          ];
        }
      }
    });
  }

  function onTabsChangeHandle(event) {
    if (event.detail.data === 0) {
      search("B");
    } else {
      search("A");
    }
  }
</script>

<Grid padding class="inherit-height">
  <Box class="dis-flex">
    <Box style="flex: 1" verticalAlign="middle">
      <Box style="width: 150px; height: 150px;">
        <Image src={userUrl} />
      </Box>
      <Box style="flex: 1; font-size: 30px;">
        <Text bold singleLine>{userName}</Text>
      </Box>
    </Box>
  </Box>
  <Column>
    <Box column class="outer-container">
      <Box class="tabs">
        <Tabs {labelList} on:change={onTabsChangeHandle} />
      </Box>
      {#each userMessageList as list, i (i)}
        <MessageReply isShowUser={false} isShowBtn={true} {...list} />
      {/each}
    </Box>
  </Column>
</Grid>

<style lang="scss">
  :global(.top-margin) {
    margin-top: 5px !important;
  }
  :global(.bottom-margin) {
    margin-bottom: 5px !important;
  }
  :global(html) {
    height: 100%;
  }
  :global(body) {
    background-color: #424242;
  }
  :global(.inherit-height) {
    height: inherit;
  }
  
  :global(.tabs) {
    padding: 15px 30px;
  }
</style>
