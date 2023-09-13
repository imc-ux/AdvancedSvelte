<script>
  import "@/styles/core/white.css";
  import "@/styles/core/index.scss";
  import {
    Button,
    Input,
    Box,
    Text,
    MultiSelect,
    AdvancedSelect,
  } from "@/components/sveltecomponents";
  import { IconButton } from "@/components/renderers";
  import { onMount, onDestroy } from "svelte";
  import Save from "carbon-icons-svelte/lib/Save.svelte";
  import Close from "carbon-icons-svelte/lib/Close.svelte";
  import { tick } from "svelte";
  import pageStore from "@/store/addPageManagerStore";
  import { PageManageAlert } from "@/constant/alert/Base";
  import { setWaiting, removeWaiting } from "@/utils/loaderUtils";
  import { autorun } from "mobx";
  import {
    types,
    mpManagementTypeList,
    spManagementTypeList,
    buyerManagementTypeList,
    expManagementTypeList,
    gerpManagementTypeList,
  } from "@/constant/constant";
  import CustomAlert, { AlertIcon } from "@/components/CustomAlert";

  let bizList = [];
  let checkList = [];
  let managementList = [{ code: "", name: "--请选择--" }];
  let fileName = "";
  let userName = "";
  let selectedType = "";

  let selectPersion = [];
  let selectChecker = [];
  let selectManagementList = "";
  let popPages = [];
  let popsOptions = [];
  let rendererPages = [];
  let renderersOptions = [];
  let count = 0;
  let labelType = "input";
  let isShowPopInput = true; //控制pop下拉框是否显示
  let isShowRendererInput = true; //控制Renderer下拉框是否显示
  let selectedValue = types[0];
  let selectedManagementValue = null;
  let selectedPopsValue = null;
  let selectedRendererValue = null;
  let str = /[\u4E00-\u9FA5]/;
  let direction = "bottom";

  export let onClose;

  onMount(() => {
    setWaiting();
    count = 4;
    searchBizDebeloper();
    searchCheckList();

    onAddPOPHandler();
    onAddRenderHandler();
    addClassHandler();
    searchPopupList();
    searchRenderer();
  });

  onDestroy(() => {
    disposerPerson();
    disposer();
    disposerPopupList();
    disposerCreatePage();
  });

  function countOver() {
    count--;
    if (count === 0) {
      removeWaiting();
    }
  }

  const disposerCreatePage = autorun(() => {
    if (pageStore.createMpPageMgmtInfoResult) {
      const value = JSON.parse(
        JSON.stringify(pageStore.createMpPageMgmtInfoResult)
      );
      countOver();
      pageStore.createMpPageMgmtInfoResult = null;

      if (!value.error) {
        CustomAlert(PageManageAlert.SAVE_DATA, AlertIcon.SUCCESS);
        onClose("Y");
      } else {
        CustomAlert(value.msg, AlertIcon.ERROR);
      }
    }
  });

  const disposerPerson = autorun(() => {
    if (pageStore.userPersionResult) {
      const value = JSON.parse(JSON.stringify(pageStore.userPersionResult));
      countOver();
      pageStore.userPersionResult = null;

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
      countOver();
      pageStore.userListResult = null;

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

  const disposerPopupList = autorun(() => {
    if (pageStore.getPageIdsByTypeResult) {
      const value = JSON.parse(
        JSON.stringify(pageStore.getPageIdsByTypeResult)
      );
      countOver();
      pageStore.getPageIdsByTypeResult = null;
      if (!value.error) {
        if (value.data.length > 0) {
          if (value.data[0].type === "pop") {
            popsOptions = value.data;
            popsOptions.unshift({ code: "--请选择--" });
            selectedPopsValue = popsOptions[0];
          } else if (value.data[0].type === "renderer") {
            renderersOptions = value.data;
            renderersOptions.unshift({ code: "--请选择--" });
            selectedRendererValue = renderersOptions[0];
          }
        }
      } else {
        CustomAlert(value.msg, AlertIcon.ERROR);
      }
    }
  });

  function searchBizDebeloper() {
    const info = {
      blockflag: "N",
      usertype: "U",
      iStart: 0,
      iPageCount: 20,
    };
    pageStore.getUserList(info);
  }

  function searchCheckList() {
    const strs = ["O"];
    pageStore.getUserCheckPersonList(strs);
  }

  function searchPopupList() {
    const info = {
      code: "",
      name: "",
      type: "pop",
      developer: "",
      iStart: 0,
      iPageCount: 9999,
    };
    pageStore.getPageIdsByType(info);
  }

  function searchRenderer() {
    const info = {
      code: "",
      name: "",
      type: "renderer",
      developer: "",
      iStart: 0,
      iPageCount: 9999,
    };
    pageStore.getPageIdsByType(info);
  }

  function onBtnSaveClickHandler() {
    if (!fileName) {
      CustomAlert(PageManageAlert.ID_NOT_NULL);
      return;
    }
    if (!userName) {
      CustomAlert(PageManageAlert.NAME_NOT_NULL);
      return;
    }
    if (!selectedType) {
      CustomAlert(PageManageAlert.PLEASE_SELECT_TYPE);
      return;
    }
    if (selectedType !== "pop" && selectedType !== "renderer") {
      if (selectManagementList === "") {
        CustomAlert(PageManageAlert.PLEASE_SELECT_MANAGEMENT);
        return;
      }
    }
    let relatedPops = [];
    let m = new Map();
    if (popPages.length > 0) {
      for (let i = 0; i < popPages.length; i++) {
        if (m.get(popPages[i].code)) {
          CustomAlert(PageManageAlert.POP_NOT_CAN_DUPLICATE);
          return;
        }
        m.set(popPages[i].code, popPages[i].code);
        relatedPops.push(popPages[i].code);
      }
    }
    let relatedRenderers = [];
    let r = new Map();
    if (rendererPages.length > 0) {
      for (let i = 0; i < rendererPages.length; i++) {
        if (r.get(rendererPages[i].code)) {
          CustomAlert(PageManageAlert.RENDERER_NOT_CAN_DUPLICATE);
          return;
        }
        r.set(rendererPages[i].code, rendererPages[i].code);
        relatedRenderers.push(rendererPages[i].code);
      }
    }
    const info = {
      name: userName,
      code: fileName,
      management: selectManagementList,
      type: selectedType,
      developer: selectPersion.toString(),
      reviewer: selectChecker.toString(),
      relatedPops: selectedType === "renderer" ? "" : relatedPops.toString(),
      relatedRenderers:
        selectedType === "renderer" ? "" : relatedRenderers.toString(),
    };
    setWaiting();
    pageStore.createMpPageMgmtInfo(info);
  }

  function onAddPOPHandler() {
    const info = {
      name: "",
      code: "",
      type: labelType,
    };
    popPages = popPages.concat(info);
  }

  function onAddRenderHandler(e) {
    const info = {
      name: "",
      code: "",
      type: labelType,
    };
    rendererPages = rendererPages.concat(info);
  }

  function onDeleteClickHandler(i) {
    popPages = popPages.filter((item, num) => num !== i);
  }

  function onDeleteRendererClickHandler(i) {
    rendererPages = rendererPages.filter((item, num) => num !== i);
  }

  async function handleSubmit(value, i) {
    popPages[i].name = value.name;
    popPages[i].code = value.code;
    popPages[i].type = "label";
    popPages.push({ name: "", code: "", type: "input" });
    await tick();
    document.getElementById("related-pop-id").scrollTop =
      document.getElementById("related-pop-id").scrollHeight;
  }

  async function handleRendererSubmit(value, i) {
    rendererPages[i].name = value.name;
    rendererPages[i].code = value.code;
    rendererPages[i].type = "label";
    rendererPages.push({ name: "", code: "", type: "input" });
    await tick();
    document.getElementById("related-renderer-id").scrollTop =
      document.getElementById("related-renderer-id").scrollHeight;
  }

  function onTextIDChangeHandler(e) {
    if (selectedType === "renderer") {
      if (str.test(e.detail.data)) {
        CustomAlert(PageManageAlert.NOT_CHINESE_INPUT);
        e.detail.data = "";
        fileName = "";
      }
      userName = e.detail.data;
    } else {
      if (str.test(e.detail.data)) {
        CustomAlert(PageManageAlert.NOT_CHINESE_INPUT);
        fileName = "";
      }
    }
  }

  function onTextNameChangeHandler(e) {
    if (selectedType === "renderer") {
      if (str.test(e.detail.data)) {
        CustomAlert(PageManageAlert.NOT_CHINESE_INPUT);
        e.detail.data = "";
        userName = e.detail.data;
      }
      fileName = e.detail.data;
    }
  }

  function onTypeSubmitHandler(value) {
    selectedType = value.code;
    selectedValue = value;
    if (selectedType === "renderer") {
      userName = fileName;
      isShowPopInput = false;
      isShowRendererInput = false;
      direction = "top";
    } else {
      isShowRendererInput = true;
      isShowPopInput = true;
      direction = "bottom";
    }
    selectedManagementValue = "";
    if (selectedType === "buyer") {
      managementList = buyerManagementTypeList;
    } else if (selectedType === "supplier") {
      managementList = spManagementTypeList;
    } else if (selectedType === "gerp") {
      managementList = gerpManagementTypeList;
    } else if (selectedType === "buyerExp") {
      managementList = expManagementTypeList;
    } else if (selectedType === "main") {
      managementList = mpManagementTypeList;
    } else {
      managementList = [{ code: "", name: "--请选择--" }];
    }
  }

  function onManagementSubmitHandler(value) {
    selectManagementList = value.code;
    selectedManagementValue = value;
  }

  function addClassHandler() {
    document.getElementById(
      "outter"
    ).parentElement.parentElement.style.maxHeight = "none";
    document.getElementById("outter").parentElement.style.padding =
      "10px 10px 5px";
    document.getElementById("outter").parentElement.style.overflowY = "clip";
  }
</script>

<div id="outter" style="overflow-y:auto;height:600px">
  <Box horizontalAlign="right" class="typeLable">
    <Button
      class="button-normal margin_bottom_s button-main-style"
      size="small"
      kind="tertairy"
      icon={Save}
      on:click={onBtnSaveClickHandler}>保存</Button>
  </Box>
  <Box class="typeLable">
    <Box
      class="addPage-list background_border"
      horizontalAlign="compact"
      verticalAlign="middle">
      <Text>Type</Text>
    </Box>
    <Box
      f={1}
      class="border_right_top padding-normal popup-position popup-select-height"
      horizontalAlign="left"
      verticalAlign="middle">
      <AdvancedSelect
        options={types}
        optionIdentifier="code"
        labelIdentifier="name"
        bind:value={selectedValue}
        onSubmit={(v) => onTypeSubmitHandler(v)} />
    </Box>
  </Box>
  <Box class="typeLable">
    <Box
      class="addPage-list background"
      horizontalAlign="compact"
      verticalAlign="middle">
      <Text>ID</Text>
    </Box>
    <Box
      f={1}
      class="border_right padding-normal"
      horizontalAlign="left"
      verticalAlign="middle">
      <Input
        bind:value={fileName}
        maxAscii={255}
        on:blur={onTextIDChangeHandler}
        class="input popTextHeight" />
    </Box>
  </Box>
  <Box class="typeLable">
    <Box
      class="addPage-list background"
      horizontalAlign="compact"
      verticalAlign="middle">
      <Text>Name</Text>
    </Box>
    <Box
      f={1}
      class="border_right padding-normal"
      horizontalAlign="left"
      verticalAlign="middle">
      <Input
        bind:value={userName}
        maxAscii={255}
        on:blur={onTextNameChangeHandler}
        class="popTextHeight" />
    </Box>
  </Box>
  <Box class="typeLable">
    <Box
      class="addPage-list background"
      horizontalAlign="compact"
      verticalAlign="middle">
      <Text>Management</Text>
    </Box>
    <Box
      f={1}
      class="border_right padding-normal popup-position {isShowPopInput ===
        false || isShowRendererInput === false
        ? 'select-max-height'
        : 'select-max-height-none'}"
      horizontalAlign="left"
      verticalAlign="middle">
      <AdvancedSelect
        options={managementList}
        optionIdentifier="code"
        labelIdentifier="name"
        bind:value={selectedManagementValue}
        onSubmit={(v) => onManagementSubmitHandler(v)} />
    </Box>
  </Box>
  <Box class="typeLable ">
    <Box
      class="addPage-list background"
      horizontalAlign="compact"
      verticalAlign="middle">
      <Text>页面负责人</Text>
    </Box>
    <Box
      f={1}
      flexDisplay={false}
      width="auto"
      height="34px"
      class="border_right padding-normal add-padding-bottom-top box-width {isShowPopInput ===
        false || isShowRendererInput === false
        ? 'select-max-height'
        : 'select-max-height-none'}"
      horizontalAlign="left"
      verticalAlign="middle">
      <MultiSelect
        f={1}
        dataProvider={bizList}
        bind:selectedIds={selectPersion}
        class="popTextHeight "
        bind:direction />
    </Box>
  </Box>
  <Box class="typeLable">
    <Box
      class="addPage-list background"
      horizontalAlign="compact"
      verticalAlign="middle">
      <Text>检查负责人</Text>
    </Box>
    <Box
      f={1}
      flexDisplay={false}
      height="35px"
      class="border_right_bottom padding-normal add-padding-bottom-top  {isShowPopInput ===
        false || isShowRendererInput === false
        ? 'select-max-height'
        : 'select-max-height-none'}"
      horizontalAlign="left"
      verticalAlign="middle">
      <MultiSelect
        f={1}
        hideLabel
        dataProvider={checkList}
        bind:selectedIds={selectChecker}
        class="popTextHeight"
        bind:direction />
    </Box>
  </Box>
  {#if isShowPopInput === true}
    <Box class="addPopupHeight ">
      <Box
        class="addPage-list background"
        horizontalAlign="compact"
        verticalAlign="middle">
        <Text>关联pop</Text>
      </Box>

      <Box
        id="related-pop-id"
        f={1}
        flexDisplay={false}
        class="border_right_bottom padding-normal add-popup-box  "
        horizontalAlign="left"
        verticalAlign="middle">
        <Box f={1} flexDisplay={false}>
          {#each popPages as page, i}
            <Box
              class="margin-botton pop-button {isShowPopInput === false ||
              isShowRendererInput === false
                ? 'select-max-height'
                : 'select-max-height-none'}">
              {#if page.type === "label"}
                <Text title={page.code} class="ellipsis addPopupLabel "
                  >{page.code}</Text>
              {:else}
                <AdvancedSelect
                  class="autoComplete"
                  options={popsOptions}
                  optionIdentifier="type"
                  labelIdentifier="code"
                  bind:value={selectedPopsValue}
                  onSubmit={(v) => handleSubmit(v, i)} />
              {/if}
              {#if page.code}
                <IconButton
                  currentIcon={Close}
                  on:click={(v) => onDeleteClickHandler(i)} />
              {/if}
            </Box>
          {/each}
        </Box>
      </Box>
    </Box>
  {/if}
  {#if isShowRendererInput === true}
    <Box class="addPopupHeight" width="100%">
      <Box
        class="addPage-list background"
        horizontalAlign="compact"
        verticalAlign="middle">
        <Text>关联Renderer</Text>
      </Box>
      <Box
        id="related-renderer-id"
        f={1}
        flexDisplay={false}
        class="border_right_bottom padding-normal add-popup-box"
        horizontalAlign="left"
        verticalAlign="middle">
        <Box f={1} flexDisplay={false}>
          {#each rendererPages as page, i}
            <Box
              f={1}
              class="margin-botton pop-button  {!isShowPopInput ||
              !isShowRendererInput
                ? 'select-max-height'
                : 'select-max-height-none'} ">
              {#if page.type === "label"}
                <Text title={page.code} class="ellipsis addPopupLabel "
                  >{page.code}</Text>
              {:else}
                <AdvancedSelect
                  class="autoComplete "
                  options={renderersOptions}
                  optionIdentifier="type"
                  labelIdentifier="code"
                  bind:value={selectedRendererValue}
                  onSubmit={(v) => handleRendererSubmit(v, i)} />
              {/if}
              {#if page.code}
                <IconButton
                  currentIcon={Close}
                  on:click={(v) => onDeleteRendererClickHandler(i)} />
              {/if}
            </Box>
          {/each}
        </Box>
      </Box>
    </Box>
  {/if}
  <Box height={4} />
</div>

<style>
  :global(.addPage-list) {
    width: 150px !important;
    line-height: 34px !important;
    color: #fff;
    text-align: center;
    min-width: 150px;
  }

  :global(.select-max-height > div > div > .bx--list-box__menu) {
    max-height: 170px;
  }

  :global(.select-max-height > div .svelte-select-list) {
    max-height: 140px !important;
  }

  :global(.select-max-height-none) {
    max-height: none;
  }

  :global(.select-max-height-none > div) {
    min-height: 24px !important;
    border-radius: 0% !important;
    height: 30px;
  }

  :global(.popup-select-height > div) {
    min-height: 30px !important;
    border-radius: 0% !important;
  }

  :global(.pop-button > .bx--btn--ghost) {
    padding: 0px;
    height: 30px;
    line-height: 30px;
  }

  :global(.pop-button > .bx--btn--ghost .bx--btn__icon) {
    margin-right: 3px;
  }

  :global(.pop-button > .svelte-select) {
    min-height: 30px !important;
  }

  :global(.select-max-height > .svelte-select) {
    min-height: 30px !important;
  }

  :global(.bx--tag) {
    height: 20px;
    min-height: 20px !important;
  }

  :global(.bx--tag__label) {
    height: 20px;
    line-height: 20px;
  }

  :global(.add-padding-bottom-top > div > div > div > .bx--list-box__label) {
    line-height: 30px;
  }

  :global(.add-padding-bottom-top) {
    max-width: 460px;
  }

  /* :global(.button-z-index) {
    z-index: -1;
  } */

  :global(.button-display) {
    display: none;
  }
</style>
