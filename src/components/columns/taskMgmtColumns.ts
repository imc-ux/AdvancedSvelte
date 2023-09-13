import { LinkRenderer, LabelRenderer, IconButtonRenderer, ProgressBarRenderer } from '@/components/renderers/index';

const taskPageManageColumns = [
  {
    headerName: '标题',
    field: 'taskTitle',
    width: 400,
    headerClass: ['center-aligned', 'ag-header'],
    cellClass: ['cell-left-align', 'cell-border'],
    cellRenderer: LinkRenderer,
  },
  {
    headerName: '负责人',
    field: 'userName',
    width: 350,
    headerClass: ['center-aligned', 'ag-header'],
    cellClass: ['cell-left-align', 'cell-border'],
    cellRenderer: LabelRenderer,
  },
  {
    headerName: '开始日期',
    field: 'startTime',
    width: 250,
    headerClass: ['center-aligned', 'ag-header'],
    cellClass: ['cell-center-align', 'cell-border'],
  },
  {
    headerName: '结束日期',
    field: 'endTime',
    width: 250,
    headerClass: ['center-aligned', 'ag-header'],
    cellClass: ['cell-center-align', 'cell-border'],
  },
  {
    headerName: '进度',
    field: 'taskProgress',
    width: 370,
    headerClass: ['center-aligned', 'ag-header'],
    cellClass: ['cell-center-align', 'cell-border'],
    cellRenderer: ProgressBarRenderer,
  },
  {
    headerName: '状态',
    field: 'status',
    width: 150,
    headerClass: ['center-aligned', 'ag-header'],
    cellClass: ['cell-center-align', 'cell-border', 'status-color'],
    cellRenderer: LabelRenderer,
  },
  {
    headerName: '详细',
    field: 'modifyFlag',
    width: 150,
    headerClass: ['center-aligned', 'ag-header'],
    cellClass: ['cell-center-align', 'cell-border'],
    cellRenderer: IconButtonRenderer,
  },
];

export default taskPageManageColumns;
