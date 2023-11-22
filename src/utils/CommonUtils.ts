import moment from "moment";
import Storage, { StorageType } from "@/utils/Storage";
import { TextArea } from "@/components/sveltecomponents";

export function getCurrentTime(): string {
  return moment().format("YYYY-MM-DD HH:mm:ss");
}

export function isLogin(): boolean {
  if (Storage.getSessionItem(StorageType.UserId)) return true;
  else return false;
}

export function login(): void {
  openUrl("login.html");
}

export function bodyBatchInput(e: any, text: string) {
  let mountNodeCount = 1;
  let width = e.target.clientWidth + 2;
  let top = e.clientY - e.offsetY;
  let left = e.clientX - e.offsetX;
  let topX = top - 2;
  const mountNode = document.createElement("div");
  mountNode.className = "position-absolute";
  document.body.appendChild(mountNode);
  mountNode.style.top = topX + "px";
  mountNode.style.left = left + "px";
  mountNode.style.width = width + "px";
  new TextArea({
    target: mountNode,
    props: {
      readOnly: true,
      value: text,
      class: "root index-textArea-bottom-margin",
    },
  });
  document.addEventListener("mouseup", onWindowMouseUpListener);
  document.addEventListener("mousewheel", onWindowMouseUpListener);
  function onWindowMouseUpListener(e) {
    if (e.target.type === 'textarea' || e.target.type === 'text') {
      return;
    }
    if (mountNodeCount === 1) {
      mountNodeCount = 0;
      document.body.removeChild(mountNode);
    }
  }
}

export function setCookie(
  name: string,
  value: string,
  daysToLive?: number
): void {
  var expdate: any = new Date();
  expdate.setTime(expdate.getTime() + daysToLive * 24 * 60 * 60 * 1000); //保存的期限，毫秒计算
  document.cookie =
    name +
    "=" +
    encodeURIComponent(value) +
    ";expires=" +
    expdate.toGMTString() +
    ";path=/";
}

export function getCookie(c_name: string): string {
  if (document.cookie.length > 0) {
    // 获取对应字段在cookie字符串的位置
    var c_start: number = document.cookie.indexOf(c_name + "=");
    var c_end: number;
    if (c_start !== -1) {
      c_start = c_start + c_name.length + 1;
      c_end = document.cookie.indexOf(";", c_start);
      if (c_end === -1) c_end = document.cookie.length;
      return decodeURIComponent(document.cookie.substring(c_start, c_end));
    }
  }
  return "";
}

export function xorEncode(str: string, key: string): string {
  var crytxt = "";
  var k: number,
    keylen = key.length;
  for (var i = 0; i < str.length; i++) {
    k = i % keylen;
    crytxt += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(k));
  }
  return crytxt;
}
/**
 * 获取字符串长度 中文长度2  英文长度1
 */
export function getStringAscii(input: string): number {
  if (!input) return 0;
  var bytes = 0;
  for (var i = 0; i < input.length; i++) {
    if (input.charCodeAt(i) >= 32 && input.charCodeAt(i) <= 126) bytes++;
    else bytes += 2;
  }
  return bytes;
}

export function getStringMax(input: string, bytes: number): string {
  var result = "";
  var max = 0;
  if (input) {
    for (var i = 0; i < input.length; i++) {
      if (input.charCodeAt(i) >= 32 && input.charCodeAt(i) <= 126) max++;
      else max += 2;

      if (max > bytes) break;
      else result += input.substring(i, i + 1);
    }
  }
  return result;
}

export function getUrlPara(name: string): string {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substring(1).match(reg);
  if (r != null) return decodeURI(r[2]);
  return null;
}

export function px2number(value: string): number {
  return Number(value.substring(0, value.indexOf("px")));
}

//判断是否测试环境
export function isTestSystem(): boolean {
  return document.location.host.indexOf(":8118") === -1 ? false : true;
}

export function openUrl(url: string): void {
  window.location.href = url;
}

//构造字符型 enum
export function strEnum<T extends string>(o: Array<T>): { [K in T]: K } {
  return o.reduce((res, key) => {
    res[key] = key;
    return res;
  }, Object.create(null));
}

