<!-- 
/**
* Summary: Image控件
* Created: 2022/04/26
* Author1: lixiaozheng
* Author2:
*/
-->
<script>
  import { ImageLoader } from 'carbon-components-svelte';
  import { getImagesServerUrl } from '@/utils/CommonUtils';
  import noneImg from '../../../static/uploadsys/images/common/photoNone.png';

  export let src = '';
  export let alt = '';

  $: showSrc = src && src.trim() ? (src.includes('base64') ? src : getImagesServerUrl() + src) : noneImg;
</script>

<ImageLoader src={showSrc} {alt} loaded {...$$restProps} />
