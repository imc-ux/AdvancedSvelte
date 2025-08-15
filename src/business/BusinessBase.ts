import { PrefixRestURL } from "@/constant/Service";
import { CommonAlert } from "@/constant/alert/Base";
import { getServerUrl } from "@/utils/CommonUtils";
/**
 * Restful接口远程调用
 * @param method 方法名
 * @param parameters 参数（可以为任意类型:对象、字符串...）
 *
 */
export function callRestfulService(
  method: string,
  parameters?: any,
  mark?: string
): Promise<UJsonRespond<any>> {
  const xhr: XMLHttpRequest = new XMLHttpRequest();
  let temp = "&_=" + new Date().getTime();
  if (method === "readJtrac") {
    xhr.open(
      "GET",
      getServerUrl() + method + "?jtracNo=" + parameters + temp,
      true
    );
  } else {
    let request = parameters ? parameters : "";
    const param =
      typeof request === "string" ? request : JSON.stringify(request);
    xhr.open(
      "GET",
      getServerUrl() +
      method +
      PrefixRestURL +
      encodeURIComponent(encodeURIComponent(param)) +
      temp,
      true
    );
  }
  xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  xhr.send(null);

  return new Promise(function (resolve, reject) {
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        resolve({ ...JSON.parse(xhr.responseText), mark });
      } else if (
        xhr.readyState === XMLHttpRequest.DONE &&
        (xhr.status === 500 || xhr.status === 503)
      ) {
        reject({ error: true, msg: xhr.responseText, mark });
      }
    };
    xhr.onerror = () => {
      reject({ error: true, msg: CommonAlert.INTERNET_ERROR, mark });
    };
  });
}
