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

export interface PermissionInfo {
  userId?: string;
  permissionId?: string;
  pageId?: string;
}

export interface UsersInfo {
  id?: string;
  name?: string;
  password?: string;
  role?: string;
  blockflag?: string;
  usertype?: string;
  permission?: string;
  level?: string;
  figure?: string;
  iStart?: number;
  iPageCount?: number;
  memberId?: string;
  roomOwnerId?: string;
  roomId?: string;
  ownerFlag?: string;
  ip?: string;
}
