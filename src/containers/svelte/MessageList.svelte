<!-- /**
 * Summary: 留言列表组件
 * Created: 2021/06/18
 * Author1: liuzhe
 * © 2021 iMarketChina Co.,Ltd. All rights reserved.
 */ -->
<script>
  import { Button } from "carbon-components-svelte";
  import {
    Box,
    TextArea,
    Divider,
    Grid,
    Row,
    Image,
    Column,
    Text,
    Link,
  } from "@/components/sveltecomponents";
  import ThumbsUp from "carbon-icons-svelte/lib/ThumbsUp.svelte";
  import ThumbsDown from "carbon-icons-svelte/lib/ThumbsDown.svelte";
  import Chat from "carbon-icons-svelte/lib/Chat.svelte";
  import MessageReply from "./MessageReply";
  import messageStore from "@/store/MessagelistStore";
  import Edit from "carbon-icons-svelte/lib/Edit.svelte";
  import { draw } from "svelte/transition";
  import MessageSend from "./MessageSend";
  import { UserInfo } from "@/utils/Settings";
  import { autorun } from "mobx";
  import { onMount, onDestroy } from "svelte";
  import DownToBottom from "carbon-icons-svelte/lib/DownToBottom.svelte";
  import CustomAlert, { AlertIcon } from "@/components/CustomAlert";
  import { CommonAlert } from "@/constant/alert/Base";

  export let figureUrl = "static/uploadsys/images/common/profile-pic.png"; //留言头像
  export let userName = "张道长"; //留言用户名
  export let messageInfo; //留言所有信息
  export let showBottomBorder = true; //是否显示最下的线

  const messageDate = messageInfo.createDate || "2022-05-09 21:00"; //留言时间
  const messageConent =
    messageInfo.content ||
    "晚餐是一天当中最容易控制的一餐，因为晚间的活动减少，基本上人体的新陈代谢处于比较慢的过程，适当的摄入一些富含维生素的食物，基本上可以满足人体的需要。当然，如果是一些上夜班的人群，由于体力的消耗，还是要保证身体的营养所需。一般情况下，健康的晚餐可以选择用燕麦粥代替主食，饭后适当的吃一个苹果或者是香蕉，可以帮助消化，预防肥胖。";
  const PAGE_SIZE = 20;

  let commentNum = messageInfo.totalReplyCount || 0; //评论数量

  let isShowComment = false; //是否显示评论
  let isShowMsgText = false; //是否显示发评论框

  let commentList = [];
  let upNum = 0;
  let myUpNum = 0;
  let downNum = 0;
  let myDownNum = 0;
  let moreLength = 1;
  let index = 0;
  let nid = 0;

  $: commentLinkText =
    commentNum <= 0
      ? "还没有人评论"
      : isShowComment
      ? "收起评论"
      : `${commentNum}条评论`;

  $: showUpNum = upNum + myUpNum;
  $: showDownNum = downNum + myDownNum;

  let outerBoxClass = [showBottomBorder && "list-bottom-boder"]
    .filter(Boolean)
    .join(" ");

  //初始计算点赞数和踩数
  onMount(() => {
    if (messageInfo.actionList.length > 0) {
      messageInfo.actionList.forEach((item) => {
        if (item.actionType === "A" && item.status === "Y") {
          if (item.userId === UserInfo.userId) {
            myUpNum = 1;
          } else {
            upNum++;
          }
        } else if (item.actionType === "B" && item.status === "Y") {
          if (item.userId === UserInfo.userId) {
            myDownNum = 1;
          } else {
            downNum++;
          }
        }
      });
    }
  });

  onDestroy(() => {
    disposer();
  });

  //点击评论link
  function onCommentLinkClickHandler() {
    isShowComment = !isShowComment;
    searchCommentList(0);
  }

  //查询评论
  function searchCommentList(startIndex) {
    index = startIndex;
    const MessageBoardSearchInfo = {
      iStart: startIndex,
      iPageCount: PAGE_SIZE,
      relateNid: messageInfo.nid,
    };
    messageStore.searchMessageBoard(MessageBoardSearchInfo);
  }

  const disposer = autorun(() => {
    if (messageStore.searchMessageBoardResult) {
      const value = JSON.parse(
        JSON.stringify(messageStore.searchMessageBoardResult)
      );
      if (value && !value.error) {
        if (value.data.length > 0) {
          if (messageInfo.nid.toString() === value.data[0].relateNid) {
            if (index === 0) {
              commentList = value.data;
            } else {
              commentList = commentList.concat(value.data);
            }
          }
          if (index === 0) {
            moreLength = 1;
          } else {
            moreLength = value.data.length;
          }
        }
      } else {
        CustomAlert(CommonAlert.INTERNET_ERROR, AlertIcon.ERROR);
      }
    }
  });

  function onAddMessageBtnClickHandler() {
    isShowMsgText = !isShowMsgText;
  }

  //点赞或踩的请求
  function clickPreference(actionType) {
    const MessageBoardActionInfo = {
      relateNid: messageInfo.nid,
      userId: UserInfo.userId,
      actionType: actionType,
    };
    messageStore.operateMessageBoard(MessageBoardActionInfo);
  }

  //点赞
  function onUpBtnClickHandler() {
    if (myUpNum === 0) {
      myUpNum++;
    } else {
      myUpNum--;
    }
    clickPreference("A");
  }

  //踩
  function onDownBtnClickHandler() {
    if (myDownNum === 0) {
      myDownNum++;
    } else {
      myDownNum--;
    }
    clickPreference("B");
  }

  // 评论成功回调
  function onMessageSendSuccessHandler(data) {
    if (data.detail.data) {
      commentNum++;
      searchCommentList(0);
    }
  }

  function onMoreCommentLinkClickHandler() {
    searchCommentList(commentList.length);
  }
