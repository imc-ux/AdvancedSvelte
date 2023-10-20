<script lang="ts">
  import "@/styles/core/white.css";
  import "@/styles/core/index.scss";
  import { onMount, onDestroy } from "svelte";
  import {
    AdvancedSelect,
    Button,
    Input,
    Text,
  } from "@/components/sveltecomponents";
  import Save from "carbon-icons-svelte/lib/Save.svelte";
  import { userTypeList, blockFlagList } from "@/constant/constant";
  import { UserInfo } from "@/utils/Settings";
  import CustomAlert, { AlertIcon } from "@/components/CustomAlert";
  import { ModifyUserAlert } from "@/constant/alert/user";
  import modifyUserStore from "@/store/ModifyUser";
  import { autorun } from "mobx";
  import { deepClone } from "@/utils/CommonUtils";
  import { removeWaiting, setWaiting } from "@/utils/loaderUtils";
  import { Md5 } from "ts-md5";
  import { ImageUpload } from "@/components/sveltecomponents/index";
  import { getImagesServerUrl } from "@/utils/CommonUtils";

  export let params;
  export let onClose;
  let oldPassWord: string;
  let newPassWord: string;
  let confirmPassword: string;
  let id: string;
  let name: string;
  let userTypeCodeSelected: string;
  let userTypeSelected;
  let blockFlagCodeSelected: string;
  let blockFlagSelected;
  let ip: string;
  let imageSrc: string = "";
  let figure: string;
  let isNewPsw: boolean = false;
  let isOldPsw: boolean = false;
  const usertypeList = userTypeList.slice(1);
  const blockflagList = blockFlagList.slice(1);
  let isImgDisplay: boolean;
  let permissionData: any[] = [];

  onMount(() => {
    getUserActivePermission();
    id = params.id;
    name = params.name;
    ip = params.ip;
    imageSrc = getImagesServerUrl() + params.figure;
    userTypeCodeSelected = params.usertype;
    userTypeSelected = usertypeList.find((i) => i.id === params.usertype);
    blockFlagCodeSelected = params.blockflag;
    blockFlagSelected = blockflagList.find((i) => i.id === params.blockflag);
    document.getElementById("user-id").style.cursor = "not-allowed";
    if (params.figure === "figures/figure000.jpg") {
      isImgDisplay = false;
    }
  });

  onDestroy(() => {
    modifyUser();
    getUserActivePermissionList();
  });

  const modifyUser = autorun(() => {
    if (modifyUserStore.modifyUserResult) {
      const modifyValue = deepClone(modifyUserStore.modifyUserResult);
      modifyUserStore.modifyUserResult = null;
      removeWaiting();
      if (!modifyValue.error) {
        CustomAlert(ModifyUserAlert.SAVE_SUCCESS, AlertIcon.SUCCESS);
        onClose("Y");
      } else {
        CustomAlert(ModifyUserAlert.INTERNET_ERROR, AlertIcon.ERROR);
        onClose("Y");
      }
    }
  });

  const getUserActivePermissionList = autorun(() => {
    if (modifyUserStore.getUserActivePermissionResult) {
      const permissionList = deepClone(
        modifyUserStore.getUserActivePermissionResult
      );
      modifyUserStore.getUserActivePermissionResult = null;
      removeWaiting();
      if (!permissionList.error) {
        permissionData = permissionList.data.split(",");
      }
    }
  });

  function getUserActivePermission() {
    const info = UserInfo.userId;
    modifyUserStore.getUserActivePermission(info);
  }

  function onNameChangeHandler(e: CustomEvent) {
    name = e.detail.data;
  }

  function onUserTypeSelectedHandler(e: any) {
    userTypeCodeSelected = e.id;
    userTypeSelected = e;
  }

  function onBlockFlagSelectedHandler(e: any) {
    blockFlagSelected = e;
    blockFlagCodeSelected = e.id;
  }

  function onOldPswChangeHandler(event: CustomEvent) {
    oldPassWord = event.detail.data;
    if (oldPassWord?.trim()) {
      isOldPsw = true;
    }
  }

  function onNewPswChangeHandler(event: CustomEvent) {
    newPassWord = event.detail.data;
    if (newPassWord?.trim()) {
      isNewPsw = true;
    }
  }

  function onConfirmPswChangeHandler(event: CustomEvent) {
    confirmPassword = event.detail.data;
  }

  function onIpChangeHandler(e: CustomEvent) {
    ip = e.detail.data;
  }

  function onSaveBtnClickHandler() {
    if (!validate()) {
      return;
    } else {
      const info: any = {};
      info.id = id?.trim();
      info.name = name?.trim();
      info.usertype = userTypeCodeSelected;
      info.blockflag = blockFlagCodeSelected;
      info.ip = ip?.trim() ?? params.ip;
      info.figure = figure?.trim() ?? params.figure;
      if (isOldPsw) {
        info.oldPsw = Md5.hashStr(oldPassWord?.trim()).toLocaleUpperCase();
      }
      if (isNewPsw) {
        info.password = Md5.hashStr(newPassWord?.trim()).toLocaleUpperCase();
      }
      setWaiting();
      modifyUserStore.modifyUser(info);
    }
  }

  function validate() {
    if (
      newPassWord?.trim() !== "" &&
      newPassWord?.trim() !== confirmPassword?.trim()
    ) {
      CustomAlert(
        ModifyUserAlert.THE_TWO_PSW_INPUT_ARE_INCONSISTENT,
        AlertIcon.ERROR
      );
      return false;
    }
    return true;
  }

  function onImageUploadHandler(e: any) {
    imageSrc = e.detail.value;
    figure = e.detail.path;
  }
