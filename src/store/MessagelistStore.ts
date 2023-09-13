import { makeAutoObservable, flow } from "mobx";
import { searchMessageBoard, operateMessageBoard } from "@/action/MessageListAction";

class MessageList {
  pending = false;
  searchMessageBoardResult: any = null;
  operateMessageBoardResult: any = null;

  constructor() {
    makeAutoObservable(this);
  }

  searchMessageBoard = flow(function*(params: any) {
    this.pending = true;
    try {
      const res = yield searchMessageBoard(params);
      this.pending = false;
      this.searchMessageBoardResult = res;
    } catch (error) {
      this.pending = false;
      this.searchMessageBoardResult = error;
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

const MessageListStore = new MessageList();
export default MessageListStore;
