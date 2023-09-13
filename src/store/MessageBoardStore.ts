import { makeAutoObservable, flow } from "mobx";
import { searchMessageBoard } from "@/action/MessageBoardAction";

class MessageBoard {
  pending = false;
  searchMessageBoardResult: any = null;

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
}

const MessageBoardStore = new MessageBoard();
export default MessageBoardStore;
