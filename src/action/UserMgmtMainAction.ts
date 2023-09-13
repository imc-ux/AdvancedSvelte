import { callRestfulService } from '@/business/BusinessBase';
import { MUserMgmtMainKey } from '@/constant/Service';
import { PermissionInfo, UsersInfo } from '@/vo/userManager';

//获取权限
export function GetUserPermission(info: PermissionInfo): Promise<UJsonRespond> {
  return callRestfulService(MUserMgmtMainKey.GetUserPermission, info);
}

//用户查询
export function GetUserList(info: UsersInfo): Promise<UJsonRespond> {
  return callRestfulService(MUserMgmtMainKey.GetUserList, info);
}

//保存方法
export function ModifyUserMulti(info: any[] | null): Promise<UJsonRespond> {
  return callRestfulService(MUserMgmtMainKey.ModifyUserMulti, info);
}

//获取用户权限
export function GetUserActivePermission(info: string): Promise<UJsonRespond> {
  return callRestfulService(MUserMgmtMainKey.GetUserActivePermission, info);
}
