import { callRestfulService } from '@/business/BusinessBase';
import { MTaskManageKey } from '@/constant/Service';
import { UsersInfo } from '@/vo/userManager/index';
import { userPermission } from '@/vo/taskManager';

export function GetUserList(info: UsersInfo): Promise<UJsonRespond> {
  return callRestfulService(MTaskManageKey.GetUserList, info);
}

export function SearchTaskList(info: any): Promise<UJsonRespond> {
  return callRestfulService(MTaskManageKey.SearchTaskList, info);
}

export function GetUserPermission(info: userPermission): Promise<UJsonRespond> {
  return callRestfulService(MTaskManageKey.GetUserPermission, info);
}

//获取权限
export function GetUserActivePermission(info: string): Promise<UJsonRespond> {
  return callRestfulService(MTaskManageKey.GetUserActivePermission, info);
}
