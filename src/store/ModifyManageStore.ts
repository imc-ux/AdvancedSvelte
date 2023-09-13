import { makeAutoObservable, flow } from 'mobx';
import {
  GetUserList,
  GetUserCheckPersonList,
  GetMpPageMgmtType,
  GetMpPageMgmtList,
  UpdateMpPageInfo,
  GetPageIdsByType,
  GetJtracNosByPageId,
} from '@/action/ModifyPageManageAction';

class modifyPageManager {
  pending = false;
  userListResult: any = null;
  userPersionResult: any = null;
  getMpPageMgmtTypeResult: any = null;
  getMpPageMgmtListResult: any = null;
  updateMpPageInfoResult: any = null;
  getPageIdsByTypeResult: any = null;
  getJtracsByPageIdResult: any = null;

  constructor() {
    makeAutoObservable(this);
  }

  getUserList = flow(function* (params: any) {
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

  getUserCheckPersonList = flow(function* (params: string[]) {
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

  getMpPageMgmtType = flow(function* () {
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

  getMpPageMgmtList = flow(function* (params: any) {
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

  updateMpPageInfo = flow(function* (params: any) {
    this.pending = true;
    try {
      const res = yield UpdateMpPageInfo(params);
      this.pending = false;
      this.updateMpPageInfoResult = res;
    } catch (error) {
      this.pending = false;
      this.updateMpPageInfoResult = error;
    }
  });

  getPageIdsByType = flow(function* (params: any) {
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

  getJtracsByPageId = flow(function* (params: string) {
    this.pending = true;
    try {
      const res = yield GetJtracNosByPageId(params);
      this.pending = false;
      this.getJtracsByPageIdResult = res;
    } catch (error) {
      this.pending = false;
      this.getJtracsByPageIdResult = error;
    }
  });
}

const modifyPageManageStore = new modifyPageManager();
export default modifyPageManageStore;
