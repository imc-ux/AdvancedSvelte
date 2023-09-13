import { callRestfulService } from "@/business/BusinessBase";
import { MMessageManagerKey } from "@/constant/Service";

export function searchMessageBoard(info: any): Promise<UJsonRespond> {
  return callRestfulService(MMessageManagerKey.SearchMessageBoard, info);
}
