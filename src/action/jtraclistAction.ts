import { callRestfulService } from '@/business/BusinessBase';
import { MSearchJtrackey, MDeleteJtrackey } from '@/constant/Service';

export function SearchJtracList(info: any): Promise<UJsonRespond> {
  return callRestfulService(MSearchJtrackey.SearchJtracList, info);
}

export function DeleteJtracInfo(info: any): Promise<UJsonRespond> {
  return callRestfulService(MDeleteJtrackey.DeleteJtracInfo, info);
}
