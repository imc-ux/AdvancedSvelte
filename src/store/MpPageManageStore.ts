import { makeAutoObservable, flow } from 'mobx';
import { GetUserList, GetMpPageMgmtType, GetMpPageMgmtList } from '@/action/MpPageManageAction';
import { UsersInfo } from '@/vo/userManager/index';

class MpPageManager {
  pending = false;
  userListResult: any = null;
  getMpPageMgmtTypeResult: any = null;
  getMpPageMgmtListResult: any = null;

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
}

const MpPageManageStore = new MpPageManager();
export default MpPageManageStore;
