export interface taskInfo {
  taskTitle?: string;
  taskUserId?: string;
  taskProgress?: string;
  breakFlag?: string;
  iStart?: number;
  iPageCount?: number;
}

export interface taskModifyTypeInfo {
  technologyTitle?: string;
  author?: string;
  nid?: string;
}

export interface taskDetailInfo {
  taskNo?: string;
  changeItemId?: string;
}

export interface taskModifyInfo {
  taskNo?: number;
  taskTitle?: string;
  taskUserId?: string;
  taskContent?: string;
  startDate?: string;
  endDate?: string;
  taskProgress?: number;
  taskRemark?: string;
  breakFlag?: string;
  userId?: string;
  undoneFlag?: string;
}

export interface userPermission {
  userId?: string;
  permissionId?: string;
  pageId?: string;
}

export interface AddTaskValue {
  taskTitle?: string;
  taskUserId?: string;
  taskContent?: string;
  startDate?: string;
  endDate?: string;
  taskAdmin?: string;
}
