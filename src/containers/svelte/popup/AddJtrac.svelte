<!--
/**
 * Summary: 新增Jtrac
 * Created: 2022/08/30
 * Author1: ljh
 * Author2: kang jiaqi
 * © 2022 iMarketChina Co.,Ltd. All rights reserved.
 */
 -->
<script lang="ts">
  import "@/styles/core/white.css";
  import "@/styles/core/index.scss";
  import {
    Button,
    Input,
    Box,
    Text,
    TextArea,
    AdvancedSelect,
  } from "@/components/sveltecomponents";
  import { UserInfo, VERSION_REGEXP } from "@/utils/Settings";
  import { onMount, onDestroy } from "svelte";
  import { getStringAsciiNew } from "@/utils/CommonUtils";
  import { UsersInfo } from "@/vo/userManager/index";
  import { autorun } from "mobx";
  import CustomAlert, { AlertIcon } from "@/components/CustomAlert";
  import pageStore from "@/store/addjtracStore";
  import {
    urgencyList,
    jtracNoTypeList,
    systemTypeList,
  } from "@/constant/constant";
  import Save from "carbon-icons-svelte/lib/Save.svelte";
  import { setWaiting, removeWaiting } from "@/utils/loaderUtils";
  import { AddJtracAlert } from "@/constant/alert/upload";
  import { deepClone } from "@/utils/CommonUtils";

  export let onClose;
  // export let params: any;
  let jtracNo: string = "";
  let version: string = "";
  let versionMessage: string = "";
  let detailMessage: string = "";
  let listMessage: string = "";
  let moduleMessage: string = "";
  let selectedSystemFlag: string = systemTypeList[0].id;
  let selectedBiz: string = "";
  let selectedUrgency: string = "";
  let selectedReviewer: string = "";
  let selectedJtracNoType: string = jtracNoTypeList[0].name;
  let bizList: any[] = [];
  let reviewerList: any[] = [];
  let selectedReviewerValue: any = {};
  let selectedBizValue: any = {};
  let selectedJtracNoTypeValue: any = jtracNoTypeList[0];
  let selectedSystemTypeValue: any = systemTypeList[0];
  let selectedUrgencyValue: any = urgencyList[0];
  let inputVersionDisabled = false;
  let moduleInputOnly = true;

  onMount(() => {
    searchLastVersion(systemTypeList[0].id);
    searchUserCheckPerson();
    searchBizDebeloper();
  });

  onDestroy(() => {
    getJtracVersion();
    getUserCheckPersonList();
    getBizDeveloperList();
    saveJtrac();
  });

  const getJtracVersion = autorun(() => {
    if (pageStore.searchJtracVersionResult) {
      const value = deepClone(pageStore.searchJtracVersionResult);
      pageStore.searchJtracVersionResult = null;
      removeWaiting();
      if (!value.error) {
        if (value.data && String(value.data) !== "null") {
          version = value.data;
        } else {
          version = "";
          CustomAlert(AddJtracAlert.JTRAC_VERSION_EMPTY, AlertIcon.WARNING);
        }
      } else {
        version = "";
        CustomAlert(AddJtracAlert.JTRAC_VERSION_SEARCH_FAILED, AlertIcon.ERROR);
      }
    }
  });

  const getUserCheckPersonList = autorun(() => {
    if (pageStore.getUserCheckPersonListResult) {
      const value = deepClone(pageStore.getUserCheckPersonListResult);
      pageStore.getUserCheckPersonListResult = null;
      removeWaiting();
      if (!value.error) {
        reviewerList = value.data;
        let user: {} = {
          id: "",
          name: "--请选择--",
        };
        reviewerList.unshift(user);
        selectedReviewerValue = reviewerList[0];
      }
    }
  });

  const getBizDeveloperList = autorun(() => {
    if (pageStore.userListResult) {
      const value = deepClone(pageStore.userListResult);
      pageStore.userListResult = null;
      removeWaiting();
      if (!value.error) {
        bizList = value.data;
        let user: any = {
          blockFlag: "",
          id: "",
          name: "--请选择--",
          password: "",
          permissionGroup: "",
          userType: "",
        };
        bizList.unshift(user);
        selectedBizValue = bizList[0];
      }
    }
  });

  const saveJtrac = autorun(() => {
    if (pageStore.addJtracInfoResult) {
      const value = deepClone(pageStore.addJtracInfoResult);
      pageStore.addJtracInfoResult = null;
      removeWaiting();
      if (!value.error) {
        CustomAlert(value.msg, AlertIcon.SUCCESS, onClose("Y"));
        onClose();
      } else {
        CustomAlert(value.msg, AlertIcon.ERROR, onClose("Y"));
      }
    }
  });

  function searchUserCheckPerson() {
    setWaiting();
    pageStore.getUserCheckPersonList(["O"]);
  }

  function searchLastVersion(flag: string) {
    setWaiting();
    pageStore.searchJtracVersion(flag);
  }

  function searchBizDebeloper() {
    let info: UsersInfo = {};
    info.blockflag = "N";
    info.usertype = "P";
    info.iStart = 0;
    info.iPageCount = 20;
    setWaiting();
    pageStore.getUserList(info);
  }

  function validate() {
    if (!jtracNo) {
      CustomAlert(AddJtracAlert.JTRAC_NUMBER_CANNOT_EMPTY, AlertIcon.WARNING);
      return false;
    }
    if (!listMessage) {
      CustomAlert(AddJtracAlert.FILELIST_CANNOT_EMPTY, AlertIcon.WARNING);
      return false;
    }
    if (UserInfo.userId === null) {
      CustomAlert(AddJtracAlert.LOGIN_FIRST, AlertIcon.WARNING);
      onClose();
      return false;
    }
    if (detailMessage) {
      if (getStringAsciiNew(detailMessage) < 8) {
        CustomAlert(AddJtracAlert.DETAIL_MIN_8, AlertIcon.WARNING);
        return false;
      }
    }
    if (
      !selectedReviewer &&
      reviewerList.every((item) => item.id !== UserInfo.userId)
    ) {
      CustomAlert(AddJtracAlert.REVIEWER_CANNOT_EMPTY, AlertIcon.WARNING);
      return false;
    }
    return true;
  }

  function distinctList(input: string) {
    let existFiles: any[] = [];
    let inputArray: any[] = input.split(",");
    let outputArray: any[] = [];
    for (let i = 0; i < inputArray.length; i++) {
      if (
        existFiles.indexOf(inputArray[i]) === -1 &&
        inputArray[i].trim() !== ""
      ) {
        existFiles.push(inputArray[i]);
        outputArray.push(inputArray[i]);
      }
    }
    return outputArray.join(",");
  }

  function btnSaveJtracHandler() {
    if (!validate()) {
      return;
    }
    let re = /\n/g;
    let re2 = /\\/gi;
    if (
      versionMessage.trim() !== "" &&
      !VERSION_REGEXP.test(versionMessage.trim())
    ) {
      CustomAlert(AddJtracAlert.JTRAC_VERSION_FORMAT_ERROR, AlertIcon.WARNING);
      return false;
    }
    const info = {
      jtracNo: `${selectedJtracNoType}-${jtracNo.trim()}`,
      bizDeveloper: selectedBiz,
      urgencyFlag: selectedUrgency,
      reviewer: selectedReviewer,
      fileList: distinctList(
        listMessage.replace(re, ",").replace(/\r/g, ",").replace(re2, "/")
      ),
      moduleList: distinctList(
        moduleMessage.replace(re, ",").replace(/\r/g, ",").replace(re2, "/")
      ),
      systemType: selectedSystemFlag,
      clientDeveloper: UserInfo.userId,
      version: versionMessage.trim(),
      detail: detailMessage.trim(),
      status: "R",
    };
    setWaiting();
    pageStore.addJtracInfo(info);
  }

  function onReviewerSelectChangeHandler(value: any) {
    selectedReviewer = value.id;
    selectedReviewerValue = value;
  }

  function onJtracNoTypeSelectChangeHandler(value: any) {
    selectedJtracNoType = value.id;
    selectedJtracNoTypeValue = value;
  }

  function onSystemTypeSelectChangeHandler(value: any) {
    selectedSystemFlag = value.id;
    selectedSystemTypeValue = value;
    moduleMessage = value.module;
    if (value.id !== "其他") {
      searchLastVersion(value.id);
      inputVersionDisabled = false;
      moduleInputOnly = true;
    } else {
      version = "";
      versionMessage = "";
      inputVersionDisabled = true;
      moduleInputOnly = false;
    }
  }

  function onBizSelectChangeHandler(value: any) {
    selectedBiz = value.id;
    selectedBizValue = value;
  }

  function onUrgencySelectChangeHandler(value: any) {
    selectedUrgency = value.id;
    selectedUrgencyValue = value;
  }

  function onJtracNoChangeHandler(e: any) {
    jtracNo = e.detail.data;
  }

  function onVersionChangeHandler(e: any) {
    versionMessage = e.detail.data;
  }

  function onListMessageBlurHandler(e: any) {
    listMessage = switchToTextArea(e.detail.data);
  }

  function onModuleMessageBlurHandler(e: any) {
    moduleMessage = switchToTextArea(e.detail.data);
  }

  function switchToTextArea(value: string) {
    if (!value) return "";
    let result: string = value.replace(/\n/g, ",");
    result = result.replace(/\s/g, " ");
    let resultNoEmpty = result.split(",").filter((v) => {
      return v && v.trim();
    });
    const resultNoRepeat: string[] = [];
    resultNoEmpty.forEach((v) => {
      if (!resultNoRepeat.includes(v)) {
        resultNoRepeat.push(v);
      }
    });
    return resultNoRepeat.join("\n");
  }
