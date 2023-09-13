import { callRestfulService } from "@/business/BusinessBase";
import { MUserManagerKey, MPageManagerKey } from "@/constant/Service";
import { UsersInfo } from "@/vo/userManager/index";

export function GetUserList(info: UsersInfo): Promise<UJsonRespond> {
  return callRestfulService(MUserManagerKey.GetUserList, info);
}

export function GetMpPageMgmtType(): Promise<UJsonRespond>{
  return callRestfulService(MPageManagerKey.GetMpPageMgmtType);
}

export function GetMpPageMgmtList(info: any): Promise<UJsonRespond> {
  return callRestfulService(MPageManagerKey.GetMpPageMgmtList,info);
}
