export enum CommonAlert {
  INTERNET_ERROR = '网络错误!',
  SAVE_DATA = '保存成功!',
}

export enum PageManageAlert {
  INTERNET_ERROR = '网络连接错误!',
  SAVE_DATA = '保存成功.',
  DELETE_DATA = '删除成功.',
  ID_NOT_NULL = 'ID不能为空!',
  NAME_NOT_NULL = 'Name不能为空!',
  PLEASE_SELECT_TYPE = '请先选择Type!',
  PLEASE_SELECT_MANAGEMENT = '请选择Management!',
  POP_NOT_CAN_DUPLICATE = '关联pop不能重复!',
  RENDERER_NOT_CAN_DUPLICATE = '关联Renderer不能重复!',
  NOT_CHINESE_INPUT = '禁止中文输入!',
  SEARCH_NOT_DATA = '查询无数据!',
  NOT_DELETE_SEARCH_NOT_DATA = '无法删除,查询不到此数据!',
  NOT_MODIFY_SEARCH_NOT_DATA = '无法修改,查询不到此数据!',
  ARE_YOU_SURE_DELETE = '确定要删除吗?',
}
