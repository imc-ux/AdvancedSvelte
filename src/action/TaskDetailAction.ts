import { callRestfulService } from '@/business/BusinessBase';
import { taskModifyTypeInfo, taskDetailInfo } from '@/vo/taskManager/index';
import { MTaskDetailKey } from '@/constant/Service';

export function GetTaskChangeItem(info: taskModifyTypeInfo): Promise<UJsonRespond> {
  return callRestfulService(MTaskDetailKey.GetTaskChangeItem, info);
}

export function GetTaskDetail(info: taskDetailInfo): Promise<UJsonRespond> {
  return callRestfulService(MTaskDetailKey.GetTaskDetail, info);
}
