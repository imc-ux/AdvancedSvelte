import { callRestfulService } from '@/business/BusinessBase';
import { MUserManagerKey, MPageManagerKey } from '@/constant/Service';

export function GetUserList(info: any, mark: any): Promise<UJsonRespond> {
  return callRestfulService(MUserManagerKey.GetUserList, info, mark);
}

export function GetUserCheckPersonList(infos: string[], mark: any): Promise<UJsonRespond> {
  return callRestfulService(MUserManagerKey.GetUserCheckPersonList, infos, mark);
}

export function GetMpPageMgmtType(mark: any): Promise<UJsonRespond> {
  return callRestfulService(MPageManagerKey.GetMpPageMgmtType, null, mark);
}

export function GetMpPageMgmtList(info: any, mark: any): Promise<UJsonRespond> {
  return callRestfulService(MPageManagerKey.GetMpPageMgmtList, info, mark);
}

export function UpdateMpPageInfo(info: any, mark: any): Promise<UJsonRespond> {
  return callRestfulService(MPageManagerKey.UpdateMpPageInfo, info, mark);
}

export function GetPageIdsByType(info: any, mark: any): Promise<UJsonRespond> {
  return callRestfulService(MPageManagerKey.GetPageIdsByType, info, mark);
}

export function GetJtracNosByPageId(info: any, mark: any): Promise<UJsonRespond> {
  return callRestfulService(MPageManagerKey.GetJtracNosByPageId, info, mark);
}

//获取权限
export function GetUserActivePermission(info: string, mark: any): Promise<UJsonRespond> {
  return callRestfulService(MPageManagerKey.GetUserActivePermission, info, mark);
}
