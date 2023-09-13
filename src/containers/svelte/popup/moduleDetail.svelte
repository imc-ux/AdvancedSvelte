<script>
  import "@/styles/core/white.css";
  import {
    Input,
    Box,
    Text,
    TextArea,
    Select,
  } from "@/components/sveltecomponents";
  import { onMount, onDestroy } from "svelte";
  import { CommonAlert } from "@/constant/alert/Base";
  import { autorun } from "mobx";
  import CustomAlert, { AlertIcon } from "@/components/CustomAlert";

  const list = [
    { name: "--请选择--", code: "" },
    { name: 1, code: 1 },
    { name: 2, code: 2 },
    { name: 3, code: 3 },
    { name: 4, code: 4 },
    { name: 5, code: 5 },
  ];
  let bizList = [];
  let checkList = [];
  let selectedBiz = "";
  let selectUrgent = "";
  let selectedCheck = "";
  let listMessage = "";
  let jtracNo = "";
  let versionNo = "";
  let detailMessage = "";

  export let params;

  onMount(() => {
    searchBizDebeloper();
    searchCheckList();
    searchJtrac();
  });

  onDestroy(() => {
    disposerPerson();
    disposerJtrac();
    disposerList();
  });

  const disposerPerson = autorun(() => {
    if (jtracStore.userPersionResult) {
      const value = JSON.parse(JSON.stringify(jtracStore.userPersionResult));
      jtracStore.userPersionResult = null;
      if (!value.error) {
        let list = value.data;
        list.unshift({ name: "--请选择--", id: "" });
        checkList = list;
      } else {
        CustomAlert(CommonAlert.INTERNET_ERROR, AlertIcon.ERROR);
      }
    }
  });

  const disposerJtrac = autorun(() => {
    if (jtracStore.searchJtracResult) {
      const value = JSON.parse(JSON.stringify(jtracStore.searchJtracResult));
      jtracStore.searchJtracResult = null;
      if (!value.error && value.data.length > 0) {
        let jtracInfo = value.data[0];
        jtracNo = jtracInfo.jtracNo;
        versionNo = jtracInfo.version;
        detailMessage = jtracInfo.detail;
        selectedCheck = jtracInfo.reviewer;
        selectedBiz = jtracInfo.bizDeveloper;
        selectUrgent = jtracInfo.urgencyFlag;
        listMessage = String(jtracInfo.fileList).replace(/,/g, "\r");
      }
    }
  });

  const disposerList = autorun(() => {
    if (jtracStore.userListResult) {
      const value = JSON.parse(JSON.stringify(jtracStore.userListResult));
      jtracStore.userListResult = null;
      if (!value.error) {
        let values = value.data;
        values.unshift({ name: "--请选择--", id: "" });
        bizList = values;
      } else {
        CustomAlert(CommonAlert.INTERNET_ERROR, AlertIcon.ERROR);
      }
    }
  });

  function searchJtrac() {
    const info = {
      clientDeveloperId: "",
      modules: "",
      jtracUniqFlag: "Y",
      dateFrom: "",
      dateTo: "",
      status: "B",
      jtracNo: params.name,
      iStart: 0,
      iPageCount: 10000,
    };
    jtracStore.searchUniqJtracList(info);
  }

  function searchBizDebeloper() {
    const info = {
      blockflag: "N",
      usertype: "P",
      iStart: 0,
      iPageCount: 20,
    };
    jtracStore.getUserList(info);
  }

  function searchCheckList() {
    const strs = ["O"];
    jtracStore.getUserCheckPersonList(strs);
  }
</script>

<Box column>
  <Box horizontalAlign="left">
    <Text>jtracNo</Text>
  </Box>
  <Box horizontalAlign="left" class="multi-step-checkout-step-section">
    <Input bind:value={jtracNo} />
  </Box>
  <Box horizontalAlign="left">
    <Text>version</Text>
  </Box>
  <Box horizontalAlign="left" class="multi-step-checkout-step-section">
    <Input bind:value={versionNo} />
  </Box>
  <Box horizontalAlign="left">
    <Text>detail</Text>
  </Box>
  <Box class="multi-step-checkout-step-section">
    <TextArea bind:value={detailMessage} class="bottom-margin" />
  </Box>
  <Box horizontalAlign="left">
    <Text>代码检查负责人</Text>
  </Box>
  <Box horizontalAlign="left" class="multi-step-checkout-step-section">
    <Select
      hideLabel
      bind:selected={selectedCheck}
      dataProvider={checkList}
      labelField="name"
      codeField="id" />
  </Box>
  <Box horizontalAlign="left">
    <Text>列表</Text>
  </Box>
  <Box class="multi-step-checkout-step-section">
    <TextArea bind:value={listMessage} class="bottom-margin" />
  </Box>
  <Box horizontalAlign="left">
    <Text>后台负责人</Text>
  </Box>
  <Box horizontalAlign="left" class="multi-step-checkout-step-section">
    <Select
      hideLabel
      dataProvider={bizList}
      bind:selected={selectedBiz}
      labelField="name"
      codeField="id" />
  </Box>
  <Box horizontalAlign="left" class="multi-step-checkout-step-section">
    <Select
      labelText="紧急程度"
      dataProvider={list}
      bind:selected={selectUrgent}
      labelField="name"
      codeField="code" />
  </Box>
</Box>

<style>
  :global(.multi-step-checkout-step-section) {
    border-bottom: 1px dashed #e6e6e6;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
  :global(.bottom-margin) {
    margin-bottom: 5px;
  }
</style>
