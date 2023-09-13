import Storage, { StorageType } from "@/utils/Storage";

export const UserInfo = {
  get userId(): string {
    return Storage.getSessionItem(StorageType.UserId);
  },

  get UserName(): string {
    return Storage.getSessionItem(StorageType.UserName);
  },

  get UserPermission(): string {
    return Storage.getSessionItem(StorageType.UserPermission);
  },

  get Figure(): string {
    return Storage.getSessionItem(StorageType.Figure);
  },
};

export function getServerUrl() {
  return document.location.protocol + "//" + document.location.host + "";
}

export const JTRAC_TITLE = "V2A-";
export const JTRAC_TITLE_H5 = "H5BUG-";
export const VERSION_REGEXP =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
