import {
  CheckRenderer,
  LinkButton_Label,
  LinkButton_LinkButton,
  Label_LinkButtonButtonBatchInput,
  LinkButtonButtonBatchInput_Label,
  LinkButtonOrLabel_LabelBatchInput,
} from "@/components/renderers/index";
import DocumentBlank from "carbon-icons-svelte/lib/DocumentBlank.svelte";

export const uploadColumns = [
  {
    value: "JtracNo",
    key: "jtracNo",
    width: "150px",
  },
  {
    value: "系统区分",
    key: "systemTypes",
    width: "100px",
  },
  {
    value: "版本号",
    key: "version",
    width: "100px",
  },
  {
    value: "日期",
    key: "createDate",
    width: "180px",
  },
  {
    value: "负责人",
    key: "clientDeveloperName",
    width: "100px",
  },
  {
    value: "后台负责人",
    key: "bizDeveloperName",
    width: "100px",
  },
  {
    value: "状态",
    key: "statusChange",
    width: "90px",
  },
  {
    value: "文件列表",
    key: "fileListChange",
  },
  {
    value: "模块",
    key: "moduleListChange",
  },
  {
    value: "直接冲突",
    key: "conflictFiles",
    width: "160px",
  },
  {
    value: "详细",
    key: "detailFlag",
    width: "100px",
  },
];

const uploadSveletColumn = [
  {
    headerName: "",
    headerClass: ["center-aligned", "ag-header"],
    cellClass: ["cell-center-align", "cell-border"],
    children: [
      {
        headerName: "",
        width: 40,
        field: "selected",
        headerClass: ["center-aligned", "ag-header"],
        cellClass: ["cell-center-align", "cell-border"],
        cellRenderer: CheckRenderer,
      },
    ],
  },
  {
    headerName: "Jtrac No",
    headerClass: ["center-aligned", "ag-header"],
    cellClass: ["cell-center-align", "cell-border"],
    children: [
      {
        headerName: "日期",
        width: 150,
        field: "jtracNo*createDate",
        headerClass: ["center-aligned", "ag-header"],
        cellClass: ["cell-center-align", "cell-border"],
        cellRenderer: LinkButton_Label,
      },
    ],
  },
  {
    headerName: "系统区分",
    headerClass: ["center-aligned", "ag-header"],
    cellClass: ["cell-center-align", "cell-border"],
    children: [
      {
        headerName: "文件列表",
        width: 400,
        field: "versionNo*fileListChange*srFileList",
        headerClass: ["center-aligned", "ag-header"],
        cellClass: ["cell-left-align", "cell-border"],
        upClassName: "hor-left",
        downClassName: "hor-left",
        icon: DocumentBlank,
        cellRenderer: Label_LinkButtonButtonBatchInput,
      },
    ],
  },
  {
    headerName: "前台负责人",
    headerClass: ["center-aligned", "ag-header"],
    cellClass: ["cell-center-align", "cell-border"],
    children: [
      {
        headerName: "代码检查负责人",
        width: 100,
        field: "clientDeveloperName*reviewerName",
        headerClass: ["center-aligned", "ag-header"],
        cellClass: ["cell-center-align", "cell-border"],
        cellRenderer: LinkButton_LinkButton,
      },
    ],
  },
  {
    headerName: "模块列表",
    headerClass: ["center-aligned", "ag-header"],
    cellClass: ["cell-left-align", "cell-border"],
    children: [
      {
        headerName: "直接冲突",
        width: 400,
        field: "moduleListChange*srModuleList*conflictFiles",
        headerClass: ["center-aligned", "ag-header"],
        cellClass: ["cell-center-align", "cell-border"],
        upClassName: "hor-left",
        icon: DocumentBlank,
        cellRenderer: LinkButtonButtonBatchInput_Label,
      },
    ],
  },
  {
    headerName: "状态",
    headerClass: ["center-aligned", "ag-header"],
    cellClass: ["cell-center-align", "cell-border"],
    children: [
      {
        headerName: "Detail",
        width: 300,
        field: "statusChange*detailFlag*detail",
        headerClass: ["center-aligned", "ag-header"],
        cellClass: ["cell-center-align", "cell-border"],
        downClassName: "hor-left",
        cellRenderer: LinkButtonOrLabel_LabelBatchInput,
      },
    ],
  },
];

export default uploadSveletColumn;
