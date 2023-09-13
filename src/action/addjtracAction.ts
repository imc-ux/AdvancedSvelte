import { callRestfulService } from '@/business/BusinessBase';
import { MUserManagerKey, MAddJtracKey, MSearchJtracVersionKey } from '@/constant/Service';
import { UsersInfo } from '@/vo/userManager/index';

export function GetUserList(info: UsersInfo): Promise<UJsonRespond> {
  return callRestfulService(MUserManagerKey.GetUserList, info);
}

export function AddJtracInfo(info?: any): Promise<UJsonRespond> {
  return callRestfulService(MAddJtracKey.AddJtracInfo, info);
}

export function GetUserCheckPersonList(info?: any): Promise<UJsonRespond> {
  return callRestfulService(MUserManagerKey.GetUserCheckPersonList, info);
}

export function SearchJtracVersion(info?: any): Promise<UJsonRespond> {
  return callRestfulService(MSearchJtracVersionKey.SearchJtracVersion, info);
}
