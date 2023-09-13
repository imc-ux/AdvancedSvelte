import { makeAutoObservable, flow } from 'mobx';
import { GetUserList, SearchTaskList } from '@/action/TaskMgmtMainAction';
import { modifyTaskInfo, GetUserPermission } from '@/action/TaskModifyAction';
import { UsersInfo } from '@/vo/userManager/index';
import { taskModifyInfo, userPermission } from '@/vo/taskManager/index';
import { UserProfile } from 'carbon-icons-svelte';

class ModifyTask {
  pending = false;
  userListResult: any = null;
  taskListResult: any = null;
  taskModifyResult: any = null;
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

  modifyTaskInfo = flow(function* (params: taskModifyInfo) {
    this.pending = true;
    try {
      const res = yield modifyTaskInfo(params);
      this.taskModifyResult = res;
    } catch (error) {
      this.pending = false;
      this.taskModifyResult = error;
    }
  });

  getUserPermission = flow(function* (params: userPermission) {
    this.pending = true;
    try {
      const res = yield GetUserPermission(params);
      this.userPermissionResult = res;
    } catch (error) {
      this.pending = false;
      this.userPermissionResult = error;
    }
  });
}

const modifyTaskStore = new ModifyTask();
export default modifyTaskStore;
