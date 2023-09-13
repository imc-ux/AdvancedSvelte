import { makeAutoObservable, flow } from "mobx";
import { addMessageBoard } from "@/action/MessageSendAction";

class MessageSend {
  pending = false;
  addMessageBoardResult: any = null;


  constructor() {
    makeAutoObservable(this);
  }

  addMessageBoard = flow(function*(params: any) {
    this.pending = true;
    try {
      const res = yield addMessageBoard(params);
      this.pending = false;
      this.addMessageBoardResult = res;
    } catch (error) {
      this.pending = false;
      this.addMessageBoardResult = error;
    }
  });
}

const MessageSendStore = new MessageSend();
export default MessageSendStore;
