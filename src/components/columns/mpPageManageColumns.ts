import { LinkRenderer, LabelRenderer } from "@/components/renderers/index";
import {
  LinkButton_Label,
  LinkButton_LinkButton,
  Label_Label,
} from "@/components/renderers/index";

const pageManageColumns = [
  {
    headerName: "ID",
    field: "code",
    width: 300,
    headerClass: ["center-aligned", "ag-header"],
    cellClass: ["cell-left-align", "cell-border"],
    cellRenderer: LinkRenderer,
  },
  {
    headerName: "Name",
    field: "name",
    width: 300,
    headerClass: ["center-aligned", "ag-header"],
    cellClass: ["cell-left-align", "cell-border"],
    cellRenderer: LabelRenderer,
  },
  {
    headerName: "Management",
    field: "managementName",
    width: 300,
    headerClass: ["center-aligned", "ag-header"],
    cellClass: ["cell-center-align", "cell-border"],
    cellRenderer: LabelRenderer,
  },
  {
    headerName: "Type",
    field: "typeName",
    width: 100,
    headerClass: ["center-aligned", "ag-header"],
    cellClass: ["cell-center-align", "cell-border"],
    cellRenderer: LabelRenderer,
  },
  {
    headerName: "页面负责人",
    field: "developerName",
    width: 150,
    headerClass: ["center-aligned", "ag-header"],
    cellClass: ["cell-center-align", "cell-border"],
    cellRenderer: LinkRenderer,
  },
  {
    headerName: "检查负责人",
    field: "reviewerName",
    width: 150,
    headerClass: ["center-aligned", "ag-header"],
    cellClass: ["cell-center-align", "cell-border"],
    cellRenderer: LinkRenderer,
  },
];

const pageManageDoubleLineColumns = [
  {
    headerName: "ID",
    headerClass: ["center-aligned", "ag-header"],
    cellClass: ["cell-center-align", "cell-border"],
    children: [
      {
        headerName: "Name",
        width: 300,
        field: "code*name",
        upClassName: "hor-left",
        downClassName: "hor-left",
        headerClass: ["center-aligned", "ag-header"],
        cellClass: ["cell-center-align", "cell-border"],
        cellRenderer: LinkButton_Label,
      },
    ],
  },
  {
    headerName: "Management",
    headerClass: ["center-aligned", "ag-header"],
    cellClass: ["cell-center-align", "cell-border"],
    children: [
      {
        headerName: "Type",
        width: 300,
        field: "managementName*typeName",
        headerClass: ["center-aligned", "ag-header"],
        cellClass: ["cell-center-align", "cell-border"],
        cellRenderer: Label_Label,
      },
    ],
  },
  {
    headerName: "页面负责人",
    headerClass: ["center-aligned", "ag-header"],
    cellClass: ["cell-center-align", "cell-border"],
    children: [
      {
        headerName: "检查负责人",
        width: 200,
        field: "developerName*reviewerName",
        headerClass: ["center-aligned", "ag-header"],
        cellClass: ["cell-center-align", "cell-border"],
        cellRenderer: LinkButton_LinkButton,
      },
    ],
  },
  {
    headerName: "测试负责人",
    headerClass: ["center-aligned", "ag-header"],
    cellClass: ["cell-center-align", "cell-border"],
    children: [
      {
        headerName: "TC",
        width: 200,
        field: "testName*isTested",
        headerClass: ["center-aligned", "ag-header"],
        cellClass: ["cell-center-align", "cell-border"],
        cellRenderer: LinkButton_Label,
      },
    ],
  },
];

export default pageManageDoubleLineColumns;
