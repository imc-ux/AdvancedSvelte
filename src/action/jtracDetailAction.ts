import { callRestfulService } from "@/business/BusinessBase";
import { MUserManagerKey, MJtracManagerKey, MPageManagerKey } from "@/constant/Service";

export function GetUserList(info: any): Promise<UJsonRespond> {
  return callRestfulService(MUserManagerKey.GetUserList, info);
}

export function GetUserCheckPersonList(infos: string[]): Promise<UJsonRespond> {
  return callRestfulService(MUserManagerKey.GetUserCheckPersonList, infos);
}

export function SearchUniqJtracList(info:any): Promise<UJsonRespond>{
  return callRestfulService(MJtracManagerKey.SearchUniqJtracList, info);
}

export function ReadJtrac(info:any): Promise<UJsonRespond>{
  return callRestfulService(MJtracManagerKey.ReadJtrac, info);
}

export function GetMpPageMgmtList(info: any): Promise<UJsonRespond> {
  return callRestfulService(MPageManagerKey.GetMpPageMgmtList,info);
}
