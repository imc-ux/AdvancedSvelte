const CLASSNAME_VIEW_GONE = 'display-none';
const CLASSNAME_BODY_WAITING = 'waiting';

const shadow = document.querySelector('.iux-waiting-shadow');
const waiting = document.querySelector('.iux-waiting-img');
const body = document.querySelector('body');

export function removeWaiting() {
  setTimeout(() => {
    shadow?.classList?.add(CLASSNAME_VIEW_GONE);
    waiting?.classList?.add(CLASSNAME_VIEW_GONE);
    body?.classList?.remove(CLASSNAME_BODY_WAITING);
  }, 0);
}

export function setWaiting() {
  setTimeout(() => {
    shadow.classList.remove(CLASSNAME_VIEW_GONE);
    waiting.classList.remove(CLASSNAME_VIEW_GONE);
    body.classList.add(CLASSNAME_BODY_WAITING);
  }, 0);
}

export function removeShadow() {
  setTimeout(() => {
    shadow.classList.add(CLASSNAME_VIEW_GONE);
  }, 0);
}

export function setShadow() {
  setTimeout(() => {
    shadow.classList.remove(CLASSNAME_VIEW_GONE);
  }, 0);
}
