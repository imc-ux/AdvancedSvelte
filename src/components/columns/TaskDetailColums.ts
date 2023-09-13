import { LabelRenderer } from '@/components/renderers/index';

const taskDetailColumns = [
  {
    headerName: '修改类型',
    field: 'changeItemName',
    width: 30,
    headerClass: ['center-aligned', 'ag-header'],
    cellClass: ['cell-center-align', 'cell-border'],
  },
  {
    headerName: '值',
    field: 'changeContent',
    width: 30,
    headerClass: ['center-aligned', 'ag-header'],
    cellClass: ['cell-center-align', 'cell-border'],
    cellRenderer: LabelRenderer,
  },
  {
    headerName: '备注',
    field: 'changeRemark',
    width: 50,
    headerClass: ['center-aligned', 'ag-header'],
    cellClass: ['cell-left-align', 'cell-border'],
    cellRenderer: LabelRenderer,
  },
  {
    headerName: '修改者',
    field: 'changerUserName',
    width: 30,
    headerClass: ['center-aligned', 'ag-header'],
    cellClass: ['cell-center-align', 'cell-border'],
  },
  {
    headerName: '修改时间',
    field: 'changeDate',
    width: 50,
    headerClass: ['center-aligned', 'ag-header'],
    cellClass: ['cell-center-align', 'cell-border'],
  },
];

export default taskDetailColumns;
