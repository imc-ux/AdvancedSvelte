import { makeAutoObservable, flow } from 'mobx';
import {
  GetUserList,
  GetUserCheckPersonList,
  GetUserPermission,
  UpdateJtracInfo,
  UpdateMultJtracStatus,
  GetUserActivePermission,
} from '@/action/filelistAction';

class filelistManager {
  pending = false;
  getUserListResult: any = null;
  getUserCheckPersonListResult: any = null;
  getUserPermissionResult: any = null;
  updateJtracInfoResult: any = null;
  updateMultJtracStatusResult: any = null;
  getUserActivePermissionResult: any = null;

  constructor() {
    makeAutoObservable(this);
  }

  getUserList = flow(function* (params: any) {
    this.pending = true;
    try {
      const res = yield GetUserList(params);
      this.pending = false;
      this.getUserListResult = res;
    } catch (error) {
      this.pending = false;
      this.getUserListResult = error;
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

  updateJtracInfo = flow(function* (params: any) {
    this.pending = true;
    try {
      const res = yield UpdateJtracInfo(params);
      this.pending = false;
      this.updateJtracInfoResult = res;
    } catch (error) {
      this.pending = false;
      this.updateJtracInfoResult = error;
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

const filelistStore = new filelistManager();
export default filelistStore;
