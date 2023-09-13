import { callRestfulService } from '@/business/BusinessBase';
import { MModifyUserKey } from '@/constant/Service';

export function ModifyUser(info: any): Promise<UJsonRespond> {
  return callRestfulService(MModifyUserKey.ModifyUser, info);
}

//获取用户权限
export function GetUserActivePermission(info: string): Promise<UJsonRespond> {
  return callRestfulService(MModifyUserKey.GetUserActivePermission, info);
}
