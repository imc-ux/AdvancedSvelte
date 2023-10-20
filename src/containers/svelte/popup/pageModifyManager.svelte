<script>
  import '@/styles/core/white.css';
  import '@/styles/core/index.scss';
  import { Box, Text, Link, Button, Input, MultiSelect, AdvancedSelect } from '@/components/sveltecomponents';
  import { IconButton } from '@/components/renderers';
  import { CreatePop } from '@/components/Popup';
  import fileDetail from '@/containers/svelte/popup/fileDetail.svelte';
  import pageModifyManager from '@/containers/svelte/popup/pageModifyManager.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { autorun } from 'mobx';
  import Close from 'carbon-icons-svelte/lib/Close.svelte';
  import pageStore from '@/store/PageModifyManageStore';
  import { setWaiting, removeWaiting } from '@/utils/loaderUtils';
  import CustomAlert, { AlertIcon } from '@/components/CustomAlert';
  import { PageManageAlert } from '@/constant/alert/Base';
  import Edit from 'carbon-icons-svelte/lib/Edit.svelte';
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
  import { tick } from 'svelte';
  import {
    mpManagementTypeList,
    spManagementTypeList,
    buyerManagementTypeList,
    expManagementTypeList,
    gerpManagementTypeList,
  } from '@/constant/constant';
  import { UserInfo } from '@/utils/Settings';
  import { deepClone } from '@/utils/CommonUtils';

  let pages = [];
  let jtracs = [];
  let checkList = [];
  let renderersOptions = [];
  let renderers = [];
  let selectPersion = [];
  let selectChecker = [];
  let managementList = [];
  let popsOptions = [];
  let jtracsOptions = [];
  let bizList = [];

  let person = '';
  let checkPerson = '';
  let id = '';
  let inputID = '';
  let name = '';
  let inputName = '';
  let managementName = '';
  let typeName = '';
  let modifyMode = false;
  let saveInfo;
  let saveType = false;
  let selectedManagementValue = '';
  let selectedPopsValue = null;
  let selectedRendererValue = null;
  let info = null;
  let count = 6;
  let popList = [];
  let permissionData = [];

  const popId = `${new Date().getTime()}-${Math.round(Math.random() * 100000)}`;

  export let params;
  export let onClose;

  onMount(() => {
    setWaiting();
    searchPopList();
    searchRendererList();
    searchBizDebeloper();
    searchCheckList();
    searchManagerList();
    getUserActivePermission();
    pageStore.getJtracNosByPageId(params, popId);
  });

  onDestroy(() => {
    disposerPerson();
    disposer();
    disposerUpdate();
    disposerPopupList();
    disposerJtracs();
    disposerPopList();
    getPermission();
  });

  function countOver() {
    count--;
    if (count === 0) {
      removeWaiting();
    }
  }

  function getUserActivePermission() {
    const info = UserInfo.userId;
    setWaiting();
    pageStore.getUserActivePermission(info);
  }

  const disposerPerson = autorun(() => {
    if (pageStore.userPersionResult && pageStore.userPersionResult.mark === popId) {
      const value = JSON.parse(JSON.stringify(pageStore.userPersionResult));
      pageStore.userPersionResult = null;
      countOver();
      if (!value.error) {
        for (let i = 0; i < value.data.length; i++) {
          value.data[i].text = value.data[i].name;
        }
        checkList = value.data;
      } else {
        CustomAlert(value.msg, AlertIcon.ERROR);
      }
    }
  });

  const getPermission = autorun(() => {
    if (pageStore.getUserActivePermissionResult && pageStore.getUserActivePermissionResult.mark === popId) {
      const permisisonList = deepClone(pageStore.getUserActivePermissionResult);
      pageStore.getUserActivePermissionResult = null;
      removeWaiting();
      if (!permisisonList.error) {
        permissionData = permisisonList.data?.split(',');
      }
    }
  });

  const disposer = autorun(() => {
    if (pageStore.userListResult && pageStore.userListResult.mark === popId) {
      const value = JSON.parse(JSON.stringify(pageStore.userListResult));
      pageStore.userListResult = null;
      countOver();
      if (!value.error) {
        for (let i = 0; i < value.data.length; i++) {
          value.data[i].text = value.data[i].name;
        }
        bizList = value.data;
      } else {
        CustomAlert(value.msg, AlertIcon.ERROR);
      }
    }
  });

  const disposerUpdate = autorun(() => {
    if (pageStore.updateMpPageInfoResult && pageStore.updateMpPageInfoResult.mark === popId) {
      const value = JSON.parse(JSON.stringify(pageStore.updateMpPageInfoResult));
      pageStore.updateMpPageInfoResult = null;

      countOver();
      if (!value.error) {
        if (saveType) {
          CustomAlert(PageManageAlert.DELETE_DATA, AlertIcon.SUCCESS);
        } else {
          CustomAlert(PageManageAlert.SAVE_DATA, AlertIcon.SUCCESS);
        }
        onClose('Y');
      } else {
        CustomAlert(value.msg, AlertIcon.ERROR);
      }
    }
  });

  const disposerPopupList = autorun(() => {
    if (pageStore.getMpPageMgmtListResult && pageStore.getMpPageMgmtListResult.mark === popId) {
      const value = JSON.parse(JSON.stringify(pageStore.getMpPageMgmtListResult));
      pageStore.getMpPageMgmtListResult = null;
      countOver();
      if (!value.error) {
        if (value.data.length > 0) {
          info = value.data.find(v => v.code === params);
          if (info) {
            person = info.developerName;
            checkPerson = info.reviewerName;
            id = info.code;
            name = info.name;
            managementName = info.managementName;
            if (params.type === 'buyer') {
              typeName = 'Buyer主页';
              managementList = buyerManagementTypeList;
            } else if (params.type === 'supplier') {
              typeName = 'Supplier主页';
              managementList = spManagementTypeList;
            } else if (params.type === 'gerp') {
              typeName = 'GERP主页';
              managementList = gerpManagementTypeList;
            } else if (params.type === 'buyerExp') {
              typeName = 'BuyerEXP主页';
              managementList = expManagementTypeList;
            } else if (params.type === 'main') {
              typeName = 'MP主页';
              managementList = mpManagementTypeList;
            } else if (params.type === 'pop') {
              typeName = 'Popup';
              managementList = [{ code: '', name: '--请选择--' }];
            } else if (params.type === 'renderer') {
              typeName = 'Renderer';
              managementList = [{ code: '', name: '--请选择--' }];
            }
            saveInfo = info;
            pages = [];
            jtracs = [];
            if (info.relatedPops) {
              let pageArray = info.relatedPops.split(',');
              pageArray?.forEach(elem => {
                const relatedPopName = popsOptions.find(value => value.code === elem);
                if (elem) {
                  pages.push({
                    name: relatedPopName?.name,
                    code: elem,
                    type: 'label',
                  });
                }
              });
            }
            renderers = [];
            if (info.relatedRenderers) {
              let renderArray = info.relatedRenderers.split(',');
              renderArray?.forEach(elem => {
                if (elem) {
                  const relatedRendererName = renderersOptions.find(value => value.code === elem);
                  renderers.push({
                    name: relatedRendererName?.name,
                    code: elem,
                    type: 'label',
                  });
                }
              });
            }

            if (info.type !== 'renderer' && modifyMode) {
              pages.push({ name: '', code: '', type: 'input' });
              renderers.push({ name: '', code: '', type: 'input' });
            }
          } else {
            CustomAlert(PageManageAlert.SEARCH_NOT_DATA, AlertIcon.ERROR);
            onClose();
          }
        }
      } else {
        CustomAlert(PageManageAlert.INTERNET_ERROR, AlertIcon.ERROR);
      }
    }
  });

  const disposerJtracs = autorun(() => {
    if (pageStore.getJtracNosByPageIdResult && pageStore.getJtracNosByPageIdResult.mark === popId) {
      const value = JSON.parse(JSON.stringify(pageStore.getJtracNosByPageIdResult));
      pageStore.getJtracNosByPageIdResult = null;
      countOver();
      if (!value.error) {
        //适应onbtnJtracLinkHandler中的判断和jtrac详细pop传值而处理数据
        const regExp = /^V2A-|H5BUG-/;
        jtracsOptions = value.data

          .split(',')
          .filter(item => {
            if (regExp.test(item)) {
              return true;
            } else {
              return false;
            }
          })
          .map(elem => ({
            jtracNo: elem,
            name: elem,
          }));
      } else {
        CustomAlert(value.msg, AlertIcon.ERROR);
      }
    }
  });

  const disposerPopList = autorun(() => {
    if (pageStore.getPageIdsByTypeResult && pageStore.getPageIdsByTypeResult.mark === popId) {
      const value = JSON.parse(JSON.stringify(pageStore.getPageIdsByTypeResult));
      pageStore.getPageIdsByTypeResult = null;
      countOver();
      if (!value.error) {
        if (value.data[0].type === 'pop') {
          popsOptions = value.data;
          popsOptions.unshift({ code: '--请选择--' });
          if (popsOptions[0].code === '--请选择--') {
            selectedPopsValue = popsOptions[0];
          }
        }

        if (value.data[0].type === 'renderer') {
          renderersOptions = value.data;
          renderersOptions.unshift({ code: '--请选择--' });
          if (renderersOptions[0].code === '--请选择--') {
            selectedRendererValue = renderersOptions[0];
          }
        }
        if (popsOptions && renderersOptions) {
          count = 2;
          setWaiting();
          searchCodeList();
        }
      } else {
        CustomAlert(value.msg, AlertIcon.ERROR);
      }
    }
  });

  function searchBizDebeloper() {
    const info = {
      blockflag: 'N',
      usertype: 'U',
      iStart: 0,
      iPageCount: 20,
    };
    pageStore.getUserList(info, popId);
  }

  function searchCheckList() {
    const strs = ['O'];
    pageStore.getUserCheckPersonList(strs, popId);
  }

  function searchManagerList() {
    setWaiting();
    pageStore.getMpPageMgmtType(popId);
  }

  function searchRenderer() {
    isRendererAdd = true;
    const info = {
      code: '',
      name: '',
      type: 'renderer',
      iStart: 0,
      iPageCount: 9999,
    };
    setWaiting();
    pageStore.getMpPageMgmtList(info, popId);
  }

  function onBtnSaveClick() {
    if (!inputID) {
      CustomAlert(PageManageAlert.ID_NOT_NULL);
      return;
    }
    if (!inputName) {
      CustomAlert(PageManageAlert.NAME_NOT_NULL);
      return;
    }
    if (saveInfo) {
      if (saveInfo.type !== 'pop' && saveInfo.type !== 'renderer') {
        if (selectedManagementValue === '') {
          CustomAlert(PageManageAlert.PLEASE_SELECT_MANAGEMENT);
          return;
        }
      }
    }
    let relatedPops = [];
    let m = new Map();
    if (pages.length > 0) {
      for (let i = 0; i < pages.length; i++) {
        if (pages[i].code) {
          if (m.get(pages[i].code)) {
            CustomAlert(PageManageAlert.POP_NOT_CAN_DUPLICATE);
            return;
          }
          m.set(pages[i].code, pages[i].code);
          relatedPops.push(pages[i].code);
        }
      }
    }
    let relatedRenderers = [];
    let r = new Map();
    if (renderers.length > 0) {
      for (let i = 0; i < renderers.length; i++) {
        if (renderers[i].name) {
          if (r.get(renderers[i].code)) {
            CustomAlert(PageManageAlert.RENDERER_NOT_CAN_DUPLICATE);
            return;
          }
        }
        r.set(renderers[i].code, renderers[i].code);
        relatedRenderers.push(renderers[i].code);
      }
    }
    const info = {
      id: saveInfo.id,
      name: inputName,
      code: inputID,
      management: selectedManagementValue,
      type: saveInfo.type,
      developer: selectPersion.toString(),
      reviewer: selectChecker.toString(),
      relatedPops: relatedPops.toString(),
      relatedRenderers: relatedRenderers.toString(),
    };
    saveType = false;
    setWaiting();
    pageStore.updateMpPageInfo(info, popId);
  }

  function searchPopupList() {
    isPopAdd = true;
    const info = {
      code: '',
      name: '',
      type: 'pop',
      iStart: 0,
      iPageCount: 9999,
    };
    setWaiting();
    pageStore.getMpPageMgmtList(info, popId);
  }

  function searchCodeList() {
    const info = {
      code: params,
      name: '',
      type: '',
      iStart: 0,
      iPageCount: 9999,
    };
    setWaiting();
    pageStore.getMpPageMgmtList(info, popId);
  }

  function searchPopList() {
    const info = {
      code: '',
      name: '',
      type: 'pop',
      iStart: 0,
      iPageCount: 9999,
    };
    setWaiting();
    pageStore.getPageIdsByType(info, popId);
  }

  function searchRendererList() {
    const info = {
      code: '',
      name: '',
      type: 'renderer',
      iStart: 0,
      iPageCount: 9999,
    };
    setWaiting();
    pageStore.getPageIdsByType(info, popId);
  }

  function onbtnPopLinkHandler(v, page) {
    CreatePop('MP管理页面-详细', pageModifyManager, page.code, onClosePopHandler, { width: '900px', height: '800px' });
  }

  function onbtnRendererLinkHandler(v, renderer) {
    CreatePop('MP管理页面-详细', pageModifyManager, renderer.code, onClosePopHandler, { width: '900px', height: '800px' });
  }

  function onClosePopHandler(data) {
    if (data === 'Y') {
      onClose(data);
    }
  }

  function onbtnAddPage(v, page) {
    pages[v].type = 'input';
    count = 1;
    setWaiting();
    searchPopupList();
  }

  function onBtnModifyClick() {
    if (saveInfo) {
      modifyMode = true;
      inputID = saveInfo.code;
      inputName = saveInfo.name;
      selectedManagementValue = saveInfo.management;
      selectChecker = saveInfo.reviewer;
      selectPersion = saveInfo.developer;
      count = 5;
      setWaiting();
      searchBizDebeloper();
      searchCheckList();
      searchManagerList();
      searchPopList();
      searchRendererList();
      if (info.type !== 'renderer') {
        pages.push({ name: '', code: '', type: 'input' });
        renderers.push({ name: '', code: '', type: 'input' });
      }
    } else {
      CustomAlert(PageManageAlert.NOT_MODIFY_SEARCH_NOT_DATA);
    }
  }

  function onbtnJtracLinkHandler(v, page) {
    CreatePop('Jtrac详细', fileDetail, { jtracNo: page.jtracNo });
  }

  function onbtnDeleteRendererPage(i) {
    renderers = renderers.filter((item, num) => num !== i);
  }

  function onbtnDeletePage(i) {
    pages = pages.filter((item, num) => num !== i);
  }

  async function handleSubmit(value, i) {
    pages[i].name = value.name;
    pages[i].code = value.code;
    pages[i].type = 'label';
    pages.push({ name: '', code: '', type: 'input' });
    await tick();
    document.getElementById('outer').parentElement.scrollTop = document.getElementById('outer').parentElement.scrollHeight;
  }

  async function handleRendererSubmit(value, i) {
    renderers[i].name = value.name;
    renderers[i].code = value.code;
    renderers[i].type = 'label';
    renderers.push({ name: '', code: '', type: 'input' });
    await tick();
    document.getElementById('outer').parentElement.scrollTop = document.getElementById('outer').parentElement.scrollHeight;
  }

  function onBtnDeleteHandlerClick() {
    if (saveInfo) {
      const info = {
        id: saveInfo.id,
        isDelete: 'Y',
      };
      saveType = true;
      setWaiting();
      pageStore.updateMpPageInfo(info, popId);
    } else {
      CustomAlert(PageManageAlert.NOT_DELETE_SEARCH_NOT_DATA);
    }
  }

  function onTextIDChangeHandler(e) {
    if (saveInfo) {
      if (saveInfo.type === 'renderer') {
        inputName = e.detail.data;
      }
    }
  }

  function onTextNameChangeHandler(e) {
    if (saveInfo) {
      if (saveInfo.type === 'renderer') {
        inputID = e.detail.data;
      }
    }
  }

  function onManagementSubmitHandler(value) {
    selectManagement = value.code;
    selectedManagementValue = value;
  }
