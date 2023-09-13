import Alert from '@/components/sveltecomponents/Alert.svelte';

export enum AlertIcon {
  SUCCESS,
  WARNING,
  PROMPT,
  ERROR,
}

export function CustomAlert(text: string, icon: number = AlertIcon.WARNING, onClose?: any) {
  const mountNode = document.createElement('div');
  document.body.appendChild(mountNode);

  const app = new Alert({
    target: mountNode,
    props: {
      text: text,
      icon: icon,
      onClose: onClose,
      remove() {
        document.body.removeChild(mountNode);
        document.body.classList.remove('bx--body--with-modal-open');
      },
    },
  });
  return app;
}

export default CustomAlert;
