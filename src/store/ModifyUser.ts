import { makeAutoObservable, flow } from 'mobx';
import { ModifyUser, GetUserActivePermission } from '@/action/ModifyUser';

class MofifyUserInfo {
  pending = false;
  modifyUserResult = null;
  getUserActivePermissionResult = null;

  constructor() {
    makeAutoObservable(this);
  }

  modifyUser = flow(function* (params: any) {
    this.pending = true;
    try {
      const res = yield ModifyUser(params);
      this.pending = false;
      this.modifyUserResult = res;
    } catch (error) {
      this.pending = false;
      this.modifyUserResult = error;
    }
  });

  getUserActivePermission = flow(function* (params: string) {
    this.pending = true;
    try {
      const res = yield GetUserActivePermission(params);
      this.pending = false;
      this.getUserActivePermissionResult = res;
    } catch (error) {
      this.pending = false;
      this.getUserActivePermissionResult = error;
    }
  });
}

const modifyUserStore = new MofifyUserInfo();
export default modifyUserStore;
