<!--
/**
* Summary: pop控件
* Created: 2022/08/03
* Author1: ljh
* Author2: kang jiaqi
*/
-->
<script>
  import { Modal } from "carbon-components-svelte";
  import { onMount } from "svelte";

  export let title = "";
  export let mountNode;
  export let params;
  export let onClose;
  export let remove;
  export let size;

  let popRef = null;
  let sizeRef = null;

  $: props = {
    ...$$restProps,
  };

  onMount(() => {
    let titleDiv = popRef.getElementsByClassName(
      "bx--modal-header__heading"
    )[0];
    titleDiv.addEventListener("mousedown", mouseDown);
    sizeRef = popRef.getElementsByClassName("bx--modal-container")[0];
    if (size) {
      sizeRef.style.width = size.width;
      sizeRef.style.height = size.height;
    }
  });

  function handlerClose() {
    mountNode = null;
    onClose?.();
    remove();
  }

  function onCloseHandler(data) {
    mountNode = null;
    onClose?.(data);
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
      move(sizeRef, clientX - x, clientY - y);
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
    div.style.top = y + "px";
    div.style.left = x + "px";
  }
</script>

<Modal
  open={true}
  bind:ref={popRef}
  modalHeading={title}
  passiveModal={true}
  selectorPrimaryFocus=".margin_bottom"
  preventCloseOnClickOutside
  {...props}
  on:close={handlerClose}>
  <svelte:component this={mountNode} {params} onClose={onCloseHandler} />
</Modal>

<style>
  :global(.bx--modal-content) {
    padding: 8px 8px 16px 8px;
    margin: 0px;
  }

  :global(.pop_size) {
    width: 600px;
    height: 600px;
  }
</style>
