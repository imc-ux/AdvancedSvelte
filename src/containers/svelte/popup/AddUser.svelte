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
  import { userTypeList } from "@/constant/constant";
  import CustomAlert, { AlertIcon } from "@/components/CustomAlert";
  import { AddUserAlert } from "@/constant/alert/user";
  import addUserStore from "@/store/AddUserStore";
  import { autorun } from "mobx";
  import { deepClone } from "@/utils/CommonUtils";
  import { removeWaiting, setWaiting } from "@/utils/loaderUtils";
  import { Md5 } from "ts-md5";
  import { UsersInfo } from "@/vo/userManager";
  import { ImageUpload } from "@/components/sveltecomponents/index";

  export let onClose;
  let passWord: string;
  let confirmPassword: string;
  let id: string;
  let name: string;
  let userTypeCodeSelected;
  let userTypeSelected;
  let ip: string = "";
  let usertypeList = userTypeList.slice(1);
  usertypeList.unshift({ id: "", value: "--请选择--" });
  let imageSrc: string = "";
  let figure: string;
  let isUpload: boolean = false;

  onMount(() => {
    userTypeCodeSelected = "";
    userTypeSelected = usertypeList[0];
  });

  onDestroy(() => {
    addUser();
  });

  const addUser = autorun(() => {
    if (addUserStore.addUserResult) {
      const addUser = deepClone(addUserStore.addUserResult);
      addUserStore.addUserResult = null;
      removeWaiting();
      if (!addUser.error) {
        CustomAlert(AddUserAlert.SAVE_SUCCESS, AlertIcon.SUCCESS);
        onClose("Y");
      } else {
        CustomAlert(AddUserAlert.INTERNET_ERROR, AlertIcon.ERROR);
        onClose("Y");
      }
    }
  });

  function onIdChangeHandler(event: CustomEvent) {
    id = event.detail.data;
  }

  function onNameChangeHandler(event: CustomEvent) {
    name = event.detail.data;
  }

  function onUserTypeSelectedHandler(e: any) {
    userTypeCodeSelected = e.id;
    userTypeSelected = e;
  }

  function onPswChangeHandler(event: CustomEvent) {
    passWord = event.detail.data;
  }

  function onConfirmPswChangeHandler(event: CustomEvent) {
    confirmPassword = event.detail.data;
  }

  function onIpChangeHandler(event: CustomEvent) {
    ip = event.detail.data;
  }

  function onSaveBtnClickHandler() {
    if (!validate()) {
      return;
    }
    const info: UsersInfo = {};
    info.id = id;
    info.name = name;
    info.password = Md5.hashStr(passWord?.trim()).toLocaleUpperCase();
    info.usertype = userTypeCodeSelected;
    info.blockflag = "N";
    info.ip = ip;
    if (isUpload) {
      info.figure = figure;
    }
    setWaiting();
    addUserStore.addUser(info);
  }

  function validate() {
    if (id?.trim() === "") {
      CustomAlert(AddUserAlert.ID_IS_NOT_NULL, AlertIcon.ERROR);
      return false;
    }
    if (name?.trim() === "") {
      CustomAlert(AddUserAlert.NAME_IS_NOT_NULL, AlertIcon.ERROR);
      return false;
    }
    if (!userTypeCodeSelected) {
      CustomAlert(AddUserAlert.USER_TYPE_IS_NOT_NULL, AlertIcon.ERROR);
      return false;
    }
    if (userTypeCodeSelected?.trim() === "U") {
      if (passWord?.trim() === "") {
        CustomAlert(AddUserAlert.FRON_USER_PSW_IS_NOT_NULL, AlertIcon.ERROR);
        return false;
      }
    }
    if (passWord?.trim() !== confirmPassword?.trim()) {
      CustomAlert(
        AddUserAlert.THE_TWO_PSW_INPUT_ARE_INCONSISTENT,
        AlertIcon.ERROR
      );
      return false;
    }
    return true;
  }

  function onImageUploadHandler(e: any) {
    isUpload = true;
    imageSrc = e.detail.value;

    figure = e.detail.path;
  }
</script>

<div>
  <div class="btn-align-right">
    <Button
      class="button-normal button-text-vertical-align"
      size="small"
      kind="tertiary"
      icon={Save}
      on:click={onSaveBtnClickHandler}>保存</Button
    >
  </div>
  <div class="add-user">
    <div class="flex">
      <div class="left-div">
        <Text>ID</Text>
      </div>
      <div class="right-div add-input">
        <Input bind:value={id} id="user-id" on:input={onIdChangeHandler} />
      </div>
    </div>
    <div class="flex">
      <div class="left-div">
        <Text>姓名</Text>
      </div>
      <div class="right-div add-input">
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
        <Text>密码</Text>
      </div>
      <div class="right-div add-input">
        <Input
          type="password"
          bind:value={passWord}
          on:input={onPswChangeHandler}
        />
      </div>
    </div>

    <div class="flex">
      <div class="left-div ">
        <Text>确认密码</Text>
      </div>
      <div class="right-div add-input">
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
      <div class="right-div add-input">
        <Input bind:value={ip} on:input={onIpChangeHandler} />
      </div>
    </div>
    <div class="flex figure-height">
      <div class="left-div figure-border-bottom">
        <Text>头像</Text>
      </div>
      <div class="right-div add-input">
        <ImageUpload value={imageSrc} on:imageUpload={onImageUploadHandler} />
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .btn-align-right {
    display: flex;
    justify-content: flex-end;
  }

  .flex {
    display: flex;
    flex: 1;
    height: 35px;
  } 

  .right-div {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0px 5px;
  }

  .add-user {
    border: 1px solid #cfcfcf;
    margin-top: 5px;
  }

  .figure-border-bottom {
    border-bottom: 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .figure-height {
    height: 100px;
  }

  :global(.right-select > .svelte-select) {
    min-height: 30px !important;
  }

  :global(.add-input
      > .bx--text-input-wrapper
      > .bx--text-input__field-outer-wrapper) {
    flex-direction: column;
    justify-content: center;
  }
</style>
