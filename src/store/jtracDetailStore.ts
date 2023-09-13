import { makeAutoObservable, flow } from "mobx";
import {
  GetUserList,
  GetUserCheckPersonList,
  SearchUniqJtracList,
  ReadJtrac,
  GetMpPageMgmtList,
} from "@/action/jtracDetailAction";

class jtracDetail {
  pending = false;
  userListResult: any = null;
  userPersionResult: any = null;
  searchJtracResult: any = null;
  readJtracResult: any = null;
  getMpPageMgmtListResult: any = null;

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

  searchUniqJtracList = flow(function*(params: any) {
    this.pending = true;
    try {
      const res = yield SearchUniqJtracList(params);
      this.pending = false;
      this.searchJtracResult = res;
    } catch (error) {
      this.pending = false;
      this.searchJtracResult = error;
    }
  });

  readJtrac = flow(function*(params: any) {
    this.pending = true;
    try {
      const res = yield ReadJtrac(params);
      this.pending = false;
      this.readJtracResult = res;
    } catch (error) {
      this.pending = false;
      this.readJtracResult = error;
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
}

const jtracDetailStore = new jtracDetail();
export default jtracDetailStore;
