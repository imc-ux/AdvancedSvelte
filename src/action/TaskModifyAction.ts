import { callRestfulService } from '@/business/BusinessBase';
import { MTaskModifyKey } from '@/constant/Service';
import { taskModifyInfo, userPermission } from '@/vo/taskManager/index';

export function modifyTaskInfo(info: taskModifyInfo): Promise<UJsonRespond> {
  return callRestfulService(MTaskModifyKey.modifyTaskInfo, info);
}

export function GetUserPermission(info: userPermission): Promise<UJsonRespond> {
  return callRestfulService(MTaskModifyKey.GetUserPermission, info);
}

//获取权限
export function GetUserActivePermission(info: string): Promise<UJsonRespond> {
  return callRestfulService(MTaskModifyKey.GetUserActivePermission, info);
}
