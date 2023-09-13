import { makeAutoObservable, flow } from "mobx";
import { getMessageBoardActionList, operateMessageBoard } from "@/action/MessageReplyAction";

class MessageReply {
  pending = false;
  getMessageBoardActionResult: any = null;
  operateMessageBoardResult: any = null;

  constructor() {
    makeAutoObservable(this);
  }

  getMessageBoardActionList = flow(function*(params: any) {
    this.pending = true;
    try {
      const res = yield getMessageBoardActionList(params);
      this.pending = false;
      this.getMessageBoardActionResult = res;
    } catch (error) {
      this.pending = false;
      this.getMessageBoardActionResult = error;
    }
  });

  operateMessageBoard = flow(function*(params: any) {
    this.pending = true;
    try {
      const res = yield operateMessageBoard(params);
      this.pending = false;
      this.operateMessageBoardResult = res;
    } catch (error) {
      this.pending = false;
      this.operateMessageBoardResult = error;
    }
  });


}

const MessageReplyStore = new MessageReply();
export default MessageReplyStore;
