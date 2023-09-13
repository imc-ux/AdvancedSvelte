import Label from '@/components/renderers/Label.svelte';
import Link from '@/components/renderers/Link.svelte';
import IconButton from '@/components/renderers/IconButton.svelte';
import ProgressBar from '@/components/renderers/ProgressBar.svelte';
import iconButtonRenderer from '@/components/renderers/IconButtonRenderer.svelte';
import linkRenderer from '@/components/renderers/LinkRenderer.svelte';
import labelRenderer from '@/components/renderers/LabelRenderer.svelte';
import DocumentBlank from 'carbon-icons-svelte/lib/DocumentBlank.svelte';

import { ICellRendererParams } from 'ag-grid-community';

function rendererWrapper(renderer, restProps = {}) {
  return (params: ICellRendererParams) => {
    const element = document.createElement('span');
    new renderer({
      target: element,
      props: { params, ...restProps },
    });

    return element;
  };
}

const IconButtonRenderer = rendererWrapper(iconButtonRenderer);
const ProgressBarRenderer = rendererWrapper(ProgressBar);
const LinkRenderer = rendererWrapper(linkRenderer);
const LabelRenderer = rendererWrapper(labelRenderer);

// const IconButtonRenderer = (params: ICellRendererParams) => {
//   const element = document.createElement("span");
//   new iconButtonRenderer({
//     target: element,
//     props: { currentIcon: params.data.btnIcon, params },
//   });
//   return element;
// };

// const ProgressBarRenderer = (params: ICellRendererParams) => {
//   const element = document.createElement('span');
//   const innerHTML = params.value;
//   new ProgressBar({
//     target: element,
//     props: { value: innerHTML },
//   });
//   return element;
// };

// const LinkRenderer = (params: ICellRendererParams) => {
//   const element = document.createElement('span');
//   const innerHTML = params.value;
//   new linkRenderer({
//     target: element,
//     props: { params: params, value: innerHTML },
//   });
//   return element;
// };

// const LabelRenderer = (params: ICellRendererParams) => {
//   const element = document.createElement('span');
//   const innerHTML = params.value;
//   new labelRenderer({
//     target: element,
//     props: { value: innerHTML },
//   });
//   return element;
// };

export { Label, Link, IconButton, ProgressBarRenderer, LinkRenderer, IconButtonRenderer, ProgressBar, LabelRenderer };