</script>

<div id="outer" style="overflow-y:auto;height:520px">
  <Box horizontalAlign="right" class="margin_bottom modifyTop">
    {#if modifyMode}
      <Button size="small" kind="tertiary" class=" button-normal button-main-style" on:click={onBtnSaveClick}>保存</Button>
    {:else if permissionData?.includes('M_C')}
      <Button size="small" kind="tertiary" class=" button-normal button-main-style" icon={Edit} on:click={onBtnModifyClick}>修改</Button>
    {/if}
    {#if permissionData?.includes('M_B')}
      <Button size="small" kind="tertiary" class="btn-margin-left button-normal button-main-style" icon={TrashCan} on:click={onBtnDeleteHandlerClick}
        >删除</Button
      >
    {/if}
  </Box>
  <Box height="35px">
    <Box class="background modifyLableStyle" horizontalAlign="compact" verticalAlign="middle">
      <Text class="textColor modify-line-height">Type</Text>
    </Box>
    <Box f={1} class="border_right_bottom_top padding_right_left typeLable" horizontalAlign="left" verticalAlign="middle">
      <Text class="ellipsis typeText pop-text-align ">{typeName}</Text>
    </Box>
  </Box>
  <Box height="35px">
    <Box class="background modifyLableStyle" horizontalAlign="compact" verticalAlign="middle">
      <Text class="textColor modify-line-height">ID</Text>
    </Box>
    <Box f={1} class="border_right_bottom padding_right_left typeLable" horizontalAlign="left" verticalAlign="middle">
      {#if modifyMode}
        <Input class="typeText popupInput pop-text-align " bind:value={inputID} maxAscii={255} on:blur={onTextIDChangeHandler} />
      {:else}
        <Text class="ellipsis popupText popTextHeight pop-text-align " title={id}>{id}</Text>
      {/if}
    </Box>
  </Box>
  <Box height="35px">
    <Box class="background modifyLableStyle" horizontalAlign="compact" verticalAlign="middle">
      <Text class="textColor modify-line-height">Name</Text>
    </Box>
    <Box f={1} class="border_right_bottom padding_right_left typeLable" horizontalAlign="left" verticalAlign="middle">
      {#if modifyMode}
        <Input class="typeText popupInput pop-text-align " bind:value={inputName} maxAscii={255} on:blur={onTextNameChangeHandler} />
      {:else}
        <Text class="ellipsis popupText pop-text-align modify-line-height" title={name}>{name}</Text>
      {/if}
    </Box>
  </Box>
  <Box height="35px">
    <Box class="background modifyLableStyle" horizontalAlign="compact" verticalAlign="middle">
      <Text class="textColor modify-line-height">Management</Text>
    </Box>
    <Box
      f={1}
      class="border_right_bottom padding_right_left_bottom typeLable advancedSelectPadding select-height-pop "
      horizontalAlign="left"
      verticalAlign="middle"
    >
      {#if modifyMode}
        <AdvancedSelect bind:value={selectedManagementValue} options={managementList} onSubmit={v => onManagementSubmitHandler(v)} />
      {:else}
        <Text class="ellipsis typeText pop-text-align modify-line-height">{managementName}</Text>
      {/if}
    </Box>
  </Box>

  <Box height="35px">
    <Box class="background modifyLableStyle" horizontalAlign="compact" verticalAlign="middle">
      <Text class="textColor modify-line-height">页面负责人</Text>
    </Box>
    <Box
      f={1}
      flexDisplay={false}
      class="border_right_bottom padding_right_left typeLable multiselectPadding multiselect"
      horizontalAlign="left"
      verticalAlign="middle"
    >
      {#if modifyMode}
        <MultiSelect class="margin-botton" hideLabel dataProvider={bizList} bind:selectedIds={selectPersion} />
      {:else}
        <Text class="ellipsis typeText pop-text-align " title={person}>{person}</Text>
      {/if}
    </Box>
  </Box>
  <Box height="35px">
    <Box class="background modifyLableStyle" horizontalAlign="compact" verticalAlign="middle">
      <Text class="textColor modify-line-height">检查负责人</Text>
    </Box>
    <Box
      f={1}
      flexDisplay={false}
      class="border_right_bottom padding_right_left typeLable multiselectPadding multiselect"
      horizontalAlign="left"
      verticalAlign="middle"
    >
      {#if modifyMode}
        <MultiSelect direction="top" class="margin-botton" hideLabel dataProvider={checkList} bind:selectedIds={selectChecker} />
      {:else}
        <Text class="ellipsis typeText pop-text-align modify-line-height" title={checkPerson}>{checkPerson}</Text>
      {/if}
    </Box>
  </Box>
  <Box>
    <Box class="boxBlock" width="100%">
      {#if pages.length > 0}
        <Box column width="100%" class="background_white margin_right margin_top_bg popupBox">
          <Box class="modify-text">关联pop</Box>
          <Box height={2} class="modify-line" />
          <Box class="popup-border-top block child-background-color {modifyMode ? 'border-left-right' : 'popup-border-bottom'}">
            {#each pages as page, i}
              {#if i < pages.length - 1}
                <Box
                  height={28}
                  class=" select-height-pop related-padding-left gost-button-margin select-margin-right label-border-left label-border-right"
                  horizontalAlign="left"
                  verticalAlign="middle"
                >
                  {#if modifyMode}
                    {#if page.type === 'label'}
                      <Text title={page.code} class="ellipsis popupLable pop-text-align related-label-margin-left">{page.code}</Text>
                    {:else}
                      <AdvancedSelect
                        class="autoComplete"
                        width={340}
                        options={popsOptions}
                        optionIdentifier="type"
                        labelIdentifier="code"
                        bind:value={selectedPopsValue}
                        onSubmit={v => handleSubmit(v, i)}
                      />
                    {/if}
                    {#if page.code && page.code !== '--请选择--'}
                      <IconButton currentIcon={Close} on:click={v => onbtnDeletePage(i)} />
                    {/if}
                  {:else}
                    <Link title={`${page.name}(${page.code})`} class="ellipsis popupLink " on:click={v => onbtnPopLinkHandler(v, page)}
                      >{page.name}({page.code})</Link
                    >
                  {/if}
                </Box>
              {:else if i === pages.length - 1}
                <Box
                  height={28}
                  horizontalAlign="left"
                  verticalAlign="middle"
                  class="select-height-pop gost-button-margin related-padding-left select-margin-right label-border-left label-border-right"
                >
                  {#if modifyMode}
                    {#if page.type === 'label'}
                      <Text title={page.code} class="ellipsis popupLable pop-text-align related-label-margin-left">{page.code}</Text>
                    {:else}
                      <AdvancedSelect
                        class="autoComplete"
                        width={340}
                        options={popsOptions}
                        optionIdentifier="type"
                        labelIdentifier="code"
                        bind:value={selectedPopsValue}
                        onSubmit={v => handleSubmit(v, i)}
                      />
                    {/if}
                    {#if page.code}
                      <IconButton currentIcon={Close} on:click={v => onbtnDeletePage(i)} />
                    {/if}
                  {:else}
                    <Link title="{page.name}({page.code})" class="ellipsis popupLink " on:click={v => onbtnPopLinkHandler(v, page)}
                      >{page.name}({page.code})</Link
                    >
                  {/if}
                </Box>
              {/if}
            {/each}
          </Box>
        </Box>
      {/if}
      {#if renderers.length > 0}
        <Box column width="100%" class="background_white margin_right margin_top_bg popupBox">
          <Box class="modify-text">关联renderer</Box>
          <Box height={2} class="modify-line" />
          <Box class="popup-border-top block child-background-color {modifyMode ? 'border-left-right' : 'popup-border-bottom'}">
            {#each renderers as renderer, i}
              {#if i < renderers.length - 1}
                <Box
                  height={28}
                  class=" select-height-pop related-padding-left gost-button-margin select-margin-right label-border-left label-border-right"
                  horizontalAlign="left"
                  verticalAlign="middle"
                >
                  {#if modifyMode}
                    {#if renderer.type === 'label'}
                      <Text title={renderer.code} class="ellipsis popupLable pop-text-align related-label-margin-left">{renderer.code}</Text>
                    {:else}
                      <AdvancedSelect
                        class="autoComplete"
                        width={340}
                        options={renderersOptions}
                        optionIdentifier="type"
                        labelIdentifier="code"
                        bind:value={selectedRendererValue}
                        onSubmit={v => handleRendererSubmit(v, i)}
                      />
                    {/if}
                    {#if renderer.code}
                      <IconButton currentIcon={Close} on:click={v => onbtnDeleteRendererPage(i)} />
                    {/if}
                  {:else}
                    <Link title={renderer.code} class="ellipsis popupLink" on:click={v => onbtnRendererLinkHandler(v, renderer)}>{renderer.code}</Link
                    >
                  {/if}
                </Box>
              {:else if i === renderers.length - 1}
                <Box
                  height={28}
                  horizontalAlign="left"
                  verticalAlign="middle"
                  class="select-height-pop gost-button-margin related-padding-left select-margin-right label-border-left label-border-right"
                >
                  {#if modifyMode}
                    {#if renderer.type === 'label'}
                      <Text title={renderer.code} class="ellipsis popupLable pop-text-align related-label-margin-left">{renderer.code}</Text>
                    {:else}
                      <AdvancedSelect
                        class="autoComplete"
                        width={340}
                        options={renderersOptions}
                        optionIdentifier="type"
                        labelIdentifier="code"
                        bind:value={selectedRendererValue}
                        onSubmit={v => handleRendererSubmit(v, i)}
                      />
                    {/if}
                    {#if renderer.code}
                      <IconButton currentIcon={Close} on:click={v => onbtnDeleteRendererPage(i)} />
                    {/if}
                  {:else}
                    <Link title={renderer.code} class="ellipsis popupLink" on:click={v => onbtnRendererLinkHandler(v, renderer)}>{renderer.name}</Link
                    >
                  {/if}
                </Box>
              {/if}
            {/each}
          </Box>
        </Box>
      {/if}
    </Box>
  </Box>
  {#if jtracsOptions.length > 0}
    <Box column width="100%" height="auto" class="background_white  margin_top_bg JtracBox">
      <Box class="modify-text">Jtrac</Box>
      <Box height={2} class="modify-line" />
      <Box class="popup-border block child-background-color">
        {#each jtracsOptions as jtrac, i}
          {#if i < jtracsOptions.length - 1}
            <Box height={28} class=" popup-position select-height-pop related-padding-left" horizontalAlign="left" verticalAlign="middle">
              <Link title={jtrac.jtracNo} class="ellipsis popupLink " on:click={v => onbtnJtracLinkHandler(v, jtrac)}>{jtrac.jtracNo}</Link>
            </Box>
          {:else if i === jtracsOptions.length - 1}
            <Box height={28} horizontalAlign="left" verticalAlign="middle" class="popup-position select-height-pop related-padding-left">
              <Link title={jtrac.name} class="ellipsis popupLink " on:click={v => onbtnJtracLinkHandler(v, jtrac)}>{jtrac.name}</Link>
            </Box>
          {/if}
        {/each}
      </Box>
    </Box>
  {/if}
  <Box height={4} />
</div>

<style>
  :global(.select-height-pop > div) {
    min-height: 28px !important;
    line-height: 28px !important;
    border-radius: 0% !important;
  }

  :global(.pop-text-align) {
    text-align: left;
  }
</style>
