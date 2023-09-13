<script lang="ts">
  import {
    getImagesServerUrl,
    getServerUrl,
    getUploadRedirectUrl,
    decodeHTML,
  } from "@/utils/CommonUtils";
  import { UserInfo } from "@/utils/Settings";
  import { createEventDispatcher } from "svelte";
  import FolderParent from "carbon-icons-svelte/lib/FolderParent.svelte";
  import Link from "@/components/sveltecomponents/Link.svelte";

  export let value: string = "";
  const randomId = Math.random().toString();
  let uploadForm = "upload-form" + randomId;
  let inputFile = "upload-file" + randomId;
  let inputRedirect = "upload-redirect" + randomId;
  let inputId = "upload-id" + randomId;
  let uploadFrame = "upload-frame" + randomId;
  let imageId = "image-id" + randomId;
  let changeForm: boolean = false;
  const dispatch = createEventDispatcher();
  export let isImgDisplay: boolean = true;

  function onImageUploadHandler() {
    document.getElementById(inputFile).click();
  }

  function onImageChangeHandler(e) {
    changeForm = true;
    document
      .getElementById(uploadForm)
      .setAttribute("action", getServerUrl() + "upload-file");
    document
      .getElementById(inputRedirect)
      .setAttribute("value", getUploadRedirectUrl());
    document.getElementById(inputId).setAttribute("value", UserInfo.userId);
    (document.getElementById(uploadForm) as HTMLFormElement).submit();
  }

  function onImageLoadHandler(e) {
    if (!changeForm) {
      return;
    } else {
      const element = document.getElementById(uploadFrame) as HTMLIFrameElement;
      const remoteImagePath = decodeHTML(
        element.contentWindow.document.querySelector("body").innerHTML.trim()
      );
      value = getImagesServerUrl() + remoteImagePath;
      dispatch("imageUpload", { value: value, path: remoteImagePath });
    }
  }
</script>

{#if value && isImgDisplay}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <img
    id={imageId}
    src={value}
    alt=""
    on:click={onImageUploadHandler}
    class="image-size" />
{:else}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div on:click={onImageUploadHandler} class="upload-icon">
    <Link icon={FolderParent} />
  </div>
{/if}

<form
  id={uploadForm}
  target={uploadFrame}
  method="post"
  enctype="multipart/form-data"
  style="display:none">
  <input
    id={inputFile}
    type="file"
    name="file"
    on:change={onImageChangeHandler} />
  <input id={inputRedirect} type="hidden" name="redirect" />
  <input id={inputId} type="hidden" name="id" />
</form>
<iframe
  id={uploadFrame}
  name={uploadFrame}
  style="display:none"
  src="javascript:false;"
  title=""
  on:load={onImageLoadHandler} />

<style>
  .image-size {
    width: 95px;
    height: 95px;
    object-fit: fill;
    cursor: pointer;
    border: 1px solid #cacaca;
  }

  .upload-icon {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 95px;
    height: 95px;
    border: 1px solid #cacaca;
    cursor: pointer;
  }

  :global(.upload-icon > a) {
    display: contents;
  }

  :global(.upload-icon > a > .bx--link__icon) {
    margin-left: 0px;
  }

  :global(.upload-icon > a > .bx--link__icon > svg) {
    height: 40px;
    width: 40px;
  }
</style>
