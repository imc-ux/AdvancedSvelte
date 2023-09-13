import { callRestfulService } from '@/business/BusinessBase';
import { MUserManagerKey, MUploadManagerKey, MUpdateJtracKey } from '@/constant/Service';

export function GetUserList(info: any): Promise<UJsonRespond> {
  return callRestfulService(MUserManagerKey.GetUserList, info);
}

export function GetUserCheckPersonList(info: any): Promise<UJsonRespond> {
  return callRestfulService(MUserManagerKey.GetUserCheckPersonList, info);
}

export function GetUserPermission(info: any): Promise<UJsonRespond> {
  return callRestfulService(MUploadManagerKey.GetUserPermission, info);
}

export function UpdateJtracInfo(info: any): Promise<UJsonRespond> {
  return callRestfulService(MUpdateJtracKey.UpdateJtracInfo, info);
}

export function UpdateMultJtracStatus(info?: any): Promise<UJsonRespond> {
  return callRestfulService(MUploadManagerKey.UpdateMultJtracStatus, info);
}
