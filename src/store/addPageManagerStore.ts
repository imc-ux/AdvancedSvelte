import { makeAutoObservable, flow } from "mobx";
import {
  GetUserList,
  GetUserCheckPersonList,
  GetMpPageMgmtType,
  CreateMpPageMgmtInfo,
  GetMpPageMgmtList,
  GetAllPageIds,
  GetPageIdsByType,
} from "@/action/AddPageManagerAction";

class addPageManager {
  pending = false;
  userListResult: any = null;
  userPersionResult: any = null;
  getMpPageMgmtTypeResult: any = null;
  createMpPageMgmtInfoResult: any = null;
  getMpPageMgmtListResult: any = null;
  getAllPageIdsResult: any = null;
  getPageIdsByTypeResult: any = null;

  constructor() {
    makeAutoObservable(this);
  }

  getUserList = flow(function*(params: any) {
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

  getUserCheckPersonList = flow(function*(params: string[]) {
    this.pending = true;
    try {
      const res = yield GetUserCheckPersonList(params);
      this.pending = false;
      this.userPersionResult = res;
    } catch (error) {
      this.pending = false;
      this.userPersionResult = error;
    }
  });

  getMpPageMgmtType = flow(function*() {
    this.pending = true;
    try {
      const res = yield GetMpPageMgmtType();
      this.pending = false;
      this.getMpPageMgmtTypeResult = res;
    } catch (error) {
      this.pending = false;
      this.getMpPageMgmtTypeResult = error;
    }
  });

  createMpPageMgmtInfo = flow(function*(params: any) {
    this.pending = true;
    try {
      const res = yield CreateMpPageMgmtInfo(params);
      this.pending = false;
      this.createMpPageMgmtInfoResult = res;
    } catch (error) {
      this.pending = false;
      this.createMpPageMgmtInfoResult = error;
    }
  });

  getMpPageMgmtList = flow(function*(params: any) {
    this.pending = true;
    try {
      const res = yield GetMpPageMgmtList(params);
      this.pending = false;
      this.getMpPageMgmtListResult = res;
    } catch (error) {
      this.pending = false;
      this.getMpPageMgmtListResult = error;
    }
  });

  getAllPageIds = flow(function*(params: any) {
    this.pending = true;
    try {
      const res = yield GetAllPageIds(params);
      this.pending = false;
      this.getAllPageIdsResult = res;
    } catch (error) {
      this.pending = false;
      this.getAllPageIdsResult = error;
    }
  });

  getPageIdsByType = flow(function*(params: any) {
    this.pending = true;
    try {
      const res = yield GetPageIdsByType(params);
      this.pending = false;
      this.getPageIdsByTypeResult = res;
    } catch (error) {
      this.pending = false;
      this.getPageIdsByTypeResult = error;
    }
  });
}

const AddPageManageStore = new addPageManager();
export default AddPageManageStore;
