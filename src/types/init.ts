declare var DEBUG: boolean;

declare interface UJsonRespond<T = any> {
  data: T;
  error: boolean;
  msg: string;
  method?: string;
}

declare interface UPoint {
  x: number;
  y: number;
}

declare interface UMethod {
  server?: string;
  method?: string;
}

interface Event {
  touches?: Array<Event>;
  changedTouches?: Array<Event>;
  clipboardData?: any;
  pageX?: number;
  pageY?: number;
}

interface Window {
  clipboardData?: any;
}

interface Element {
  offsetWidth?: number;
  selectionStart?: number;
  selectionEnd?: number;
  value?: any;
}

interface JQuery {
  [index: string]: any;
  css(propertyName: string): string;
  css(propertyName: string, value: string | number): JQuery;
  css(
    propertyName: string,
    value: (index: number, value: string) => string | number
  ): JQuery;
  css(properties: object): JQuery;
}
