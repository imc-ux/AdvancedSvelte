import { makeAutoObservable, flow } from 'mobx';
import { AddUser } from '@/action/addUserAction';
import { UsersInfo } from '@/vo/userManager';

class addUser {
  pending = false;
  addUserResult = null;

  constructor() {
    makeAutoObservable(this);
  }

  addUser = flow(function* (params: UsersInfo) {
    const res = yield AddUser(params);
    try {
      this.pending = true;
      this.addUserResult = res;
    } catch (error) {
      this.pending = false;
      this.addUserResult = error;
    }
  });
}

const addUserStore = new addUser();
export default addUserStore;
