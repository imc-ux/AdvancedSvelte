<script lang="ts">
  import {
    getImagesServerUrl,
    getServerUrl,
    getUploadRedirectUrl,
    decodeHTML,
  } from "@/utils/CommonUtils";
  import RENDERER_EVENT from "@/constant/Renderer";
  import { UserInfo } from "@/utils/Settings";

  export let params;
  export let value: string = getImagesServerUrl() + params.value;
  const randomId = Math.random().toString();
  let uploadForm = "upload-form" + randomId;
  let inputFile = "upload-file" + randomId;
  let inputRedirect = "upload-redirect" + randomId;
  let inputId = "upload-id" + randomId;
  let uploadFrame = "upload-frame" + randomId;
  let imageId = "image-id" + randomId;
  let changeForm: boolean = false;

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
      const event = {
        type: RENDERER_EVENT.Renderer_Image_Upload,
        value: remoteImagePath,
        detail: params,
      };
      params.api.dispatchEvent(event);
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-missing-attribute -->
<img
  id={imageId}
  src={value}
  on:click={onImageUploadHandler}
  class="image-size" />
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
  :global(.image-size) {
    width: 30px;
    height: 30px;
    object-fit: scale-down;
  }
</style>
