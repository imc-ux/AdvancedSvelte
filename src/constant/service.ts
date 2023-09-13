export const PrefixRestURL = '?jsonString=';

export const PrefixURL = '/b2b'; //"/b2b";

export enum MUserManagerKey {
  GetUserList = 'getUserList',
  GetUserCheckPersonList = 'getUserCheckPersonList',
}

export enum MJtracManagerKey {
  SearchJtracVersion = 'searchJtracVersion',
  GetUserList = 'getUserList',
  AddJtracInfo = 'addJtracInfo',
  SearchUniqJtracList = 'searchUniqJtracList',
  ReadJtrac = 'readJtrac',
}

export enum MTaskManageKey {
  GetUserList = 'getUserList',
  SearchTaskList = 'searchTaskList',
  GetUserPermission = 'getUserPermission',
  GetUserActivePermission = 'getUserActivePermission',
}

export enum MTaskDetailKey {
  GetTaskDetail = 'getTaskDetail',
  GetTaskChangeItem = 'getTaskChangeItem',
}

export enum MTaskModifyKey {
  modifyTaskInfo = 'modifyTaskInfo',
  GetUserPermission = 'getUserPermission',
  GetUserActivePermission = 'getUserActivePermission',
}

export enum MMessageManagerKey {
  SearchMessageBoard = 'searchMessageBoard',
  OperateMessageBoard = 'operateMessageBoard',
  GetMessageBoardActionList = 'getMessageBoardActionList',
  AddMessageBoard = 'addMessageBoard',
  SearchMessageBoardByUser = 'searchMessageBoardByUser',
}

export enum MPageManagerKey {
  GetMpPageMgmtType = 'getMpPageMgmtType',
  CreateMpPageMgmtInfo = 'createMpPageMgmtInfo',
  GetMpPageMgmtList = 'getMpPageMgmtList',
  UpdateMpPageInfo = 'updateMpPageInfo',
  GetAllPageIds = 'getAllPageIds',
  GetPageIdsByType = 'getPageIdsByType',
  GetJtracNosByPageId = 'getJtracNosByPageId',
  GetUserActivePermission = 'getUserActivePermission',
}

export enum MUploadManagerKey {
  GetUserList = 'getUserList',
  GetUserPermission = 'getUserPermission',
  SearchUniqJtracList = 'searchUniqJtracList',
  UpdateMultJtracStatus = 'updateMultJtracStatus',
  DeleteJtracInfo = 'deleteJtracInfo',
  GetUserActivePermission = 'getUserActivePermission',
}

export enum MReadJtracKey {
  Post = 'post',
}

export enum MSearchJtrackey {
  SearchJtracList = 'searchJtracList',
}

export enum MDeleteJtrackey {
  DeleteJtracInfo = 'deleteJtracInfo',
}

export enum MUpdateJtracKey {
  UpdateJtracInfo = 'updateJtracInfo',
}

export enum MAddJtracKey {
  AddJtracInfo = 'addJtracInfo',
}

export enum MSearchJtracVersionKey {
  SearchJtracVersion = 'searchJtracVersion',
}

export enum MAddTaskKey {
  GetUserList = 'getUserList',
  AddTaskInfo = 'addTaskInfo',
  SearchTaskList = 'searchTaskList',
}

export enum MUserMgmtMainKey {
  GetUserPermission = 'getUserPermission',
  GetUserList = 'getUserList',
  ModifyUserMulti = 'modifyUserMulti',
  GetUserActivePermission = 'getUserActivePermission',
}

export enum MModifyUserKey {
  ModifyUser = 'modifyUser',
  GetUserActivePermission = 'getUserActivePermission',
}

export enum MAddUserKey {
  AddUser = 'addUser',
}
