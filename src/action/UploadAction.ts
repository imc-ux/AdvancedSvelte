import { callRestfulService } from '@/business/BusinessBase';
import { MUploadManagerKey } from '@/constant/Service';
import { UsersInfo } from '@/vo/userManager/index';
//获取提交人
export function GetUserList(info: UsersInfo): Promise<UJsonRespond> {
  return callRestfulService(MUploadManagerKey.GetUserList, info);
}
//权限
export function GetUserPermission(info?: any): Promise<UJsonRespond> {
  return callRestfulService(MUploadManagerKey.GetUserPermission, info);
}
//检索
export function SearchUniqJtracList(info?: any): Promise<UJsonRespond> {
  return callRestfulService(MUploadManagerKey.SearchUniqJtracList, info);
}
//更新状态
export function UpdateMultJtracStatus(info?: any): Promise<UJsonRespond> {
  return callRestfulService(MUploadManagerKey.UpdateMultJtracStatus, info);
}
//删除
export function DeleteJtracInfo(info?: any): Promise<UJsonRespond> {
  return callRestfulService(MUploadManagerKey.DeleteJtracInfo, info);
}

//获取权限方法
export function GetUserActivePermission(info: string): Promise<UJsonRespond> {
  return callRestfulService(MUploadManagerKey.GetUserActivePermission, info);
}
