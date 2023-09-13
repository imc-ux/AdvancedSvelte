import { makeAutoObservable, flow } from 'mobx';
import { ReadJtrac } from '@/action/conflictdetailAction';

class conflictdetailManager {
  pending = false;
  readJtracResult: any = null;

  constructor() {
    makeAutoObservable(this);
  }

  readJtrac = flow(function* (params: any) {
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
}

const conflictdetailStore = new conflictdetailManager();
export default conflictdetailStore;
