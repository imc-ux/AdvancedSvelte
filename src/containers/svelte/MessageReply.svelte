<!--
/**
 * Summary: 留言回复组件
 * Created: 2022/04/25
 * Author1: lixiaozheng
 * Author2:
 */
-->
<script lang="ts">
  import "@/styles/core/white.css";
  import { createEventDispatcher } from "svelte";
  import {
    Image,
    Button,
    Text,
    Box,
    Divider,
    Icons,
  } from "@/components/sveltecomponents";
  import { autorun } from "mobx";
  import { onMount, onDestroy } from "svelte";
  import messageStore from "@/store/MessageReplyStore";
  import { UserInfo } from "@/utils/Settings";
  import CustomAlert, { AlertIcon } from "@/components/CustomAlert";
  import { CommonAlert } from "@/constant/alert/Base";

  const dispatch = createEventDispatcher();

  export let nid: string = "";
  export let userName: string = "";
  export let userId: string = "";
  export let userUrl: string = "";
  export let messageTime: string = "";
  export let content: string = "";
  export let isShowUser: boolean = true;
  export let actionList = [];
  let likeCount: number | string = 0;
  let disLikeCount: number | string = 0;

  onMount(() => {
    if (actionList.length > 0) {
      operateListHandler(actionList);
    }
  });

  onDestroy(() => {
    disposer();
  });

  const disposer = autorun(() => {
    if (messageStore.getMessageBoardActionResult) {
      const value = JSON.parse(
        JSON.stringify(messageStore.getMessageBoardActionResult)
      );
      if (value && !value.error) {
        if (value.data.length > 0) {
          const value = [...value.data];
          operateListHandler(value);
        }
      } else {
        CustomAlert(CommonAlert.INTERNET_ERROR, AlertIcon.ERROR);
      }
    } else if (messageStore.operateMessageBoardResult) {
      const value = JSON.parse(
        JSON.stringify(messageStore.operateMessageBoardResult)
      );
      if (value && !value.error) {
        console.log(value);
        getOperateList();
      } else {
        CustomAlert(CommonAlert.INTERNET_ERROR, AlertIcon.ERROR);
      }
    }
  });

  function getOperateList() {
    messageStore.getMessageBoardActionList(nid);
  }

  function operateListHandler(data: any[]) {
    const liskList = data?.filter(
      (ele) => ele.actionType === "A" && ele.status === "Y"
    );
    const disLiskList = data?.filter(
      (ele) => ele.actionType === "B" && ele.status === "Y"
    );
    likeCount = liskList?.length ?? 0;
    disLikeCount = disLiskList?.length ?? 0;
  }

  function onBtnLikeClickHandler(e: CustomEvent) {
    const req = {
      relateNid: nid,
      userId: UserInfo.userId,
      actionType: "A",
    };
    messageStore.operateMessageBoard(req);
  }

  function onBtnDisLikeClickHandler(e: CustomEvent) {
    const req = {
      relateNid: nid,
      userId: UserInfo.userId,
      actionType: "B",
    };
    messageStore.operateMessageBoard(req);
  }

  function onGotoUserDetaiHandler(e) {
    dispatch("userDetail", {
      e: e.detail.event,
      userId: userId,
      userName: userName,
      userUrl: userUrl,
    });
  }
</script>

<Box column class="message-reply-main">
  {#if isShowUser}
    <Divider />
    <Box>
      <Box style="flex: 1" verticalAlign="middle">
        <Box
          style="width: 40px; height: 40px; cursor: pointer"
          on:click={onGotoUserDetaiHandler}>
          <Image src={userUrl} alt={userName} />
        </Box>
        <Box style="flex: 1">
          <Text
            bold
            singleLine
            class="cursorPointer"
            on:click={onGotoUserDetaiHandler}>{userName}</Text>
        </Box>
      </Box>
      <Box style="width: 200px" horizontalAlign="right" verticalAlign="middle">
        <Text singleLine>{messageTime}</Text>
      </Box>
    </Box>
  {/if}
  <Box>
    <Text class="message-board-content">{content}</Text>
  </Box>
  <Box class="dis-flex">
    <Button size="small" icon={Icons.ThumbsUp} on:click={onBtnLikeClickHandler}>
      {likeCount}
    </Button>
    <Button
      kind="secondary"
      size="small"
      icon={Icons.ThumbsDown}
      on:click={onBtnDisLikeClickHandler}>
      {disLikeCount}
    </Button>
  </Box>
  {#if !isShowUser}
    <Divider />
  {/if}
</Box>

<style lang="scss">
  :global(.message-reply-main) {
    & {
      padding: 15px 30px;
    }

    :global(.message-board-content) {
      text-align: left;
      margin: 8px 0;
      line-height: 1.5;
    }

    :global(.cursorPointer) {
      cursor: pointer;
    }
  }
</style>
