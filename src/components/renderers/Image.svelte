<script lang="ts">
  import { getImagesServerUrl } from '@/utils/CommonUtils';
  
  export let params;
  export let value: string = getImagesServerUrl() + params.value;
  let isImgDisplay = params.data.display;
</script>

{#if isImgDisplay}
  <img src={value} alt="" class="image-size" />
{/if}

<style>
  :global(.image-size) {
    width: 40px;
    height: 40px;
    object-fit: scale-down;
  }
</style>
