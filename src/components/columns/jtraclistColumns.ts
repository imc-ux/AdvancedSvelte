import { LinkRenderer, CheckRenderer } from "@/components/renderers/index";

const jtracListColumns = [
  {
    headerName: "",
    width: 40,
    field: "selected",
    headerClass: ["center-aligned", "ag-header"],
    cellClass: ["cell-center-align", "cell-border"],
    cellRenderer: CheckRenderer,
  },
  {
    headerName: "jtracNo",
    field: "jtracNo",
    width: 110,
    headerClass: ["center-aligned", "ag-header"],
    cellClass: ["cell-center-align", "cell-border"],
  },
  {
    headerName: "日期",
    field: "createDate",
    width: 170,
    headerClass: ["center-aligned", "ag-header"],
    cellClass: ["cell-center-align", "cell-border"],
  },
  {
    headerName: "系统区分",
    field: "systemType",
    width: 100,
    headerClass: ["center-aligned", "ag-header"],
    cellClass: ["cell-center-align", "cell-border"],
  },
  {
    headerName: "版本号",
    field: "version",
    width: 100,
    headerClass: ["center-aligned", "ag-header"],
    cellClass: ["cell-center-align", "cell-border"],
  },
  {
    headerName: "负责人",
    field: "clientDeveloper",
    width: 100,
    headerClass: ["center-aligned", "ag-header"],
    cellClass: ["cell-center-align", "cell-border"],
  },
  {
    headerName: "后台负责人",
    field: "reviewerName",
    width: 100,
    headerClass: ["center-aligned", "ag-header"],
    cellClass: ["cell-center-align", "cell-border"],
  },
  {
    headerName: "状态",
    field: "statusChange",
    width: 85,
    headerClass: ["center-aligned", "ag-header"],
    cellClass: ["cell-center-align", "cell-border"],
  },
  {
    headerName: "文件列表",
    field: "fileListChange",
    width: 150,
    headerClass: ["center-aligned", "ag-header"],
    cellClass: ["cell-left-align", "cell-border"],
    cellRenderer: LinkRenderer,
  },
  {
    headerName: "模块",
    field: "moduleListChange",
    width: 150,
    headerClass: ["center-aligned", "ag-header"],
    cellClass: ["cell-left-align", "cell-border"],
    cellRenderer: LinkRenderer,
  },
];

export default jtracListColumns;
