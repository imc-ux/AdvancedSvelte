import { callRestfulService } from "@/business/BusinessBase";
import { MMessageManagerKey } from "@/constant/Service";

export function addMessageBoard(info: any): Promise<UJsonRespond> {
  return callRestfulService(MMessageManagerKey.AddMessageBoard, info);
}
