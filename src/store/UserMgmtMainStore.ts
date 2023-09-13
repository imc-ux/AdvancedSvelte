import { flow, makeAutoObservable } from 'mobx';
import { GetUserPermission, GetUserList, ModifyUserMulti, GetUserActivePermission } from '@/action/UserMgmtMainAction';
import { PermissionInfo, UsersInfo } from '@/vo/userManager';

class UserMgmt {
  pending = false;
  userPermissionResult = null;
  userListResult = null;
  modifyUserMultiResult = null;
  getUserActivePermissionResult = null;

  constructor() {
    makeAutoObservable(this);
  }

  getUserPermission = flow(function* (info: PermissionInfo) {
    this.pending = true;
    try {
      const res = yield GetUserPermission(info);
      this.pending = false;
      this.userPermissionResult = res;
    } catch (error) {
      this.pending = false;
      this.userPermissionResult = error;
    }
  });

  getUserList = flow(function* (info: UsersInfo) {
    this.pending = true;
    try {
      const res = yield GetUserList(info);
      this.pending = false;
      this.userListResult = res;
    } catch (error) {
      this.pending = false;
      this.userListResult = error;
    }
  });

  modifyUserMulti = flow(function* (info: any[] | null) {
    this.pending = true;
    try {
      const res = yield ModifyUserMulti(info);
      this.pending = false;
      this.modifyUserMultiResult = res;
    } catch (error) {
      this.pending = false;
      this.modifyUserMultiResult = error;
    }
  });

  getUserActivePermission = flow(function* (info: string) {
    this.pending = true;
    try {
      const res = yield GetUserActivePermission(info);
      this.pending = false;
      this.getUserActivePermissionResult = res;
    } catch (error) {
      this.pending = false;
      this.getUserActivePermissionResult = error;
    }
  });
}

const userMgmtMainStore = new UserMgmt();
export default userMgmtMainStore;
