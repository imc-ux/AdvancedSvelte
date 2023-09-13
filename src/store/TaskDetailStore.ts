import { makeAutoObservable, flow } from 'mobx';
import { GetTaskChangeItem, GetTaskDetail } from '@/action/TaskDetailAction';
import { taskModifyTypeInfo, taskDetailInfo } from '@/vo/taskManager/index';

class TaskDetail {
  pending = false;
  taskChangeItemResult: taskModifyTypeInfo = null;
  taskDetailResult: taskDetailInfo = null;
  constructor() {
    makeAutoObservable(this);
  }
  getTaskChangeItem = flow(function* (params: taskModifyTypeInfo) {
    this.pending = true;
    try {
      const res = yield GetTaskChangeItem(params);
      this.pending = false;
      this.taskChangeItemResult = res;
    } catch (error) {
      this.pending = false;
      this.taskChangeItemResult = error;
    }
  });

  getTaskDetail = flow(function* (params: taskDetailInfo) {
    this.pending = true;
    try {
      const res = yield GetTaskDetail(params);
      this.pending = false;
      this.taskDetailResult = res;
    } catch (error) {
      this.pending = false;
      this.taskDetailResult = error;
    }
  });
}

const taskDetailStore = new TaskDetail();
export default taskDetailStore;
