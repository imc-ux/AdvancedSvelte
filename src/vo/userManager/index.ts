export interface UsersInfo {
  blockflag?: string;
  usertype?: string;
  iStart?: number;
  iPageCount?: number;
}

export interface UserSearchInfo {
  msgType?: string;
  userId?: string;
  iStart?: number;
  iPageCount?: number;
}

export interface MessageBoardSearchInfo {
  userId?: string;
  content?: string;
  relateNid?: string;
  iStart?: number;
  iPageCount?: number;
}

export interface MessageBoardActionInfo {
  relateNid?: string;
  userId?: string;
  actionType?: string;
}
