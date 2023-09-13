export enum TaskMgmtAlert {
  INTERNET_ERROR = '网络连接错误!',
  SAVE_SUCCESS = '保存成功!',
  DOWNLOAD_DATA = '请先检索数据!',
}

export enum AddTaskAlert {
  INTERNET_ERROR = '网络连接错误!',
  TASK_TITLE_ERROR = '请输入题目!',
  TASK_USERID_ERROR = '请选择负责人!',
  TASK_DATE_ERROR = '请选择日期!',
  ADD_TASK_SUCCESS = '保存成功!',
  ADD_TASK_ERROR = '保存失败!',
  SEARCH_TASK_ERROR = '查询任务列表失败!',
  TASK_TITLE_SAME = '题目输入重复！',
}

export enum ModifyTaskAlert {
  INTERNET_ERROR = '网络连接错误!',
  NOT_THE_PERSON_IN_CHARGE_OF_THIS_PROJECT = '不是该任务的负责人，不能修改!',
  CAN_NOT_BE_MODIFIED_IN_SUSPENDED_STATE = '中止状态下不可修改!',
  PLEASE_ENTER_A_TITLE = '请输入标题!',
  PLAESE_CHOOSE_PERSON_IN_CHARGE = '请选择负责人!',
  PLEASE_CHOOSE_DATE = '请选择日期!',
  PLEASE_ENTER_PROGRESS = '请输入进度!',
  CAN_NOT_MODIFY_PROGRESS = '不能只修改备注(完成内容)!',
  TO_MODIFY_THE_SCHEDULE_YUO_NEED_TO_MODIFY_THE_NOTES = '修改日程要修改备注!',
  TO_MODIFY_THE_PROGRESS_YOU_NEED_TO_MODIFY_THE_NOTES = '修改进度要修改备注!',
  THE_NOTES_IS_NOT_LESS_THAN_5 = '备注不应少于5个字!',
  PLEASE_NOTE_THE_REASON_FOR_NOT_PROCEEDING = '请备注未进行的原因!',
  MODIFYING_PROGRESS_CAN_NOT_BE_SELECTED_AS_NOT_IN_PROGRESS = '修改进度不能选择未进行!',
}
