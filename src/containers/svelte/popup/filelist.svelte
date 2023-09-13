<!--
/**
 * Summary: 文件/模块列表
 * Created: 2022/11/03
 * Author1: kang jiaqi
 * © 2022 iMarketChina Co.,Ltd. All rights reserved.
 */
 -->
<script lang="ts">
  import '@/styles/core/white.css';
  import '@/styles/core/index.scss';
  import { Button, Input, Box, Text, TextArea, AdvancedSelect } from '@/components/sveltecomponents';
  import { onMount, onDestroy } from 'svelte';
  import pageStore from '@/store/filelistStore';
  import { autorun } from 'mobx';
  import CustomAlert, { AlertIcon } from '@/components/CustomAlert';
  import { PermissionList, JtracInfo } from '@/vo/uploadManager/index';
  import { UsersInfo } from '@/vo/userManager/index';
  import { UserInfo, VERSION_REGEXP } from '@/utils/Settings';
  import * as utils from '@/utils/CommonUtils';
  import copy from 'copy-to-clipboard';
  import { urgencyList } from '@/constant/constant';
  import { setWaiting, removeWaiting } from '@/utils/loaderUtils';
  import { FileListAlert } from '@/constant/alert/upload';
  import { deepClone } from '@/utils/CommonUtils';
  import Copy from 'carbon-icons-svelte/lib/Copy.svelte';
  import Save from 'carbon-icons-svelte/lib/Save.svelte';
  import Checkmark from 'carbon-icons-svelte/lib/Checkmark.svelte';
  import { systemTypeList } from '@/constant/constant';

  export let params: any;
  export let onClose;
  let jtracNo: string = '';
  let version: string = '';
  let detail: string = '';
  let list: string = '';
  let nid: string = '';
  let selectedReviewer: string = '';
  let selectedBizDeveloper: string = '';
  let selectedUrgency: string = '';
  let selectedSystemFlag: string = '';
  let reviewerList: any[] = [];
  let bizDeveloperList: any[] = [];
  let permissionData: any[] = [];
  let isReviewer: boolean = false;
  let maxHeight: string = '29px';

  onMount(() => {
    searchPerson();
    searchBizDeveloper();
    // searchPermission();
    getUserActivePermission();
    initData();
  });

  onDestroy(() => {
    getUserCheckPersonList();
    getBizDeveloperList();
    // permission();
    getUserActivePermissionList();
    fileListSave();
    reviewApprove();
  });

  const getUserCheckPersonList = autorun(() => {
    if (pageStore.getUserCheckPersonListResult) {
      const value = deepClone(pageStore.getUserCheckPersonListResult);
      pageStore.getUserCheckPersonListResult = null;
      removeWaiting();
      if (!value.error) {
        let values = value.data;
        let user: {} = {
          id: '',
          name: '--请选择--',
        };
        values.unshift(user);
        reviewerList = values;
        selectedReviewer = params.info.reviewer;
        if (selectedReviewer === UserInfo.userId && params.info.status === 'R') {
          isReviewer = true;
        }
      }
    }
  });

  const getBizDeveloperList = autorun(() => {
    if (pageStore.getUserListResult) {
      const value = deepClone(pageStore.getUserListResult);
      pageStore.getUserListResult = null;
      removeWaiting();
      if (!value.error) {
        let values = value.data;
        let user: any = {
          blockFlag: '',
          id: '',
          name: '--请选择--',
          password: '',
          permissionGroup: '',
          userType: '',
        };
        values.unshift(user);
        bizDeveloperList = values;
        selectedBizDeveloper = params.info.bizDeveloper;
      }
    }
  });

  // const permission = autorun(() => {
  //   if (pageStore.getUserPermissionResult) {
  //     const value = deepClone(pageStore.getUserPermissionResult);
  //     pageStore.getUserPermissionResult = null;
  //     removeWaiting();
  //     if (!value.error) {
  //       permissionData = value.data.split(',');
  //     }
  //   }
  // });

  const getUserActivePermissionList = autorun(() => {
    if (pageStore.getUserActivePermissionResult) {
      const permissionList = deepClone(pageStore.getUserActivePermissionResult);
      pageStore.getUserActivePermissionResult = null;
      removeWaiting();
      if (!permissionList.error) {
        permissionData = permissionList.data.split(',');
      }
    }
  });

  const fileListSave = autorun(() => {
    if (pageStore.updateJtracInfoResult) {
      const value = deepClone(pageStore.updateJtracInfoResult);
      pageStore.updateJtracInfoResult = null;
      if (!value.error) {
        CustomAlert(value.msg, AlertIcon.SUCCESS, onClose('Y'));
      } else {
        CustomAlert(value.msg, AlertIcon.ERROR, onClose('Y'));
      }
    }
  });

  const reviewApprove = autorun(() => {
    if (pageStore.updateMultJtracStatusResult) {
      const value = deepClone(pageStore.updateMultJtracStatusResult);
      pageStore.updateMultJtracStatusResult = null;
      removeWaiting();
      if (!value.error) {
        onClose('Y');
      } else {
        CustomAlert(value.msg, AlertIcon.ERROR);
      }
    }
  });

  function getPerson(list: any[], id: string) {
    let value: any = { id: '', name: '--请选择--' };
    list.forEach((data) => {
      if (data.id === id) value = data;
    });
    return value;
  }

  function onSystemTypeSelectChangeHandler(value: any) {
    selectedSystemFlag = value.id;
  }

  function searchPerson() {
    setWaiting();
    pageStore.getUserCheckPersonList(['O']);
  }

  function searchBizDeveloper() {
    let info: UsersInfo = {};
    info.blockflag = 'N';
    info.usertype = 'P';
    info.iStart = 0;
    info.iPageCount = 20;
    setWaiting();
    pageStore.getUserList(info);
  }

  // function searchPermission() {
  //   let info: PermissionList = {};
  //   info.userId = UserInfo.userId;
  //   info.pageId = 'jtrac';
  //   setWaiting();
  //   pageStore.getUserPermission(info);
  // }

  function getUserActivePermission() {
    const info = UserInfo.userId;
    setWaiting();
    pageStore.getUserActivePermission(info);
  }

  function initData() {
    jtracNo = params.info.jtracNo;
    version = params.info.version;
    detail = params.info.detail;
    selectedSystemFlag = params.info.systemType;
    nid = params.info.nid;
    selectedUrgency = params.info.urgencyFlag;
    if (params.info.file === 'A') {
      list = params.info.filelist.replace(/,/g, '\r');
    } else if (params.info.file === 'B') {
      list = params.info.modulelist.replace(/,/g, '\r');
    }
    setTimeout(() => {
      maxHeight = document.getElementById('textArea').scrollHeight + 3 + 'px';
    }, 1);
  }

  function onBtnSaveClickHandler() {
    if (!validate()) {
      return;
    }
    if (version && !VERSION_REGEXP.test(version.trim())) {
      CustomAlert(FileListAlert.JTRAC_VERSION_FORMAT_ERROR, AlertIcon.WARNING);
      return false;
    }
    let re: RegExp = /\n/g;
    let re2: RegExp = /\\/gi;
    let txtFileList: string;
    txtFileList = distinctList(list.replace(re, ',').replace(/\r/g, ',').replace(re2, '/'));
    let info: JtracInfo = {};
    info.nid = nid;
    info.jtracNo = jtracNo.trim();
    info.bizDeveloper = selectedBizDeveloper;
    info.systemType = selectedSystemFlag;
    info.reviewer = selectedReviewer;
    info.urgencyFlag = selectedUrgency.trim();
    info.version = version.trim();
    info.detail = detail.trim();
    if (params.info.file === 'A') {
      info.fileList = txtFileList;
    } else {
      info.moduleList = txtFileList;
    }
    info.clientDeveloper = UserInfo.userId;
    pageStore.updateJtracInfo(info);
  }

  function onBtnApproveClickHandler() {
    const info: JtracInfo = {};
    info.status = 'A';
    info.orgStatus = 'R';
    info.jtracNo = params.info.jtracNo;
    setWaiting();
    pageStore.updateMultJtracStatus(info);
  }

  function distinctList(input: string): string {
    let existFiles: any[] = [];
    let inputArray: any[] = input.split(',');
    let outputArray: any[] = [];
    inputArray.forEach((data) => {
      if (existFiles.indexOf(data) === -1 && data.trim() !== '') {
        existFiles.push(data);
        outputArray.push(data);
      }
    });
    return outputArray.join(',');
  }

  function validate() {
    if (!jtracNo) {
      CustomAlert(FileListAlert.JTRAC_NUMBER_CANNOT_EMPTY, AlertIcon.WARNING);
      return false;
    }
    if (!list) {
      CustomAlert(FileListAlert.FILELIST_CANNOT_EMPTY, AlertIcon.WARNING);
      return false;
    }
    if (!UserInfo.userId) {
      CustomAlert(FileListAlert.LOGIN_FIRST, AlertIcon.WARNING);
      onClose();
      return false;
    }
    if (utils.getStringAsciiNew(detail.trim()) < 8) {
      CustomAlert(FileListAlert.DETAIL_MIN_8, AlertIcon.WARNING);
      return false;
    }
    return true;
  }

  function onBtnCopyClickHandler() {
    copy(list);
    CustomAlert(FileListAlert.COPY_SUCCESS, AlertIcon.SUCCESS);
    return;
  }

  function onJtracNoChangeHandler(e: any) {
    jtracNo = e.detail.data;
  }

  function onJtracNokeyupHandler(e: any) {
    e.target.value.replace(/[^\d\-a-zA-z]/g, '');
  }

  function onVersionChangeHandler(e: any) {
    version = e.detail.data;
  }

  function onReviewerSelectChangeHandler(value: any) {
    selectedReviewer = value.id;
  }

  function onBizSelectChangeHandler(value: any) {
    selectedBizDeveloper = value.id;
  }

  function onUrgencySelectChangeHandler(value: any) {
    selectedUrgency = value.id;
  }

  function onListBlurHandler(e: any) {
    list = switchToTextArea(e.detail.data);
  }

  function switchToTextArea(value: string) {
    if (!value) return '';
    let result: string = value.replace(/\n/g, ',');
    result = result.replace(/\s/g, ' ');
    let resultNoEmpty = result.split(',').filter((v) => {
      return v && v.trim();
    });
    const resultNoRepeat: string[] = [];
    resultNoEmpty.forEach((v) => {
      if (!resultNoRepeat.includes(v)) {
        resultNoRepeat.push(v);
      }
    });
    return resultNoRepeat.join('\n');
  }