</script>

<div id="outter">
  <Box horizontalAlign="right" class="typeLable">
    <Button
      class="button-normal margin_bottom_s button-main-style"
      size="small"
      kind="tertiary"
      icon={Save}
      on:click={btnSaveJtracHandler}
    >
      保存
    </Button>
  </Box>
  <Box class="typeLable">
    <Box
      class="addPage-list background_border"
      horizontalAlign="compact"
      verticalAlign="middle"
    >
      <Text>JtracNo</Text>
    </Box>
    <Box
      f={1}
      class="border_right_top padding-normal"
      horizontalAlign="left"
      verticalAlign="middle"
    >
      <AdvancedSelect
        options={jtracNoTypeList}
        optionIdentifier="id"
        labelIdentifier="name"
        onSubmit={(v) => onJtracNoTypeSelectChangeHandler(v)}
        bind:value={selectedJtracNoTypeValue}
      />
      <div class="connector">-</div>
      <Input
        inputLabel="JtracNo"
        bind:value={jtracNo}
        restrict="0-9"
        on:change={onJtracNoChangeHandler}
        class="input popTextHeight jtrac-input-width"
      />
    </Box>
  </Box>
  <Box class="typeLable">
    <Box
      class="addPage-list background"
      horizontalAlign="compact"
      verticalAlign="middle"
    >
      <Text>Version: {version}</Text>
    </Box>
    <Box
      f={1}
      class="border_right_top padding-normal"
      horizontalAlign="compact"
      verticalAlign="middle"
    >
      <AdvancedSelect
        options={systemTypeList}
        optionIdentifier="id"
        labelIdentifier="name"
        onSubmit={(v) => onSystemTypeSelectChangeHandler(v)}
        bind:value={selectedSystemFlag}
      />
      <div class="connector">-</div>
      <Input
        readOnly={inputVersionDisabled}
        bind:value={versionMessage}
        on:change={onVersionChangeHandler}
        class="input popTextHeight jtrac-input-width"
      />
    </Box>
  </Box>
  <Box class="typeLable">
    <Box
      class="addPage-list background"
      horizontalAlign="compact"
      verticalAlign="middle"
    >
      <Text>代码检查负责人</Text>
    </Box>
    <Box
      f={1}
      class="border_right padding-normal popup-position popup-select-height"
      horizontalAlign="left"
      verticalAlign="middle"
    >
      <AdvancedSelect
        options={reviewerList}
        optionIdentifier="id"
        labelIdentifier="name"
        onSubmit={(v) => onReviewerSelectChangeHandler(v)}
        bind:value={selectedReviewerValue}
      />
    </Box>
  </Box>
  <Box class="typeLable">
    <Box
      class="addPage-list background"
      horizontalAlign="compact"
      verticalAlign="middle"
    >
      <Text>列表</Text>
    </Box>
    <Box
      f={1}
      class="border_right padding-normal"
      horizontalAlign="left"
      verticalAlign="middle"
    >
      <TextArea
        on:blur={onListMessageBlurHandler}
        bind:value={listMessage}
        class="textArea-bottom-margin"
      />
    </Box>
  </Box>
  <Box class="typeLable">
    <Box
      class="addPage-list background"
      horizontalAlign="compact"
      verticalAlign="middle"
    >
      <Text>模块</Text>
    </Box>
    <Box
      f={1}
      class="border_right padding-normal"
      horizontalAlign="left"
      verticalAlign="middle"
    >
      <Input
        readOnly={moduleInputOnly}
        on:blur={onModuleMessageBlurHandler}
        bind:value={moduleMessage}
        class="input popTextHeight"
      />
    </Box>
  </Box>
  <Box class="typeLable">
    <Box
      class="addPage-list background"
      horizontalAlign="compact"
      verticalAlign="middle"
    >
      <Text>Detail</Text>
    </Box>
    <Box
      f={1}
      class="border_right padding-normal"
      horizontalAlign="left"
      verticalAlign="middle"
    >
      <Input bind:value={detailMessage} class="input popTextHeight" />
    </Box>
  </Box>
  <Box class="typeLable">
    <Box
      class="addPage-list background"
      horizontalAlign="compact"
      verticalAlign="middle"
    >
      <Text>后台负责人</Text>
    </Box>
    <Box
      f={1}
      class="border_right padding-normal popup-position popup-select-height"
      horizontalAlign="left"
      verticalAlign="middle"
    >
      <AdvancedSelect
        options={bizList}
        optionIdentifier="id"
        labelIdentifier="name"
        onSubmit={(v) => onBizSelectChangeHandler(v)}
        bind:value={selectedBizValue}
      />
    </Box>
  </Box>
  <Box class="typeLable">
    <Box
      class="addPage-list background"
      horizontalAlign="compact"
      verticalAlign="middle"
    >
      <Text>紧急程度</Text>
    </Box>
    <Box
      f={1}
      class="border_right_bottom padding-normal popup-position popup-select-height"
      horizontalAlign="left"
      verticalAlign="middle"
    >
      <AdvancedSelect
        options={urgencyList}
        optionIdentifier="id"
        labelIdentifier="name"
        onSubmit={(v) => onUrgencySelectChangeHandler(v)}
        bind:value={selectedUrgencyValue}
      />
    </Box>
  </Box>
</div>

<style>
  :global(.multi-step-checkout-step-section) {
    border-bottom: 1px dashed #e6e6e6;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  :global(.bottom-margin) {
    margin-bottom: 5px;
  }

  :global(.addPage-list) {
    width: 150px !important;
    line-height: 34px !important;
    color: #fff;
    text-align: center;
  }

  :global(.popup-select-height > div) {
    min-height: 30px !important;
    border-radius: 0% !important;
  }

  :global(.jtrac-input-width) {
    width: 300px !important;
  }

  :global(.connector) {
    width: 30px;
    text-align: center;
  }
</style>
