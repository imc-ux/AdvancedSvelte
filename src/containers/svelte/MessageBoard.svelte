<!-- /**
 * Summary: 留言板主页
 * Created: 2021/06/18
 * Author1: liuzhe
 * © 2021 iMarketChina Co.,Ltd. All rights reserved.
 */ -->
<script>
  import "@/styles/core/white.css";
  import "@/styles/core/index.scss";
  import Edit from "carbon-icons-svelte/lib/Edit.svelte";
  import { Grid, Row, Column } from "carbon-components-svelte";
  import { Box, Button, Link } from "@/components/sveltecomponents";
  import { onMount, onDestroy } from "svelte";
  import { autorun } from "mobx";
  import messageStore from "@/store/MessageBoardStore";
  import MessageList from "./MessageList";
  import MessageSend from "./MessageSend";
  import DownToBottom from "carbon-icons-svelte/lib/DownToBottom.svelte";
  import Storage from "@/utils/Storage";

  const PAGE_SIZE = 20;

  let isShowMsgText = false;
  let messageBoardList = [];
  let moreLength = 1;
  let index = 0;

  onMount(() => {
    let currentTheme = Storage.getLocalItem("svelte-theme") ?? "ux-green-light";
    document.body.setAttribute('data-bs-theme', currentTheme);
    searchMessageList(0);
    window.addEventListener("message", themeChangeHandler, false);
  });

  function themeChangeHandler(e){
    if (e.data.type === "theme-changed") {
      document.body.setAttribute("data-bs-theme", e.data.data);
    }
  }  

  onDestroy(() => {
    disposer();
  });

  const disposer = autorun(() => {
    if (messageStore.searchMessageBoardResult) {
      const value = JSON.parse(
        JSON.stringify(messageStore.searchMessageBoardResult)
      );
      if (value && !value.error) {
        if (value.data.length > 0) {
          value.data?.forEach(elem=>{
            elem.userName = elem.userName === 'null' ? '匿名用户': elem.userName;
          })
          if (index === 0) {
            messageBoardList = value.data;
          } else {
            messageBoardList = messageBoardList.concat(value.data);
          }
        }
        if (index === 0) {
          moreLength = 1;
        } else {
          moreLength = value.data.length;
        }
      } else {
        CustomAlert(CommonAlert.INTERNET_ERROR, AlertIcon.ERROR);
      }
    }
  });

  function searchMessageList(startIndex) {
    index = startIndex;
    const MessageBoardSearchInfo = {
      iStart: startIndex,
      iPageCount: PAGE_SIZE,
    };
    messageStore.searchMessageBoard(MessageBoardSearchInfo);
  }

  function onAddMessageBtnClickHandler() {
    isShowMsgText = !isShowMsgText;
  }

  function onMessageSendSuccessHandler(data) {
    if (!data.detail.data) {
      searchMessageList(0);
    }
  }

  function onMoreMessageLinkClickHandler() {
    searchMessageList(messageBoardList.length);
  }
</script>

<Grid padding class="inherit-height">
  <Row class="inherit-height">
    <Column>
      <Box column class="outer-container">
        <Box horizontalAlign="right">
          <Button icon={Edit} on:click={onAddMessageBtnClickHandler}
            >写留言</Button>
        </Box>
        <hr style="height:1px;margin: 5px 0 5px 0" />
        {#if isShowMsgText}
          <MessageSend on:sendSuccess={onMessageSendSuccessHandler} />
        {/if}
        <Box column verticalAlign="top">
          {#each messageBoardList as messageDetail, i (messageDetail.nid)}
            <MessageList
              figureUrl={messageDetail.userFigure}
              userName={messageDetail.userName}
              messageInfo={messageDetail} />
            {#if i === messageBoardList.length - 1 && messageBoardList.length % 20 === 0 && moreLength > 0}
              <Box horizontalAlign="compact" width="100%" class="top-margin">
                <Link
                  icon={DownToBottom}
                  class="cursor-pointer"
                  on:click={onMoreMessageLinkClickHandler}>更多留言...</Link>
              </Box>
            {/if}
          {/each}
        </Box>
      </Box>
    </Column>
  </Row>
</Grid>

<style>
  :global(.top-margin) {
    margin-top: 5px !important;
  }
  :global(.bottom-margin) {
    margin-bottom: 5px !important;
  }
  :global(html) {
    height: 100%;
  }  
  :global(.inherit-height) {
    height: inherit;
  }
  
</style>
