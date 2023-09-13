import { callRestfulService } from "@/business/BusinessBase";
import { MUserManagerKey, MPageManagerKey } from "@/constant/Service";

export function GetUserList(info: any): Promise<UJsonRespond> {
  return callRestfulService(MUserManagerKey.GetUserList, info);
}

export function GetUserCheckPersonList(infos: string[]): Promise<UJsonRespond> {
  return callRestfulService(MUserManagerKey.GetUserCheckPersonList, infos);
}

export function GetMpPageMgmtType(): Promise<UJsonRespond>{
  return callRestfulService(MPageManagerKey.GetMpPageMgmtType);
}

export function CreateMpPageMgmtInfo(info: any): Promise<UJsonRespond>{
  return callRestfulService(MPageManagerKey.CreateMpPageMgmtInfo, info);
}

export function GetMpPageMgmtList(info: any): Promise<UJsonRespond> {
  return callRestfulService(MPageManagerKey.GetMpPageMgmtList,info);
}

export function GetAllPageIds(info: any): Promise<UJsonRespond> {
  return callRestfulService(MPageManagerKey.GetAllPageIds,info);
}

export function GetPageIdsByType(info: any): Promise<UJsonRespond> {
  return callRestfulService(MPageManagerKey.GetPageIdsByType,info);
}
