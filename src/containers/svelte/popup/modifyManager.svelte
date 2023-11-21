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
  import pageStore from '@/store/ModifyManageStore';
  import { PageManageAlert } from '@/constant/alert/Base';
  import { setWaiting, removeWaiting } from '@/utils/loaderUtils';
  import CustomAlert, { AlertIcon } from '@/components/CustomAlert';
  import Save from 'carbon-icons-svelte/lib/Save.svelte';
  import Edit from 'carbon-icons-svelte/lib/Edit.svelte';
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
  import {
    mpManagementTypeList,
    spManagementTypeList,
    buyerManagementTypeList,
    expManagementTypeList,
    gerpManagementTypeList,
  } from '@/constant/constant';
  import { tick } from 'svelte';
  import { UserInfo } from '@/utils/Settings';

  let pages = [];
  let renderers = [];
  let checkList = [];
  let selectPersion = [];
  let selectChecker = [];
  let managementList = [];
  let popsOptions = [];
  let renderersOptions = [];
  let jtracsOptions = [];
  let bizList = [];
  let person = '';
  let checkPerson = '';
  let id = '';
  let inputID = '';
  let name = '';
  let inputName = '';
  let managementName = '';
  let selectManagement = '';
  let selectedManagementValue = '';
  let typeName = '';
  let modifyMode = false;
  let saveType = false;
  let count = 5;
  let selectedPopsValue = null;
  let selectedRendererValue = null;
  let str = /[\u4E00-\u9FA5]/;
  let selected = false;
  let permissionData = [];

  export let params;
  export let onClose;

  onMount(() => {
    setWaiting();
    searchPopupList();
    searchRenderer();
    getUserActivePermission();
    pageStore.getJtracsByPageId(params.code);
    person = params.developerName;
    checkPerson = params.reviewerName;
    id = params.code;
    name = params.name;
    managementName = params.managementName;
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
    selectManagement = params.management;
  });

  onDestroy(() => {
    disposerPerson();
    disposer();
    disposerUpdate();
    disposerPopupList();
    disposerJtracs();
    getPermission();
  });

  const getPermission = autorun(() => {
    if (pageStore.getUserActivePermissionResult) {
      const permisisonList = JSON.parse(JSON.stringify(pageStore.getUserActivePermissionResult));
      pageStore.getUserActivePermissionResult = null;
      removeWaiting();
      if (!permisisonList.error) {
        permissionData = permisisonList.data?.split(',');
      }
    }
  });

  const disposerPerson = autorun(() => {
    if (pageStore.userPersionResult) {
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

  const disposer = autorun(() => {
    if (pageStore.userListResult) {
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
    if (pageStore.updateMpPageInfoResult) {
      const value = JSON.parse(JSON.stringify(pageStore.updateMpPageInfoResult));
      pageStore.updateMpPageInfoResult = null;
      removeWaiting();
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
    if (pageStore.getPageIdsByTypeResult) {
      const value = JSON.parse(JSON.stringify(pageStore.getPageIdsByTypeResult));
      pageStore.getPageIdsByTypeResult = null;
      removeWaiting();
      countOver();
      if (!value.error) {
        if (value.data.length > 0) {
          if (value.data[0].type === 'pop') {
            popsOptions = value.data;
            popsOptions.unshift({ code: '--请选择--' });
            if (popsOptions[0].code === '--请选择--') {
              selectedPopsValue = popsOptions[0];
            }
          } else if (value.data[0].type === 'renderer') {
            renderersOptions = value.data;
            renderersOptions.unshift({ code: '--请选择--' });
            if (renderersOptions[0].code === '--请选择--') {
              selectedRendererValue = renderersOptions[0];
            }
          }
          pages = [];
          if (params.relatedPops) {
            let pageArray = params.relatedPops.split(',');
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
          if (params.relatedRenderers) {
            let renderArray = params.relatedRenderers.split(',');
            renderArray?.forEach(elem => {
              if (elem) {
                renderers.push({ name: elem, code: elem, type: 'label' });
              }
            });
          }
          if (params.type !== 'renderer' && modifyMode) {
            pages.push({ name: '', code: '', type: 'input' });
            renderers.push({ name: '', code: '', type: 'input' });
          }
        }
      } else {
        CustomAlert(PageManageAlert.INTERNET_ERROR, AlertIcon.ERROR);
      }
    }
  });

  const disposerJtracs = autorun(() => {
    if (pageStore.getJtracsByPageIdResult) {
      const value = JSON.parse(JSON.stringify(pageStore.getJtracsByPageIdResult));

      pageStore.getJtracsByPageIdResult = null;
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

  function countOver() {
    count--;
    if (count === 0) {
      removeWaiting();
    }
  }

  function getUserActivePermission() {
    const info = UserInfo.userId;
    pageStore.getUserActivePermission(info);
  }

  function searchRenderer() {
    const info = {
      code: '',
      name: '',
      type: 'renderer',
      iStart: 0,
      iPageCount: 9999,
    };
    pageStore.getPageIdsByType(info);
  }

  function searchBizDebeloper() {
    const info = {
      blockflag: 'N',
      usertype: 'U',
      iStart: 0,
      iPageCount: 20,
    };
    pageStore.getUserList(info);
  }

  function searchCheckList() {
    const strs = ['O'];
    pageStore.getUserCheckPersonList(strs);
  }

  function searchManagerList() {
    pageStore.getMpPageMgmtType();
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
    if (params.type !== 'renderer' && params.type !== 'pop') {
      if (selectManagement === '') {
        CustomAlert(PageManageAlert.PLEASE_SELECT_MANAGEMENT);
        return;
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
          r.set(renderers[i].code, renderers[i].code);
          relatedRenderers.push(renderers[i].code);
        }
      }
    }
    const info = {
      id: params.id,
      name: inputName,
      code: inputID,
      management: selectManagement,
      type: params.type,
      developer: selectPersion.length > 0 ? selectPersion.toString():'',
      reviewer: selectChecker.toString(),
      relatedPops: relatedPops.toString(),
      relatedRenderers: relatedRenderers.toString(),
    };
    saveType = false;
    setWaiting();
    pageStore.updateMpPageInfo(info);
  }

  function searchPopupList() {
    const info = {
      code: '',
      name: '',
      type: 'pop',
      iStart: 0,
      iPageCount: 9999,
    };
    setWaiting();
    pageStore.getPageIdsByType(info);
  }

  function onbtnPopLinkHandler(v, page) {
    if (page.code) {
      CreatePop('MP管理页面-详细', pageModifyManager, page.code, onClosePopHandler, { width: '900px', height: '800px' });
    }
  }

  function onbtnRendererLinkHandler(v, renderer) {
    if (renderer.code) {
      CreatePop('MP管理页面-详细', pageModifyManager, renderer.code, onClosePopHandler, { width: '900px', height: '800px' });
    }
  }

  function onClosePopHandler(data) {
    if (data === 'Y') {
      onClose(data);
    }
  }

  function onBtnModifyClick() {
    modifyMode = true;
    selected = true;
    inputID = params.code;
    inputName = params.name;
    managementName = params.managementName;
    selectChecker = params.reviewer;
    selectPersion = params.developer;
    count = 4;
    setWaiting();
    searchBizDebeloper();
    searchCheckList();
    searchPopupList();
    searchRenderer();
    if (params.type !== 'renderer') {
      pages.push({ name: '', code: '', type: 'input' });
      renderers.push({ name: '', code: '', type: 'input' });
    }
  }

  function onbtnJtracLinkHandler(v, page) {
    CreatePop('Jtrac详细', fileDetail, { jtracNo: page.jtracNo });
  }

  function onbtnDeletePage(i) {
    pages = pages.filter((item, num) => num !== i);
  }

  function onbtnDeleteRendererPage(i) {
    renderers = renderers.filter((item, num) => num !== i);
  }

  async function handleSubmit(value, i) {
    pages[i].name = value.name;
    pages[i].code = value.code;
    pages[i].type = 'label';
    if (pages[i].code !== '--请选择--') {
      pages.push({ name: '', code: '', type: 'input' });
      await tick();
      document.getElementById('outer-modify').parentElement.scrollTop = document.getElementById('outer-modify').parentElement.scrollHeight;
    }
  }

  async function handleRendererSubmit(value, i) {
    renderers[i].name = value.name;
    renderers[i].code = value.code;
    renderers[i].type = 'label';
    if (renderers[i].code !== '--请选择--') {
      renderers.push({ name: '', code: '', type: 'input' });
      await tick();
      document.getElementById('outer-modify').parentElement.scrollTop = document.getElementById('outer-modify').parentElement.scrollHeight;
    }
  }

  function onBtnDeleteHandlerClick() {
    CustomAlert(PageManageAlert.ARE_YOU_SURE_DELETE, AlertIcon.PROMPT, onDelete);
  }

  function onDelete(data) {
    if (data === 'Y') {
      let info = {
        id: params.id,
        isDelete: 'Y',
      };
      saveType = true;
      setWaiting();
      pageStore.updateMpPageInfo(info);
    }
  }

  function onTextIDChangeHandler(e) {
    if (params.type === 'renderer') {
      if (str.test(e.detail.data)) {
        CustomAlert(PageManageAlert.NOT_CHINESE_INPUT);
        e.detail.data = '';
        inputID = e.detail.data;
      }
      inputName = e.detail.data;
    } else {
      if (str.test(e.detail.data)) {
        CustomAlert(PageManageAlert.NOT_CHINESE_INPUT);
        inputID = '';
      }
    }
  }

  function onTextNameChangeHandler(e) {
    if (params.type === 'renderer') {
      if (str.test(e.detail.data)) {
        CustomAlert(PageManageAlert.NOT_CHINESE_INPUT);
        e.detail.data = '';
        inputName = e.detail.data;
      }
      inputID = e.detail.data;
    }
  }

  function onManagementSubmitHandler(value) {
    selectManagement = value.code;
  }
</script>

<div id="outer-modify">
  <Box horizontalAlign="right" class="margin_bottom modifyTop">
    {#if modifyMode}
      <Button size="small" kind="tertairy" class=" button-normal button-main-style" icon={Save} on:click={onBtnSaveClick}>保存</Button>
    {:else if permissionData?.includes('M_C')}
      <Button size="small" kind="tertairy" class="btn-margin-left button-normal button-main-style" icon={Edit} on:click={onBtnModifyClick}
        >修改</Button
      >
    {/if}
    {#if permissionData?.includes('M_B')}
      <Button size="small" kind="tertairy" class="btn-margin-left button-normal button-main-style" icon={TrashCan} on:click={onBtnDeleteHandlerClick}
        >删除</Button
      >
    {/if}
  </Box>
  <Box height="35px">
    <Box class="background modifyLableStyle" horizontalAlign="compact" verticalAlign="middle">
      <Text class="textColor modify-line-height">Type</Text>
    </Box>
    <Box width="100%" class="border_right_bottom_top padding_right_left typeLable " horizontalAlign="left" verticalAlign="middle">
      <Text class="ellipsis typeText pop-text-align modify-line-height">{typeName}</Text>
    </Box>
  </Box>
  <Box height="35px">
    <Box class="background modifyLableStyle" horizontalAlign="compact" verticalAlign="middle">
      <Text class="textColor modify-line-height">ID</Text>
    </Box>
    <Box width="100%" class="border_right_bottom padding_right_left typeLable ellipsis" horizontalAlign="left" verticalAlign="middle">
      {#if modifyMode}
        <Input class="typeText popupInput pop-text-align modify-line-height" bind:value={inputID} maxAscii={255} on:blur={onTextIDChangeHandler} />
      {:else}
        <Text title={id} class="ellipsis popupText  pop-text-align modify-line-height" type={id}>{id}</Text>
      {/if}
    </Box>
  </Box>
  <Box height="35px">
    <Box class="background modifyLableStyle" horizontalAlign="compact" verticalAlign="middle">
      <Text class="textColor modify-line-height">Name</Text>
    </Box>
    <Box class="border_right_bottom padding_right_left typeLable ellipsis" horizontalAlign="left" verticalAlign="middle">
      {#if modifyMode}
        <Input
          class=" typeText popupInput pop-text-align modify-line-height"
          bind:value={inputName}
          maxAscii={255}
          on:blur={onTextNameChangeHandler}
        />
      {:else}
        <Text title={name} class="ellipsis popupText  pop-text-align modify-line-height">{name}</Text>
      {/if}
    </Box>
  </Box>
  <Box height="35px">
    <Box class="background modifyLableStyle" horizontalAlign="compact" verticalAlign="middle">
      <Text class="textColor modify-line-height">Management</Text>
    </Box>
    <Box
      class="border_right_bottom padding_right_left_bottom typeLable advancedSelectPadding popup-select-height"
      horizontalAlign="left"
      verticalAlign="middle"
    >
      {#if modifyMode}
        <AdvancedSelect
          bind:value={selectManagement}
          options={managementList}
          container={document.body}
          optionIdentifier="code"
          labelIdentifier="name"
          onSubmit={v => onManagementSubmitHandler(v)}
        />
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
      flexDisplay={false}
      class="border_right_bottom padding_right_left typeLable  multiselect {modifyMode ? 'multiselectPadding' : ''}"
      horizontalAlign="left"
      verticalAlign="middle"
    >
      {#if modifyMode}
        <MultiSelect class="margin-botton" hideLabel dataProvider={bizList} bind:selectedIds={selectPersion} />
      {:else}
        <Text title={person} class="ellipsis typeText pop-text-align modify-line-height">{person}</Text>
      {/if}
    </Box>
  </Box>
  <Box height="35px">
    <Box class="background modifyLableStyle" horizontalAlign="compact" verticalAlign="middle">
      <Text class="textColor modify-line-height">检查负责人</Text>
    </Box>
    <Box
      flexDisplay={false}
      class="border_right_bottom padding_right_left typeLable  multiselect {modifyMode ? 'multiselectPadding' : ''}"
      horizontalAlign="left"
      verticalAlign="middle"
    >
      {#if modifyMode}
        <MultiSelect direction="top" class="margin-botton" hideLabel dataProvider={checkList} bind:selectedIds={selectChecker} />
      {:else}
        <Text title={checkPerson} class="ellipsis typeText pop-text-align modify-line-height">{checkPerson}</Text>
      {/if}
    </Box>
  </Box>
  <Box column width="100%">
    {#if pages.length > 0}
      <Box column width="100%" class="background_white margin_right margin_top_bg popupSelect">
        <Box class="modify-text">关联pop</Box>
        <Box height={2} class="modify-line" />
        <Box class="popup-border-top block child-background-color {modifyMode ? 'border-left-right' : 'popup-border-bottom'}">
          {#each pages as page, i}
            {#if i < pages.length - 1}
              <Box
                height={28}
                class=" popup-position select-height-pop gost-button-margin related-padding-left select-margin-right label-border-left label-border-right"
                horizontalAlign="left"
                verticalAlign="middle"
              >
                {#if modifyMode}
                  {#if page.type === 'label' && page.code !== '--请选择--'}
                    <!-- <Link style="width:300px" on:click={(v) => onbtnPopLinkHandler(v, page)}>{page.code}</Link> -->
                    <Text title={page.code} class="ellipsis popupLable pop-text-align related-label-margin-left ">{page.code}</Text>
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
                class="popup-position select-height-pop gost-button-margin related-padding-left select-margin-right label-border-left label-border-right"
              >
                {#if modifyMode}
                  {#if page.type === 'label' && page.code !== '--请选择--'}
                    <Text title={page.code} class="ellipsis popupLable pop-text-align related-label-margin-left ">{page.code}</Text>
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
      <Box column width="100%" class="background_white margin_right margin_top_bg popupSelect">
        <Box class="modify-text">关联renderer</Box>
        <Box height={2} class="modify-line" />
        <Box class="popup-border-top block child-background-color {modifyMode ? 'border-left-right' : 'popup-border-bottom'}">
          {#each renderers as renderer, i}
            {#if i < renderers.length - 1}
              <Box
                height={28}
                class=" popup-position select-height-pop gost-button-margin related-padding-left select-margin-right label-border-left label-border-right"
                horizontalAlign="left"
                verticalAlign="middle"
              >
                {#if modifyMode}
                  {#if renderer.type === 'label' && renderer.code !== '--请选择--'}
                    <Text title={renderer.code} class="ellipsis popupLable pop-text-align related-label-margin-left ">{renderer.code}</Text>
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
                  {#if renderer.code && renderer.code !== '--请选择--'}
                    <IconButton currentIcon={Close} on:click={v => onbtnDeleteRendererPage(i)} />
                  {/if}
                {:else}
                  <Link title={renderer.code} class="ellipsis popupLink " on:click={v => onbtnRendererLinkHandler(v, renderer)}>{renderer.code}</Link>
                {/if}
              </Box>
            {:else if i === renderers.length - 1}
              <Box
                height={28}
                horizontalAlign="left"
                verticalAlign="middle"
                class="popup-position select-height-pop gost-button-margin related-padding-left select-margin-right related-padding-left label-border-left label-border-right"
              >
                {#if modifyMode}
                  {#if renderer.type === 'label' && renderer.code !== '--请选择--'}
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
                  {#if renderer.code && renderer.code !== '--请选择--'}
                    <IconButton currentIcon={Close} on:click={v => onbtnDeleteRendererPage(i)} />
                  {/if}
                {:else}
                  <Link title={renderer.name} class="ellipsis popupLink" on:click={v => onbtnRendererLinkHandler(v, renderer)}>{renderer.name}</Link>
                {/if}
              </Box>
            {/if}
          {/each}
        </Box>
      </Box>
    {/if}
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
  :global(.block) {
    display: block !important;
  }

  :global(.popup-border) {
    border: 1px solid #cfcfcf;
  }

  :global(.popup-border-top) {
    border-top: 1px solid #cfcfcf;
  }

  :global(.popup-border-bottom) {
    border-bottom: 1px solid #cfcfcf;
  }

  :global(.popup-border-bottom) {
    border-bottom: 1px solid #cfcfcf;
  }

  :global(.label-border-left) {
    border-left: 1px solid #cfcfcf;
  }

  :global(.label-border-right) {
    border-right: 1px solid #cfcfcf;
  }

  :global(.pop-text-align) {
    text-align: left;
  }

  :global(.right-button) {
    margin-left: 10px;
  }

  :global(.gost-button-margin > .bx--btn--ghost) {
    padding: 0px;
    height: 30px;
    line-height: 30px;
    width: 24px;
    margin-right: 5px;
  }

  :global(.child-background-color > div:nth-child(2n + 1)) {
    background-color: #f2f2f2;
  }

  /* :global(.child-background-color > div:first-child) {
    border-top: 1px solid #cfcfcf;
  } */

  :global(.border-left-right > div:nth-last-child(1)) {
    border-left: none;
    border-right: none;
    padding-left: 0px;
  }

  :global(.modify-line-height) {
    line-height: 35px;
  }

  :global(.related-padding-left) {
    padding-left: 5px;
  }

  :global(.related-padding-left > a) {
    height: 28px;
    line-height: 30px;
  }

  :global(.select-margin-right > .svelte-select > .indicators) {
    margin-right: 6px;
  }

  :global(.related-label-margin-left) {
    margin-left: 0px;
  }

  :global(.popupSelect) {
    border: 0px;
  }
</style>