</script>

<Box
  class="list-bottom-boder"
  verticalAlign="middle"
  horizontalAlign="compact"
  style="width: 100%;">
  <Box width={100}>
    <Box width={100} horizontalAlign="compact" verticalAlign="middle">
      <Text style="width:50px">{userName}</Text>
      <Box
        width={50}
        height={50}
        horizontalAlign="compact"
        verticalAlign="middle">
        <Image src={figureUrl} />
      </Box>
    </Box>
  </Box>
  <Box f={1} column>
    <Text>{messageDate}</Text>
    <Box class="top-margin" horizontalAlign="left">
      <Text style="line-height: 20px;">{messageConent}</Text>
    </Box>
    <Box class="top-margin" verticalAlign="middle">
      {#if showUpNum > 0}
        <Button
          iconDescription="Up"
          size="small"
          icon={ThumbsUp}
          on:click={onUpBtnClickHandler}>{showUpNum}</Button>
      {:else}
        <Button
          iconDescription="Up"
          size="small"
          icon={ThumbsUp}
          on:click={onUpBtnClickHandler} />
      {/if}
      {#if showDownNum > 0}
        <Button
          iconDescription="Down"
          size="small"
          icon={ThumbsDown}
          on:click={onDownBtnClickHandler}>{showDownNum}</Button>
      {:else}
        <Button
          iconDescription="Down"
          size="small"
          icon={ThumbsDown}
          on:click={onDownBtnClickHandler} />
      {/if}
      <Link
        icon={Chat}
        class="cursor-pointer"
        on:click={onCommentLinkClickHandler}>{commentLinkText}</Link>
    </Box>
    {#if isShowComment}
      <Box class="top-margin commentContainer" column>
        <Box horizontalAlign="right">
          <Button
            size="small"
            icon={Edit}
            on:click={onAddMessageBtnClickHandler}>写评论</Button>
        </Box>
        <hr style="height:1px;margin: 5px 0 5px 0" />
        {#if isShowMsgText}
          <MessageSend
            messageId={messageInfo.nid}
            on:sendSuccess={onMessageSendSuccessHandler} />
        {/if}
        {#each commentList as commentDetail, i (commentDetail.nid)}
          <MessageReply
            nid={commentDetail.nid}
            userName={commentDetail.userName}
            userId={commentDetail.userId}
            userUrl={commentDetail.userFigure}
            messageTime={commentDetail.createDate}
            content={commentDetail.content}
            actionList={commentDetail.actionList} />
          {#if i === commentList.length - 1 && commentList.length % PAGE_SIZE === 0 && moreLength > 0}
            <Box
              horizontalAlign="compact"
              style="width:100%"
              class="top-margin">
              <Link
                icon={DownToBottom}
                class="cursor-pointer"
                on:click={onMoreCommentLinkClickHandler}>更多评论...</Link>
            </Box>
          {/if}
        {/each}
      </Box>
    {/if}
  </Box>
</Box>

<style>
  :global(.list-bottom-boder) {
    border-bottom: 1px solid black;
  }

  :global(.cursor-pointer) {
    cursor: pointer;
  }

  :global(.commentContainer) {
    padding: 5px;
    box-shadow: 0 0 2px 2px #9e9e9e;
  }
</style>
