export enum UserMgmtMainAlert {
  INTERNET_ERROR = '网络连接错误!',
  SELECTED_NO_ROWS = '没有信息要保存!',
  MODIFY_USER_MULTI_SUCCESS = '保存成功!',
  PLEASE_SEARCH_DATA = '请先检索数据!',
  NO_MODIFICATION_PERMISSION = '无修改权限!',
}

export enum ModifyUserAlert {
  PLEASE_LOGIN_IN = '请登陆后再进行该项操作!',
  FRONT_USER_OLD_PSW_IS_NOT_NULL = '前台用户旧密码不能为空!',
  FRONT_USER_NEW_PSW_IS_NOT_NULL = '前台用户新密码不能为空',
  THE_TWO_PSW_INPUT_ARE_INCONSISTENT = '两次密码输入不相同，请重新输入!',
  SAVE_SUCCESS = '保存成功!',
  INTERNET_ERROR = '网络连接错误!',
  NO_MODIFICATION_PERMISSION = '无修改权限!',
}

export enum AddUserAlert {
  ID_IS_NOT_NULL = '用户ID不能为空,请重新输入',
  NAME_IS_NOT_NULL = '用户姓名不能为空,请重新输入!',
  USER_TYPE_IS_NOT_NULL = '用户类型不能为空,请重新输入!',
  FRON_USER_PSW_IS_NOT_NULL = '前台用户密码不能为空,请重新输入!',
  THE_TWO_PSW_INPUT_ARE_INCONSISTENT = '两次密码输入不相同,请重新输入!',
  SAVE_SUCCESS = '保存成功!',
  INTERNET_ERROR = '网络连接错误!',
}
