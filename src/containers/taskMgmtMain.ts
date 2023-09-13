import App from './svelte/taskMgmtMain.svelte';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const app = new App({
  target: document.getElementById('root'),
});

export default app;
