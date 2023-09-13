import { callRestfulService } from '@/business/BusinessBase';
import { MUserManagerKey, MPageManagerKey } from '@/constant/Service';

export function GetUserList(info: any): Promise<UJsonRespond> {
  return callRestfulService(MUserManagerKey.GetUserList, info);
}

export function GetUserCheckPersonList(infos: string[]): Promise<UJsonRespond> {
  return callRestfulService(MUserManagerKey.GetUserCheckPersonList, infos);
}

export function GetMpPageMgmtType(): Promise<UJsonRespond> {
  return callRestfulService(MPageManagerKey.GetMpPageMgmtType);
}

export function GetMpPageMgmtList(info: any): Promise<UJsonRespond> {
  return callRestfulService(MPageManagerKey.GetMpPageMgmtList, info);
}

export function UpdateMpPageInfo(info: any): Promise<UJsonRespond> {
  return callRestfulService(MPageManagerKey.UpdateMpPageInfo, info);
}

export function GetPageIdsByType(info: any): Promise<UJsonRespond> {
  return callRestfulService(MPageManagerKey.GetPageIdsByType, info);
}

export function GetJtracNosByPageId(info: string): Promise<UJsonRespond> {
  return callRestfulService(MPageManagerKey.GetJtracNosByPageId, info);
}

//获取权限
export function GetUserActivePermission(info: string): Promise<UJsonRespond> {
  return callRestfulService(MPageManagerKey.GetUserActivePermission, info);
}
