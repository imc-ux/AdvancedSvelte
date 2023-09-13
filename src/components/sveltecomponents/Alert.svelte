<!--
/**
* Summary: Alert控件
* Created: 2022/07/27
* Author1: ljh
* Author2:
*/
-->
<script>
  import '@/styles/core/white.css';
  import { Box, Image, Button } from '@/components/sveltecomponents';
  import { Modal } from 'carbon-components-svelte';
  import { onMount } from 'svelte';
  import icon_delete from '../../../static/uploadsys/images/alert/alert_icon_delete.png';
  import icon_question from '../../../static/uploadsys/images/alert/alert_icon_question.png';
  import icon_succeed from '../../../static/uploadsys/images/alert/alert_icon_succeed.png';
  import icon_warning from '../../../static/uploadsys/images/alert/alert_icon_warning.png';

  export let text = '';
  export let size = 'xs';
  export let passiveModal = true;
  export let title = '';
  export let icon = 1;
  export let remove = undefined;
  export let onClose;

  let div = null;
  let alertRef = null;

  onMount(() => {
    let titleDiv = alertRef.getElementsByClassName('bx--modal-header')[0];
    titleDiv.addEventListener('mousedown', mouseDown);
    div = alertRef.getElementsByClassName('bx--modal-container bx--modal-container--xs')[0];
    titleDiv.removeChild(alertRef.getElementsByClassName('bx--modal-close')[0]);
    titleDiv.style.height = '28px';
  });

  $: props = {
    ...$$restProps,
  };

  function handlerClose() {
    remove();
  }

  function onYesBtnClickHandler() {
    onClose?.('Y');
    remove();
  }

  function onNoBtnClickHandler() {
    onClose?.('N');
    remove();
  }

  function mouseDown(event) {
    event = window.event;
    let offsetX = event.offsetX;
    let offsetY = event.offsetY;
    let x = offsetX;
    let y = offsetY;

    document.onmousemove = function (e) {
      e = window.event;
      let clientX = e.clientX;
      let clientY = e.clientY;
      move(div, clientX - x, clientY - y);
    };

    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  }

  function move(div, x, y) {
    let winWid = document.body.clientWidth;
    let winHei = document.body.clientHeight;
    winWid = winWid - 10 - div.offsetWidth;
    winHei = winHei - 10 - div.offsetHeight;
    if (x <= 0) {
      x = 10;
    }
    if (y <= 0) {
      y = 10;
    }
    if (x > winWid) {
      x = winWid;
    }
    if (y > winHei) {
      y = winHei;
    }
    div.style.top = y + 'px';
    div.style.left = x + 'px';
  }
</script>

<Modal
  open={true}
  bind:ref={alertRef}
  modalHeading={title}
  {passiveModal}
  {size}
  {...props}
  selectorPrimaryFocus=".bottom-margin"
  preventCloseOnClickOutside
  on:close={handlerClose}
  class="alert-box"
>
  <Box class="alert-content">
    <Box class="icon-box">
      {#if icon === 0}
        <Image src={icon_succeed} />
      {:else if icon === 1}
        <Image src={icon_warning} />
      {:else if icon === 2}
        <Image src={icon_question} />
      {:else if icon === 3}
        <Image src={icon_delete} />
      {/if}
    </Box>
    <div class="bottom-margin text-height">{text}</div>
  </Box>
  <Box class="btn-margin">
    {#if icon !== 2}
      <Button kind="tertiary" on:click={handlerClose} class="agree-button">确定</Button>
    {:else}
      <Button kind="tertiary" on:click={onYesBtnClickHandler} class="opt-button">Yes</Button>
      <Button kind="tertiary" on:click={onNoBtnClickHandler} class="opt-button right-button">No</Button>
    {/if}
  </Box>
</Modal>

<style>
  :global(.bottom-margin) {
    margin-top: 5px;
    max-height: 140px;
    max-width: 300px;
    padding-left: 20px;
    overflow: auto;
    white-space: pre-wrap;
    word-break: break-word;
  }

  :global(.btn-margin) {
    /* margin-bottom: 10px; */
    justify-content: space-between !important;
  }

  :global(.text-height) {
    height: auto;
    line-height: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  :global(.icon-box) {
    width: 40px !important;
    height: 40px !important;
  }

  :global(.alert-content) {
    display: flex;
    align-items: center !important;
    min-height: 70px !important;
    padding-left: 12.5px;
    padding-bottom: 8px;
  }

  :global(.agree-button) {
    margin-bottom: 0px;
    height: 24px;
    font-size: 13px;
    margin: auto;
  }

  :global(.opt-button) {
    margin-bottom: 0px;
    height: 24px;
    font-size: 13px;
  }
</style>
