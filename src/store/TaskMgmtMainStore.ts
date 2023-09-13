import { makeAutoObservable, flow } from 'mobx';
import { GetUserList, SearchTaskList, GetUserPermission } from '@/action/TaskMgmtMainAction';
import { UsersInfo } from '@/vo/userManager/index';
import { userPermission } from '@/vo/taskManager';

class TaskMgmt {
  pending = false;
  userListResult: any = null;
  taskListResult: any = null;
  userPermissionResult: any = null;

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

  searchTaskList = flow(function* (params: any) {
    this.pending = true;
    try {
      const res = yield SearchTaskList(params);
      this.pending = false;
      this.taskListResult = res;
    } catch (error) {
      this.pending = false;
      this.taskListResult = error;
    }
  });

  getUserPermission = flow(function* (params: userPermission) {
    this.pending = true;
    try {
      const res = yield GetUserPermission(params);
      this.pending = false;
      this.userPermissionResult = res;
    } catch (error) {
      this.pending = false;
      this.userPermission = error;
    }
  });
}

const taskMgmtMainStore = new TaskMgmt();
export default taskMgmtMainStore;