</script>

<div>
  {#if UserInfo.userId === id?.trim() || permissionData?.includes("U_B")}
    <div class="btn-align-right">
      <Button
        class="button-normal button-text-vertical-align"
        size="small"
        kind="tertiary"
        icon={Save}
        on:click={onSaveBtnClickHandler}>保存</Button
      >
    </div>
  {:else}
    <div class="btn-align-right" style="height:33px" />
  {/if}

  <div class="modify-user">
    <div class="flex">
      <div class="left-div">
        <Text>ID</Text>
      </div>
      <div class="right-div modify-input user-id-disabled">
        <Input bind:value={id} id="user-id" disabled />
      </div>
    </div>
    <div class="flex">
      <div class="left-div">
        <Text>姓名</Text>
      </div>
      <div class="right-div modify-input">
        <Input bind:value={name} on:input={onNameChangeHandler} />
      </div>
    </div>
    <div class="flex">
      <div class="left-div">
        <Text>用户类型</Text>
      </div>
      <div class="right-div right-select">
        <AdvancedSelect
          optionIdentifier="id"
          labelIdentifier="value"
          options={usertypeList}
          bind:value={userTypeSelected}
          onSubmit={onUserTypeSelectedHandler}
        />
      </div>
    </div>
    <div class="flex">
      <div class="left-div">
        <Text>注销</Text>
      </div>
      <div class="right-div right-select">
        <AdvancedSelect
          optionIdentifier="id"
          labelIdentifier="value"
          bind:value={blockFlagSelected}
          options={blockflagList}
          onSubmit={onBlockFlagSelectedHandler}
        />
      </div>
    </div>
    <div class="flex">
      <div class="left-div">
        <Text>旧密码</Text>
      </div>
      <div class="right-div modify-input">
        <Input
          type="password"
          bind:value={oldPassWord}
          on:input={onOldPswChangeHandler}
        />
      </div>
    </div>
    <div class="flex">
      <div class="left-div">
        <Text>新密码</Text>
      </div>
      <div class="right-div modify-input">
        <Input
          type="password"
          bind:value={newPassWord}
          on:input={onNewPswChangeHandler}
        />
      </div>
    </div>
    <div class="flex">
      <div class="left-div ">
        <Text>确认密码</Text>
      </div>
      <div class="right-div modify-input">
        <Input
          type="password"
          bind:value={confirmPassword}
          on:input={onConfirmPswChangeHandler}
        />
      </div>
    </div>
    <div class="flex">
      <div class="left-div ">
        <Text>IP</Text>
      </div>
      <div class="right-div modify-input ">
        <Input bind:value={ip} on:input={onIpChangeHandler} />
      </div>
    </div>
    <div class="flex figure-height">
      <div class="left-div figure-border-bottom">
        <Text>头像</Text>
      </div>
      <div class="right-div modify-input">
        <ImageUpload
          value={imageSrc}
          on:imageUpload={onImageUploadHandler}
          {isImgDisplay}
        />
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @import "../../../styles/theme/var";
  @import "../../../styles/theme/mixin";

  .btn-align-right {
    display: flex;
    justify-content: flex-end;
  }

  .flex {
    display: flex;
    flex: 1;
    height: 35px;
  }

  .left-div {
    width: 150px;
    @include themifyList("background-color", $theme-color);
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    border-bottom: 1px solid #cfcfcf;
  }

  .right-div {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0px 5px;
  }

  .modify-user {
    border: 1px solid #cfcfcf;
    margin-top: 5px;
  }

  .figure-height {
    height: 100px;
  }

  .figure-border-bottom {
    border-bottom: 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  :global(.right-select > .svelte-select) {
    min-height: 30px !important;
  }

  :global(.modify-input
      > .bx--text-input-wrapper
      > .bx--text-input__field-outer-wrapper) {
    flex-direction: column;
    justify-content: center;
  }

  :global(.user-id-disabled > div > div > div > .bx--text-input:disabled) {
    -webkit-text-fill-color: #161616;
  }
</style>
