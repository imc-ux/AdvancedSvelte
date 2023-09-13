import { callRestfulService } from '@/business/BusinessBase';
import { MJtracManagerKey } from '@/constant/Service';

export function ReadJtrac(info: any): Promise<UJsonRespond> {
  return callRestfulService(MJtracManagerKey.ReadJtrac, info);
}
