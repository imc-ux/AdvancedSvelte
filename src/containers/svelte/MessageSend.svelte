<!-- /**
 * Summary: 发送留言或评论组件
 * Created: 2021/06/18
 * Author1: liuzhe
 * © 2021 iMarketChina Co.,Ltd. All rights reserved.
 */ -->

<script>
  import { Box, Button, TextArea } from "@/components/sveltecomponents";
  import SendAlt from "carbon-icons-svelte/lib/SendAlt.svelte";
  import {UserInfo} from '@/utils/Settings';
  import messageStore from '@/store/MessageSendStore';
  import { autorun } from 'mobx';
  import { createEventDispatcher } from 'svelte';
  import { onDestroy } from "svelte";

  const dispatch = createEventDispatcher();

  export let messageId = '';

  let messageText = '';

  onDestroy(() => {
    disposer();
  });

  const disposer = autorun(() => {
   if (messageStore.addMessageBoardResult) {
     const value = JSON.parse(JSON.stringify(messageStore.addMessageBoardResult));
     if(value && !value.error){
      if(value.data && value.data.length > 0){
        dispatch("sendSuccess", {
      			data: messageId,
      		});
      }
     }else{
       CustomAlert(CommonAlert.INTERNET_ERROR, AlertIcon.ERROR);
     }
   }
 });

  function onMessageTextAreaBlurHandler(event) {
    messageText = event.detail.data
  }

  function onSendBtnClickHandler(){
    const MessageBoardSearchInfo = {
      userId: UserInfo.userId,
      content: messageText,
      relateNid: messageId
    };
    messageStore.addMessageBoard(MessageBoardSearchInfo);
  }
</script>

<Box column>
  <TextArea
    value = {messageText}
    class="bottom-margin"
    placeholder="Enter a description..."
    on:blur={onMessageTextAreaBlurHandler}
  />
  <Box horizontalAlign="right">
    <Button icon={SendAlt} on:click={onSendBtnClickHandler}>发表</Button>
  </Box>
</Box>
