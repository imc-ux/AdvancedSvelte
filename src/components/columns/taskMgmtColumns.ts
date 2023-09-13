// const taskPageManageColumns = [
//   {
//     value: '标题',
//     key: 'taskTitle',
//     width: '200px',
//   },
//   {
//     value: '负责人',
//     key: 'userName',
//     width: '250px',
//   },
//   {
//     value: '开始日期',
//     key: 'startTime',
//     width: '150px',
//   },
//   {
//     value: '结束日期',
//     key: 'endTime',
//     width: '150px',
//   },
//   {
//     value: '进度',
//     key: 'taskProgress',
//     width: '350px',
//   },
//   {
//     value: '状态',
//     key: 'status',
//     width: '150px',
//   },
//   {
//     value: '详细',
//     key: 'modifyFlag',
//     width: '150px',
//   },
// ];
import { LinkRenderer, LabelRenderer, IconButtonRenderer, ProgressBarRenderer } from '@/components/renderers/index';

// const svelteRenderer = (params: ICellRendererParams) => {
//   console.log('params', params);
//   const element = document.createElement('span');
//   if (params.value === 'Y') {
//     new IconButton({
//       target: element,
//     });
//     return element;
//   }
// };

const taskPageManageColumns = [
  {
    headerName: '标题',
    field: 'taskTitle',
    width: 400,
    headerClass: ['center-aligned', 'ag-header'],
    cellClass: ['cell-left-align', 'cell-border'],
    toolbar: 'taskTitle',
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
    cellClass: ['cell-center-align', 'cell-border'],
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
