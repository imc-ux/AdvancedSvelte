import { callRestfulService } from "@/business/BusinessBase";
import { MMessageManagerKey } from "@/constant/Service";

export function getMessageBoardActionList(info: string): Promise<UJsonRespond> {
  return callRestfulService(MMessageManagerKey.GetMessageBoardActionList, info);
}

export function operateMessageBoard(info: any): Promise<UJsonRespond> {
  return callRestfulService(MMessageManagerKey.OperateMessageBoard, info);
}
