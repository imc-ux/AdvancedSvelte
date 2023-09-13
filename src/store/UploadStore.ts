import { makeAutoObservable, flow } from "mobx";
import {
  GetUserList,
  GetUserPermission,
  SearchUniqJtracList,
  UpdateMultJtracStatus,
  DeleteJtracInfo,
} from "@/action/UploadAction";
import { UsersInfo } from "@/vo/userManager/index";

class UploadManager {
  pending = false;
  userListResult: any = null;
  getUserPermissionResult: any = null;
  searchUniqJtracListResult: any = null;
  updateMultJtracStatusResult: any = null;
  deleteJtracInfoResult: any = null;

  constructor() {
    makeAutoObservable(this);
  }

  getUserList = flow(function* (params: UsersInfo) {
    this.pending = true;
    try {
      const res = yield GetUserList(params);
      this.pending = false;
      this.userListResult = res;
    } catch (error) {
      this.pending = false;
      this.userListResult = error;
    }
  });

  getUserPermission = flow(function* (params: any) {
    this.pending = true;
    try {
      const res = yield GetUserPermission(params);
      this.pending = false;
      this.getUserPermissionResult = res;
    } catch (error) {
      this.pending = false;
      this.getUserPermissionResult = error;
    }
  });

  searchUniqJtracList = flow(function* (params: any) {
    this.pending = true;
    try {
      const res = yield SearchUniqJtracList(params);
      this.pending = false;
      this.searchUniqJtracListResult = res;
    } catch (error) {
      this.pending = false;
      this.searchUniqJtracListResult = error;
    }
  });

  updateMultJtracStatus = flow(function* (params: any) {
    this.pending = true;
    try {
      const res = yield UpdateMultJtracStatus(params);
      this.pending = false;
      this.updateMultJtracStatusResult = res;
    } catch (error) {
      this.pending = false;
      this.updateMultJtracStatusResult = error;
    }
  });

  deleteJtracInfo = flow(function* (params: any) {
    this.pending = true;
    try {
      const res = yield DeleteJtracInfo(params);
      this.pending = false;
      this.deleteJtracInfoResult = res;
    } catch (error) {
      this.pending = false;
      this.deleteJtracInfoResult = error;
    }
  });
}

const UploadStore = new UploadManager();
export default UploadStore;
