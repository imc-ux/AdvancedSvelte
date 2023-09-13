import { callRestfulService } from '@/business/BusinessBase';
import { MAddTaskKey } from '@/constant/Service';
import { UsersInfo } from '@/vo/userManager';
import { AddTaskValue } from '@/vo/taskManager';

export function GetUserList(info: UsersInfo): Promise<UJsonRespond> {
  return callRestfulService(MAddTaskKey.GetUserList, info);
}

export function AddTaskInfo(info: AddTaskValue): Promise<UJsonRespond> {
  return callRestfulService(MAddTaskKey.AddTaskInfo, info);
}

export function SearchTaskList(info: any): Promise<UJsonRespond> {
  return callRestfulService(MAddTaskKey.SearchTaskList, info);
}
