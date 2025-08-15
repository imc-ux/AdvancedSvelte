import { CheckRenderer, LinkRenderer, SelectRenderer, LabelRenderer, Image } from '@/components/renderers/index';
import { blockFlagList } from '@/constant/constant';
import { HeaderCheckRenderer } from "@/components/headerRenderers/Header_CheckBox";

const userMgmtColumns = [
  {
    headerName: '',
    field: 'selected',
    width: 150,
    cellRenderer: CheckRenderer,
    headerComponent: HeaderCheckRenderer,
    headerClass: ['center-aligned', 'ag-header'],
    cellClass: ['cell-center-align', 'cell-border'],
  },
  {
    headerName: '头像',
    field: 'figure',
    width: 170,
    headerClass: ['center-aligned', 'ag-header'],
    cellClass: ['cell-center-align', 'cell-border', 'cell-image'],
    cellRenderer: Image,
  },
  {
    headerName: 'ID',
    field: 'id',
    width: 400,
    cellRenderer: LinkRenderer,
    headerClass: ['center-aligned', 'ag-header'],
    cellClass: ['cell-center-align', 'cell-border'],
  },
  {
    headerName: '姓名',
    field: 'name',
    width: 350,
    cellRenderer: LinkRenderer,
    headerClass: ['center-aligned', 'ag-header'],
    cellClass: ['cell-center-align', 'cell-border'],
  },
  {
    headerName: '类型',
    field: 'usertype',
    width: 250,
    headerClass: ['center-aligned', 'ag-header'],
    cellClass: ['cell-center-align', 'cell-border'],
    cellRenderer: LabelRenderer,
    key: 'usertype',
  },
  {
    headerName: '注销',
    field: 'blockflag',
    width: 250,
    headerClass: ['center-aligned', 'ag-header'],
    cellClass: ['cell-left-align', 'cell-border'],
    cellRenderer: SelectRenderer,
    options: blockFlagList,
    key: 'id',
    labelName: 'value',
    disabled: false,
  },

  {
    headerName: 'IP',
    field: 'ip',
    width: 350,
    cellRenderer: LabelRenderer,
    headerClass: ['center-aligned', 'ag-header'],
    cellClass: ['cell-center-align', 'cell-border', 'status-color'],
  },
];

export default userMgmtColumns;
