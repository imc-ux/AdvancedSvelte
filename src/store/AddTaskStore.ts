import { makeAutoObservable, flow } from 'mobx';
import { GetUserList, AddTaskInfo, SearchTaskList } from '@/action/AddTaskAction';
import { UsersInfo } from '@/vo/userManager';
import { AddTaskValue } from '@/vo/taskManager';

class AddTask {
  pending = false;
  userListResult: any = null;
  addTaskResult: any = null;
  searchTaskResult: any = null;

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

  addTaskInfo = flow(function* (params: AddTaskValue) {
    this.pending = true;
    try {
      const res = yield AddTaskInfo(params);
      this.pending = false;
      this.addTaskResult = res;
    } catch (error) {
      this.pending = false;
      this.addTaskResult = error;
    }
  });

  searchTaskList = flow(function* (params: any) {
    this.pending = true;
    try {
      const res = yield SearchTaskList(params);
      this.pending = false;
      this.searchTaskResult = res;
    } catch (error) {
      this.pending = false;
      this.searchTaskResult = error;
    }
  });
}

const addTaskStore = new AddTask();
export default addTaskStore;