</script>

<div style="height:520px;">
  <Box horizontalAlign="right" class="typeLable">
    {#if isReviewer}
      <Button
        class="margin_right button-normal margin_bottom_s button-main-style"
        size="small"
        kind="tertiary"
        icon={Checkmark}
        on:click={onBtnApproveClickHandler}
      >
        批准
      </Button>
    {/if}
    <Button
      class="margin_right button-normal margin_bottom_s button-main-style"
      size="small"
      kind="tertiary"
      icon={Save}
      on:click={onBtnSaveClickHandler}
    >
      保存
    </Button>
    <Button class="button-normal margin_bottom_s button-main-style" size="small" kind="tertiary" icon={Copy} on:click={onBtnCopyClickHandler}>
      复制
    </Button>
  </Box>
  <Box class="typeLable">
    <Box class="addPage-list background_border" horizontalAlign="compact" verticalAlign="middle">
      <Text>JtracNo</Text>
    </Box>
    <Box f={1} class="border_right_top padding-normal" horizontalAlign="left" verticalAlign="middle">
      {#if permissionData.includes('J_F')}
        <Input bind:value={jtracNo} on:keyup={onJtracNokeyupHandler} on:blur={onJtracNoChangeHandler} class="input popTextHeight" />
      {:else}
        <Input bind:value={jtracNo} disabled class="input popTextHeight" />
      {/if}
    </Box>
  </Box>
  <Box class="typeLable">
    <Box class="addPage-list background" horizontalAlign="compact" verticalAlign="middle">
      <Text>Version</Text>
    </Box>
    <Box f={1} class="border_right padding-normal" horizontalAlign="left" verticalAlign="middle">
      {#if permissionData.includes('J_F')}
        <AdvancedSelect
          options={systemTypeList}
          optionIdentifier="id"
          labelIdentifier="name"
          onSubmit={(v) => onSystemTypeSelectChangeHandler(v)}
          bind:value={selectedSystemFlag}
        />
        <div class="connector">-</div>
        <Input bind:value={version} on:change={onVersionChangeHandler} class="input popTextHeight jtrac-input-width" />
      {:else}
        <AdvancedSelect options={systemTypeList} optionIdentifier="id" labelIdentifier="name" disabled bind:value={selectedSystemFlag} />
        <div class="connector">-</div>
        <Input bind:value={version} disabled class="input popTextHeight jtrac-input-width" />
      {/if}
    </Box>
  </Box>
  <div style="height:415px">
    <div style="height:413px;overflow:auto">
      <Box class="typeLable">
        <Box class="addPage-list background" horizontalAlign="compact" verticalAlign="middle">
          <Text>代码检查负责人</Text>
        </Box>
        <Box f={1} class="border_right padding-normal popup-position popup-select-height" horizontalAlign="left" verticalAlign="middle">
          {#if permissionData.includes('J_F')}
            <AdvancedSelect
              options={reviewerList}
              optionIdentifier="id"
              labelIdentifier="name"
              onSubmit={(v) => onReviewerSelectChangeHandler(v)}
              bind:value={selectedReviewer}
            />
          {:else}
            <AdvancedSelect disabled options={reviewerList} optionIdentifier="id" labelIdentifier="name" bind:value={selectedReviewer} />
          {/if}
        </Box>
      </Box>
      <Box class="typeLable">
        <Box class="addPage-list background" horizontalAlign="compact" verticalAlign="middle">
          <Text>列表</Text>
        </Box>
        <Box f={1} class="border_right padding-normal" horizontalAlign="left" verticalAlign="middle">
          <TextArea id="textArea" height={maxHeight} on:blur={onListBlurHandler} bind:value={list} class="textArea-bottom-margin" />
        </Box>
      </Box>
      <Box class="typeLable">
        <Box class="addPage-list background" horizontalAlign="compact" verticalAlign="middle">
          <Text>Detail</Text>
        </Box>
        <Box f={1} class="border_right padding-normal" horizontalAlign="left" verticalAlign="middle">
          <Input bind:value={detail} class="input popTextHeight" />
        </Box>
      </Box>
      <Box class="typeLable">
        <Box class="addPage-list background" horizontalAlign="compact" verticalAlign="middle">
          <Text>后台负责人</Text>
        </Box>
        <Box f={1} class="border_right padding-normal popup-position popup-select-height" horizontalAlign="left" verticalAlign="middle">
          <AdvancedSelect
            options={bizDeveloperList}
            optionIdentifier="id"
            labelIdentifier="name"
            onSubmit={(v) => onBizSelectChangeHandler(v)}
            bind:value={selectedBizDeveloper}
          />
        </Box>
      </Box>
      <Box class="typeLable">
        <Box class="addPage-list background" horizontalAlign="compact" verticalAlign="middle">
          <Text>紧急程度</Text>
        </Box>
        <Box f={1} class="border_right_bottom padding-normal popup-position popup-select-height" horizontalAlign="left" verticalAlign="middle">
          <AdvancedSelect
            options={urgencyList}
            optionIdentifier="id"
            labelIdentifier="name"
            onSubmit={(v) => onUrgencySelectChangeHandler(v)}
            bind:value={selectedUrgency}
          />
        </Box>
      </Box>
    </div>
  </div>
</div>
