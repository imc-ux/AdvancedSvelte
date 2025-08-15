<script lang="ts">
  import "@/styles/core/index.scss";
  import { Input, Button, Text } from "@/components/sveltecomponents";
  import { onMount, onDestroy } from "svelte";
  import { copyToClipboard } from "@/utils/CommonUtils";

  let currentTime = getCurrentTime();
  let timer: any;
  let timestampInput: string | number = "";
  let timeUTCOutput: string | number = "";
  let timeUTCInput: string = "";
  let timestampOutput: string | number = "";
  let time: Date;
  let YYYY: number;
  let MM: number;
  let dd: number;
  let hh: number;
  let mm: number;
  let ss: number;

  const CLEAR_ONE = 1;
  const CLEAR_TWO = 2;
  const TS_MIN = -8640000000000000;
  const TS_MAX = Math.abs(TS_MIN);

  onMount(() => {
    timer = setInterval(() => {
      currentTime = getCurrentTime();
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(timer);
  });

  function getCurrentTime() {
    return new Date().getTime();
  }

  function onClearAllHandler() {
    timestampInput = "";
    timeUTCOutput = "";
    timeUTCInput = "";
    timestampOutput = "";
  }

  const onClearValueHandler = (num: number) => {
    if (num === CLEAR_ONE) {
      timestampInput = "";
    } else if (num === CLEAR_TWO) {
      timeUTCInput = "";
    }
  };

  function onConvertUTCTimeHandler() {
    if (Number(timestampInput) < TS_MIN || Number(timestampInput) > TS_MAX) {
      timeUTCOutput = "";
      alert(
        "请输入正确的时间戳！取值范围:-8640000000000000 ~ 8640000000000000"
      );
      return;
    } else if (timestampInput) {
      time = new Date(Number(timestampInput));
      YYYY = time.getFullYear();
      MM = time.getMonth() + 1;
      dd = time.getDate();
      hh = time.getHours();
      mm = time.getMinutes();
      ss = time.getSeconds();
      if (YYYY < 0) {
        timeUTCOutput =
          "公元前" +
          " " +
          YYYY * -1 +
          "-" +
          MM +
          "-" +
          dd +
          " " +
          hh +
          ":" +
          mm +
          ":" +
          ss;
      } else {
        timeUTCOutput =
          YYYY + "-" + MM + "-" + dd + " " + hh + ":" + mm + ":" + ss;
      }
      return timeUTCOutput;
    }
  }

  function onConvertGTMTimeHandler() {
    const time = Date.parse(timeUTCInput);
    if (Number.isNaN(time)) {
      timestampOutput = "";
      alert("输入时间不合法！");
    } else {
      if (timeUTCInput.trim()[0] === "-") {
        timestampOutput = "";
        alert("该写法不支持！");
        return;
      }
      timestampOutput = new Date(timeUTCInput).getTime();
    }
  }

  function onInputValueHandler() {
    timestampInput = timestampInput as string;
    timestampInput = timestampInput.replace(/[^\d\-]/g, "");
  }
</script>

<div class="wrap">
  <div class="base">
    <div class="current-time">
      <Text class="text-style">现在的时间戳是：</Text>
      <Text class="times-color text-style">{currentTime}</Text>
      <Button class="btn-style-s" on:click={copyToClipboard(currentTime)}
        >复制</Button>
      <Button class="btn-style-s" on:click={onClearAllHandler}>一键清空</Button>
    </div>
    <div class="content-box">
      <span class="text-style">时间戳：</span>
      <div class="time-box">
        <Input
          type="text"
          class="input-style"
          bind:value={timestampInput}
          on:input={onInputValueHandler} />
        <Text class="text-style">单位：毫秒(ms)</Text>
        <Button
          class="btn-style-s"
          on:click={() => onClearValueHandler(CLEAR_ONE)}>清空</Button>
      </div>
      <div class="tc">
        <Button class="btn-style full-width" on:click={onConvertUTCTimeHandler}
          ><span class="btn-span">转换为北京时间</span></Button>
      </div>
      <span class="text-style">北京时间：</span>
      <div class="time-box">
        <span class="output">{timeUTCOutput}</span>
        <Button class="btn-style-s" on:click={copyToClipboard(timeUTCOutput)}
          >复制</Button>
      </div>
    </div>
    <div class="cut-line" />
    <div class="content-box">
      <span class="text-style">北京时间：</span>
      <div class="time-box">
        <Input type="text" class="input-style" bind:value={timeUTCInput} />
        <Button
          class="btn-style-s"
          on:click={() => onClearValueHandler(CLEAR_TWO)}>清空</Button>
      </div>
      <div class="tc">
        <Button class="btn-style full-width" on:click={onConvertGTMTimeHandler}
          ><span class="btn-span">转换为时间戳</span></Button>
      </div>
      <span class="text-style">时间戳：</span>
      <div class="time-box">
        <span class="output flex-1">{timestampOutput}</span>
        <Text class="text-style">单位：毫秒(ms)</Text>
      </div>
    </div>
  </div>
</div>

<style>
  .wrap {
    display: flex;
    justify-content: center;
  }
  .base {
    height: 560px !important;
    width: 68% !important;
    min-width: 1000px;
    margin: 15px;
    padding: 25px;
    background-color: #dcf4f4;
    border: 1px solid #b3e2dd;
    box-shadow: 2px 2px 10px rgba(48, 156, 199, 0.2);
  }
  :global(.times-color) {
    color: #057c79;
  }
  :global(.full-width) {
    width: 100%;
  }
  .time-box {
    display: flex;
  }
  .flex-1 {
    flex: 1;
  }
  .tc {
    text-align: center;
  }
  :global(.current-time) {
    margin-bottom: 15px;
    display: flex;
  }
  :global(.btn-span) {
    display: inline-block;
    width: 100%;
    text-align: center;
  }
  .content-box {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }
  .text-style {
    height: 28px;
    line-height: 28px;
    margin-right: 10px;
    font-size: 14px;
  }
  :global(.input-style) {
    border: 1px solid #ccc;
    background-color: #fff;
    height: 32px;
  }
  :global(.btn-style-s) {
    border: 1px solid #1d8478;
    color: #fff;
    background-color: #2ea698;
    padding: 2px 10px;
    border-radius: 2px;
    margin: 0 0 0 5px;
  }
  :global(.btn-style-s):hover {
    background-color: #08adaa;
  }
  :global(.btn-style) {
    border: 1px solid #1d8478;
    color: #fff;
    background-color: #2ea698;
    padding: 2px 10px;
    border-radius: 2px;
    margin: 10px 0;
  }
  :global(.btn-style):hover {
    background-color: #08adaa;
  }
  .cut-line {
    height: 0.5px;
    background-color: #b9e5e0;
    margin: 45px auto;
    width: 85%;
  }
  .output {
    display: inline-block;
    height: 32px;
    background-color: #f3f3f3;
    line-height: 32px;
    border: 1px solid #ccc;
    width: 100%;
    padding-left: 1rem;
  }
</style>