export function getServerUrl(): string {
  // return document.location.protocol + "//" + document.location.host + "/b2b/";
  // return location.protocol + "//127.0.0.1:7777/";
  return "http://109.14.20.45:6636/ux/";
  // return '/b2b/';
}

export function getResourceUrl(): string {
  if (DEBUG) return location.protocol + "//127.0.0.1:7777/";
  else
    return (
      document.location.protocol + "//" + document.location.host + "/upload/"
    );
}

export function getUploadRedirectUrl(): string {
  const file = "result.html";
  return "http://109.14.20.45:6636/upload/" + file;
}

export function getImagesServerUrl() {
  if (DEBUG) return "http://109.14.20.45:6636/upload/";
  else
    return (
      document.location.protocol + "//" + document.location.host + "/upload/"
    );
}

/*export function setPreHandleBars(
  templates: any,
  container: JQuery,
  data: object,
  clear: boolean = true
): void {
  if (clear) container.empty();
  container.append(templates(data));
  if (!data[0]) UNoData.showNoDataMessage(container);
}*/

//日期比较  string类型(2018-12-02, 2018-12-13)
export function compareDate(d1: string, d2: string): boolean {
  var startDate = d1.replace(/-/g, "");
  var endDate = d2.replace(/-/g, "");
  if (Number(startDate) < Number(endDate)) {
    return true;
  } else {
    return false;
  }
}

export function decodeHTML(input: string): string {
  const parser = new DOMParser();
  const dom = parser.parseFromString(
    "<!doctype html><body>" + input,
    "text/html"
  );
  return dom.body.textContent;
}

// 返回字符串的字节长度
export function getStringAsciiNew(inputStr: string) {
  if (!inputStr) return 0;
  let bytes = 0;
  for (let i = 0; i < inputStr.length; i++) {
    if (inputStr.charCodeAt(i) >= 0 && inputStr.charCodeAt(i) < 255) {
      bytes++;
    } else {
      bytes += 2;
    }
  }
  return bytes;
}

//参数arr的值分别为[r,g,b]
export function rgbToHsv(arr: number[]): number[] {
  let h = 0;
  let s = 0;
  let v = 0;
  let r = arr[0];
  let g = arr[1];
  let b = arr[2];
  arr.sort(function (a, b) {
    return a - b;
  });
  const max = arr[2];
  const min = arr[0];
  v = max / 255;
  if (max === 0) {
    s = 0;
  } else {
    s = 1 - min / max;
  }
  if (max === min) {
    h = 0; // 事实上，max===min的时候，h无论为多少都无所谓
  } else if (max === r && g >= b) {
    h = 60 * ((g - b) / (max - min)) + 0;
  } else if (max === r && g < b) {
    h = 60 * ((g - b) / (max - min)) + 360;
  } else if (max === g) {
    h = 60 * ((b - r) / (max - min)) + 120;
  } else if (max === b) {
    h = 60 * ((r - g) / (max - min)) + 240;
  }
  h = parseInt(String(h));
  s = parseInt(String(s * 100));
  v = parseInt(String(v * 100));
  return [h, s, v];
}

//参数arr的3个值分别对应[h, s, v]
export function hsvToRgb(arr: number[]): number[] {
  let h = arr[0];
  let s = arr[1];
  let v = arr[2];
  s = s / 100;
  v = v / 100;
  let r = 0;
  let g = 0;
  let b = 0;
  let i = parseInt(String((h / 60) % 6));
  let f = h / 60 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
    default:
      break;
  }
  r = parseInt(String(r * 255.0));
  g = parseInt(String(g * 255.0));
  b = parseInt(String(b * 255.0));
  return [r, g, b];
}

// 深拷贝
export function deepClone(data: any): any {
  return JSON.parse(JSON.stringify(data));
}

//复制文字到粘贴板
export function copyToClipboard(text: string | number) {
  const _window: any = window;
  if (_window.clipboardData && _window.clipboardData.setData) {
    return _window.clipboardData.setData("Text", text);
  } else if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text.toString());
  }
}

export function createData(cellData: any, datafiled: string[]) {
  const result = {};
  datafiled.forEach((v, index) => {
    Object.defineProperty(result, index, {
      get() {
        return cellData[v];
      },
    });
  });
  return result;
}
