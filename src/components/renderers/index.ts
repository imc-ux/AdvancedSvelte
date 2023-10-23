import Label from '@/components/renderers/Label.svelte';
import Link from '@/components/renderers/Link.svelte';
import checkRenderer from '@/components/renderers/checkRenderer.svelte';
import IconButton from '@/components/renderers/IconButton.svelte';
import ProgressBar from '@/components/renderers/ProgressBar.svelte';
import iconButtonRenderer from '@/components/renderers/IconButtonRenderer.svelte';
import linkRenderer from '@/components/renderers/LinkRenderer.svelte';
import labelRenderer from '@/components/renderers/LabelRenderer.svelte';
import selectRenderer from '@/components/renderers/SelectRenderer.svelte';
import imageUploadRenderer from '@/components/renderers/ImageUploadRenderer.svelte';
import linkButton_LabelRenderer from '@/components/renderers/LinkButton_Label.svelte';
import label_labelRenderer from '@/components/renderers/Label_Label.svelte';
import iconButton_labelRenderer from '@/components/renderers/IconButton_Label.svelte';
import linkButton_linkButton from '@/components/renderers/LinkButton_LinkButton.svelte';
import label_Input from '@/components/renderers/Lable_Input.svelte';
import image from '@/components/renderers/Image.svelte';
import linkButtonButtonBatchInput_label from '@/components/renderers/LinkButtonButtonBatchInput_Label.svelte';
import linkButtonButtonBatchInput_linkButtonButtonBatchInput from '@/components/renderers/LinkButtonButtonBatchInput_LinkButtonButtonBatchInput.svelte';
import iconButton_labelBatchInput from '@/components/renderers/IconButton_LabelBatchInput.svelte';
import label_linkButtonButtonBatchInput from '@/components/renderers/Label_LinkButtonButtonBatchInput.svelte';
import linkButtonOrLabel_labelBatchInput from '@/components/renderers/LinkButtonOrLabel_LabelBatchInput.svelte';

import { ICellRendererParams } from 'ag-grid-community';

function rendererWrapper(renderer, restProps = {}) {
  return (params: ICellRendererParams) => {
    const element = document.createElement('span');
    element.style.width = '100%';
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
const CheckRenderer = rendererWrapper(checkRenderer);
const SelectRenderer = rendererWrapper(selectRenderer);
const ImageUploadRenderer = rendererWrapper(imageUploadRenderer);
const LinkButton_Label = rendererWrapper(linkButton_LabelRenderer);
const Label_Label = rendererWrapper(label_labelRenderer);
const IconButton_Label = rendererWrapper(iconButton_labelRenderer);
const Lable_Input = rendererWrapper(label_Input);
const LinkButtonButtonBatchInput_Label = rendererWrapper(linkButtonButtonBatchInput_label);
const Image = rendererWrapper(image);
const LinkButtonButtonBatchInput_LinkButtonButtonBatchInput = rendererWrapper(linkButtonButtonBatchInput_linkButtonButtonBatchInput);
const IconButton_LabelBatchInput = rendererWrapper(iconButton_labelBatchInput);
const Label_LinkButtonButtonBatchInput = rendererWrapper(label_linkButtonButtonBatchInput);
const LinkButtonOrLabel_LabelBatchInput = rendererWrapper(linkButtonOrLabel_labelBatchInput);
const LinkButton_LinkButton = rendererWrapper(linkButton_linkButton);

export {
  Label,
  Link,
  IconButton,
  ProgressBarRenderer,
  LinkRenderer,
  IconButtonRenderer,
  ProgressBar,
  LabelRenderer,
  CheckRenderer,
  SelectRenderer,
  ImageUploadRenderer,
  LinkButton_Label,
  Label_Label,
  IconButton_Label,
  Lable_Input,
  LinkButtonButtonBatchInput_Label,
  Image,
  LinkButton_LinkButton,
  LinkButtonButtonBatchInput_LinkButtonButtonBatchInput,
  IconButton_LabelBatchInput,
  Label_LinkButtonButtonBatchInput,
  LinkButtonOrLabel_LabelBatchInput,
};
