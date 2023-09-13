import { makeAutoObservable, flow } from 'mobx';
import {
  GetUserList,
  GetUserCheckPersonList,
  GetMpPageMgmtType,
  GetMpPageMgmtList,
  UpdateMpPageInfo,
  GetPageIdsByType,
  GetJtracNosByPageId,
} from '@/action/PageModifyManageAction';

class papeModifyManager {
  pending = false;
  userListResult: any = null;
  userPersionResult: any = null;
  getMpPageMgmtTypeResult: any = null;
  getMpPageMgmtListResult: any = null;
  updateMpPageInfoResult: any = null;
  getPageIdsByTypeResult: any = null;
  getJtracNosByPageIdResult: any = null;

  constructor() {
    makeAutoObservable(this);
  }

  getUserList = flow(function* (params: any, mark: any) {
    this.pending = true;
    try {
      const res = yield GetUserList(params, mark);
      this.pending = false;
      this.userListResult = res;
    } catch (error) {
      this.pending = false;
      this.userListResult = error;
    }
  });

  getUserCheckPersonList = flow(function* (params: string[], mark: any) {
    this.pending = true;
    try {
      const res = yield GetUserCheckPersonList(params, mark);
      this.pending = false;
      this.userPersionResult = res;
    } catch (error) {
      this.pending = false;
      this.userPersionResult = error;
    }
  });

  getMpPageMgmtType = flow(function* (mark: any) {
    this.pending = true;
    try {
      const res = yield GetMpPageMgmtType(mark);
      this.pending = false;
      this.getMpPageMgmtTypeResult = res;
    } catch (error) {
      this.pending = false;
      this.getMpPageMgmtTypeResult = error;
    }
  });

  getMpPageMgmtList = flow(function* (params: any, mark: any) {
    this.pending = true;
    try {
      const res = yield GetMpPageMgmtList(params, mark);
      this.pending = false;
      this.getMpPageMgmtListResult = res;
    } catch (error) {
      this.pending = false;
      this.getMpPageMgmtListResult = error;
    }
  });

  updateMpPageInfo = flow(function* (params: any, mark: any) {
    this.pending = true;
    try {
      const res = yield UpdateMpPageInfo(params, mark);
      this.pending = false;
      this.updateMpPageInfoResult = res;
    } catch (error) {
      this.pending = false;
      this.updateMpPageInfoResult = error;
    }
  });

  getPageIdsByType = flow(function* (params: any, mark: any) {
    this.pending = true;
    try {
      const res = yield GetPageIdsByType(params, mark);
      this.pending = false;
      this.getPageIdsByTypeResult = res;
    } catch (error) {
      this.pending = false;
      this.getPageIdsByTypeResult = error;
    }
  });

  getJtracNosByPageId = flow(function* (params: any, mark: any) {
    this.pending = true;
    try {
      const res = yield GetJtracNosByPageId(params, mark);
      this.pending = false;
      this.getJtracNosByPageIdResult = res;
    } catch (error) {
      this.pending = false;
      this.getJtracNosByPageIdResult = error;
    }
  });
}

const pageModifyManageStore = new papeModifyManager();
export default pageModifyManageStore;
