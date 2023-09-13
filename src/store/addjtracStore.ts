import { makeAutoObservable, flow } from 'mobx';
import { GetUserList, AddJtracInfo, GetUserCheckPersonList, SearchJtracVersion } from '@/action/addjtracAction';
import { UsersInfo } from '@/vo/userManager/index';

class addjtracManager {
  pending = false;
  userListResult: any = null;
  addJtracInfoResult: any = null;
  getUserCheckPersonListResult: any = null;
  searchJtracVersionResult: any = null;

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

  addJtracInfo = flow(function* (params: any) {
    this.pending = true;
    try {
      const res = yield AddJtracInfo(params);
      this.pending = false;
      this.addJtracInfoResult = res;
    } catch (error) {
      this.pending = false;
      this.addJtracInfoResult = error;
    }
  });

  getUserCheckPersonList = flow(function* (params: any) {
    this.pending = true;
    try {
      const res = yield GetUserCheckPersonList(params);
      this.pending = false;
      this.getUserCheckPersonListResult = res;
    } catch (error) {
      this.pending = false;
      this.getUserCheckPersonListResult = error;
    }
  });

  searchJtracVersion = flow(function* (params: any) {
    this.pending = true;
    try {
      const res = yield SearchJtracVersion(params);
      this.pending = false;
      this.searchJtracVersionResult = res;
    } catch (error) {
      this.pending = false;
      this.searchJtracVersionResult = error;
    }
  });
}

const addjtracStore = new addjtracManager();
export default addjtracStore;
