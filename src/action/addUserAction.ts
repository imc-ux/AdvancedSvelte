import { callRestfulService } from '@/business/BusinessBase';
import { MAddUserKey } from '@/constant/Service';
import { UsersInfo } from '@/vo/userManager';

export function AddUser(info: UsersInfo): Promise<UJsonRespond> {
  return callRestfulService(MAddUserKey.AddUser, info);
}
