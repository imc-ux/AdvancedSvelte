import { makeAutoObservable, flow } from 'mobx';
import { SearchJtracList, DeleteJtracInfo } from '@/action/jtraclistAction';

class jtraclistManager {
  pending = false;
  searchJtracListResult: any = null;
  deleteJtracInfoResult: any = null;

  constructor() {
    makeAutoObservable(this);
  }

  searchJtracList = flow(function* (params: any) {
    this.pending = true;
    try {
      const res = yield SearchJtracList(params);
      this.pending = false;
      this.searchJtracListResult = res;
    } catch (error) {
      this.pending = false;
      this.searchJtracListResult = error;
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

const jtraclistStore = new jtraclistManager();
export default jtraclistStore;
