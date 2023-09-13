import { LinkRenderer } from "@/components/renderers/index";

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
  },
  {
    headerName: "Management",
    field: "managementName",
    width: 300,
    headerClass: ["center-aligned", "ag-header"],
    cellClass: ["cell-center-align", "cell-border"],
  },
  {
    headerName: "Type",
    field: "typeName",
    width: 100,
    headerClass: ["center-aligned", "ag-header"],
    cellClass: ["cell-center-align", "cell-border"],
  },
  {
    headerName: "页面负责人",
    field: "developerName",
    width: 150,
    headerClass: ["center-aligned", "ag-header"],
    cellClass: ["cell-center-align", "cell-border"],
  },
  {
    headerName: "检查负责人",
    field: "reviewerName",
    width: 150,
    headerClass: ["center-aligned", "ag-header"],
    cellClass: ["cell-center-align", "cell-border"],
  },
];

export default pageManageColumns;
