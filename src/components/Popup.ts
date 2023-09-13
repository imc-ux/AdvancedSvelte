import Popup from '@/components/sveltecomponents/Popup.svelte';
import { removeWaiting } from '@/utils/loaderUtils';

export function CreatePop(text: string, node: any, params?: any, onClose?: any, size?: any) {
  const mountNode = document.createElement('div');
  document.body.appendChild(mountNode);

  const app = new Popup({
    target: mountNode,
    props: {
      title: text,
      mountNode: node,
      params: params,
      onClose: onClose,
      size: size,
      remove() {
        document.body.removeChild(mountNode);
        document.body.classList.remove('bx--body--with-modal-open');
        removeWaiting();
      },
    },
  });
  return app;
}

export default Popup;
