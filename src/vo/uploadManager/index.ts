export interface JtracListSearchInfo {
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  clientDeveloperId?: string;
  jtracNo?: string;
  modules?: string;
  jtracUniqFlag?: string;
  iStart?: number;
  iPageCount?: number;
}

export interface JtracInfo {
  jtracNo?: string;
  bizDeveloper?: string;
  urgencyFlag?: string;
  fileList?: string;
  moduleList?: string;
  labelList?: string;
  clientDeveloper?: string;
  systemType?: string;
  nid?: string;
  status?: string;
  orgStatus?: string;
  version?: string;
  detail?: string;
  reviewer?: string;
}

export interface PermissionList {
  userId?: string;
  permissionId?: string;
  pageId?: string;
}

export interface JtracDetailInfo {
  jtracNo?: string;
  relevantProject?: string;
  status?: string;
  initiator?: string;
  receiver?: string;
  summary?: string;
  detail?: string;
  emmergency?: string;
  system?: string;
  pageName?: string;
  requester?: string;
  reason?: string;
  OPReqReason?: string;
  clientDeveloper?: string;
  bizDeveloper?: string;
  devStartDate?: string;
  devEndDate?: string;
  SVNversion?: string;
  DBChange?: string;
  migration?: string;
  updateClass?: string;
  versatilityCodeChange?: string;
  configTableChange?: string;
  tester?: string;
  testStartDate?: string;
  testEndDate?: string;
  openAgain?: string;
  preJtracNo?: string;
  daemon?: string;
}
