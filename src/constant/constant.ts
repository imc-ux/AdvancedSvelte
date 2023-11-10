export const types = [
  { name: '--请选择--', code: '' },
  { name: 'Buyer主页', code: 'buyer' },
  { name: 'Supplier主页', code: 'supplier' },
  { name: 'GERP主页', code: 'gerp' },
  { name: 'BuyerEXP主页', code: 'buyerExp' },
  { name: 'MP主页', code: 'main' },
  { name: 'Popup', code: 'pop' },
  { name: 'Renderer', code: 'renderer' },
];

export const items = [
  { name: '20 Item', code: 20 },
  { name: '50 Item', code: 50 },
  { name: '100 Item', code: 100 },
];

export const itemPages = [
  { name: '20 Item', code: 20 },
  { name: '50 Item', code: 50 },
  { name: '100 Item', code: 100 },
];

export const urgencyList = [
  { name: '--请选择--', id: '' },
  { name: '1', id: '1' },
  { name: '2', id: '2' },
  { name: '3', id: '3' },
  { name: '4', id: '4' },
  { name: '5', id: '5' },
];

export const progressTask = [
  { value: '发布', checked: true },
  { value: '进行中', checked: true },
  { value: '完成', checked: false },
];

export const statusTask = [
  { value: 'N', checked: true },
  { value: 'Y', checked: false },
];

export const status = ['提交', '已传45', '已传IDC'];

export const jtracNoTypeList = [
  { name: 'V2A', id: 'V2A' },
  { name: 'H5BUG', id: 'H5BUG' },
];

export const systemTypeList = [
  { name: 'mp', id: 'mp', module: '', imk: 'mp' },
  { name: 'buyer', id: 'buyer', module: 'h5_buyer.jsp', imk: 'buyer' },
  { name: 'gerp', id: 'gerp', module: 'gerp.jsp', imk: 'gerp' },
  {
    name: 'buyerExp',
    id: 'buyerExp',
    module: 'h5_buyerExp.jsp',
    imk: 'buyerExp',
  },
  {
    name: 'supplier',
    id: 'supplier',
    module: 'h5_supplier.jsp',
    imk: 'supplier',
  },
  { name: 'buyerMenu', id: 'buyerMenu', module: 'Buyer.jsp', imk: 'buyerMenu' },
  {
    name: 'buyerExpMenu',
    id: 'buyerExpMenu',
    module: 'BuyerExport.jsp',
    imk: 'buyerExpMenu',
  },
  {
    name: 'supplierMenu',
    id: 'supplierMenu',
    module: 'Supplier.jsp',
    imk: 'supplierMenu',
  },
  { name: '其他', id: '其他', module: '' },
];

export const mpManagementTypeList = [
  { code: '', name: '--请选择--' },
  { code: 'basic', name: 'Basic Management' },
  { code: 'voc', name: 'VOC' },
  { code: 'buyer', name: 'Buyer Management' },
  { code: 'supplier', name: 'Supplier Management' },
  { code: 'catalog', name: 'Catalog Management' },
  { code: 'salesPrice', name: 'Sales Price Management' },
  { code: 'purchasing', name: 'Purchasing Management' },
  { code: 'order', name: 'Order Management' },
  { code: 'delivery', name: 'Delivery Management' },
  { code: 'quality', name: 'Quality Management' },
  { code: 'logistics', name: 'Logistics Management' },
  { code: 'closing', name: 'Closing Management' },
  { code: 'payment', name: 'Payment Management' },
  { code: 'interface', name: 'Interface Management' },
  { code: 'risk', name: 'Risk Management' },
  { code: 'export', name: 'Export Management' },
  { code: 'proxyOperation', name: 'Proxy Operation Management' },
  { code: 'home', name: 'Home' },
];

export const spManagementTypeList = [
  { code: '', name: '--请选择--' },
  { code: 'basic', name: 'Basic Management' },
  { code: 'contract', name: 'Contract Management' },
  { code: 'delivery', name: 'Delivery Management' },
  { code: 'exchange', name: 'Exchange Management' },
  { code: 'interface', name: 'Interface Management' },
  { code: 'settle', name: 'Settle Management' },
  { code: 'home', name: 'Home' },
];

export const buyerManagementTypeList = [
  { code: '', name: '--请选择--' },
  { code: 'approval', name: 'Approval Management' },
  { code: 'basic', name: 'Basic Management' },
  { code: 'closing', name: 'Closing Management' },
  { code: 'delivery', name: 'Delivery Management' },
  { code: 'gr', name: 'GR Management' },
  { code: 'home', name: 'Home' },
  { code: 'purchasing', name: 'Purchasing Management' },
  { code: 'quotation', name: 'Quotation Management' },
  { code: 'settle', name: 'Settle Management' },
  { code: 'order', name: 'Order Management' },
];

export const expManagementTypeList = [
  { code: '', name: '--请选择--' },
  { code: 'quotation', name: 'Quotation Management' },
  { code: 'order', name: 'Order Management' },
  { code: 'delivery', name: 'Delivery Management' },
  { code: 'gr', name: 'GR Management' },
];

export const gerpManagementTypeList = [
  { code: '', name: '--请选择--' },
  { code: 'purchasing', name: 'Purchasing Management' },
  { code: 'order', name: 'Order Management' },
  { code: 'gr', name: 'GR Management' },
  { code: 'closing', name: 'Closing Management' },
];

export const managementTypeList = [
  { code: 'basic', name: 'Basic Management' },
  { code: 'voc', name: 'VOC' },
  { code: 'buyer', name: 'Buyer Management' },
  { code: 'supplier', name: 'Supplier Management' },
  { code: 'catalog', name: 'Catalog Management' },
  { code: 'salesPrice', name: 'Sales Price Management' },
  { code: 'purchasing', name: 'Purchasing Management' },
  { code: 'order', name: 'Order Management' },
  { code: 'delivery', name: 'Delivery Management' },
  { code: 'quality', name: 'Quality Management' },
  { code: 'logistics', name: 'Logistics Management' },
  { code: 'closing', name: 'Closing Management' },
  { code: 'payment', name: 'Payment Management' },
  { code: 'interface', name: 'Interface Management' },
  { code: 'risk', name: 'Risk Management' },
  { code: 'exchange', name: 'Exchange Management' },
  { code: 'export', name: 'Export Management' },
  { code: 'proxyOperation', name: 'Proxy Operation Management' },
  { code: 'home', name: 'Home' },
  { code: 'approval', name: 'Approval Management' },
  { code: 'contract', name: 'Contract Management' },
  { code: 'gr', name: 'GR Management' },
  { code: 'quotation', name: 'Quotation Management' },
  { code: 'settle', name: 'Settle Management' },
];

export const userTypeList = [
  { id: '', value: '' },
  { id: 'U', value: '前台' },
  { id: 'P', value: '后台' },
];

export const blockFlagList = [
  { id: '', value: '' },
  { id: 'Y', value: 'Y' },
  { id: 'N', value: 'N' },
];
