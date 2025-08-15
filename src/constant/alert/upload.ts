export enum UploadAlert {
  INTERNET_ERROR = '网络连接错误.',
  UPDATE_SUCCESS = '保存成功!',
  DELETE_SUCCESS = '已删除.',
  PLZ_SEARCH = '请检索!',
  CHOOSE_STATUS = '请选择正确的状态!',
  CHOOSE_DATA = '请选择数据!',
  SEARCH_DATA = '请先检索数据!',
}

export enum AddJtracAlert {
  JTRAC_VERSION_EMPTY = '版本号为空，请查看历史文件!',
  JTRAC_VERSION_SEARCH_FAILED = '版本号查询失败!',
  JTRAC_NUMBER_CANNOT_EMPTY = 'JTrac号不能为空,请重新输入!',
  DETAIL_CANNOT_EMPTY = 'detail不能为空,请重新输入!',
  FILELIST_CANNOT_EMPTY = '文件列表不能为空，请重新输入!',
  MODULE_CANNOT_EMPTY = '模块不能为空,请重新输入!',
  LOGIN_FIRST = '请登录后再进行该项操作!',
  DETAIL_MIN_8 = 'detail内容至少中文4或英文8!',
  REVIEWER_CANNOT_EMPTY = '代码检查负责人不能为空!',
  JTRAC_VERSION_FORMAT_ERROR = '版本号格式输入错误!',
}

export enum FileListAlert {
  JTRAC_VERSION_FORMAT_ERROR = '版本号格式输入错误!',
  JTRAC_NUMBER_CANNOT_EMPTY = 'JTrac号不能为空,请重新输入!',
  FILELIST_CANNOT_EMPTY = '文件列表不能为空，请重新输入!',
  LOGIN_FIRST = '请登录后再进行该项操作!',
  DETAIL_MIN_8 = 'detail内容至少中文4或英文8!',
  COPY_SUCCESS = '复制成功.',
  REVIEWER_CANNOT_EMPTY = '代码检查负责人不能为空!',
}

export enum JtracListAlert {
  INTERNET_ERROR = '网络连接错误.',
  DELETE_SUCCESS = '删除成功.',
  CHOOSE_DELETE_DATA = '请选择要删除的数据!',
  CHOOSE_STATUS = '请选择正确的状态!',
  CONFIRM_DELETE = '确定删除吗?',
}
