<script>
  import Grid from "./Grid.svelte";
  import ButtonRenderer from "./RendererButton.svelte";

  const svelteRenderer = (params) => {
    const element = document.createElement("span");
    new ButtonRenderer({
      target: element,
      props: {
        params,
      },
    });
    return element;
  };

  const columnDefs = [
    { field: "make" },
    { field: "price" },
    {
      field: "model",
      cellRenderer: svelteRenderer,
    },
  ];

  // specify the data
  const rowData = [
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxster", price: 72000 },
  ];

  const gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
  };

  function handlerButtonClick(e) {
    rowData[e.detail.rowIndex].price++;
    gridOptions.api.refreshCells();
  }
</script>

<div on:rendererClick={handlerButtonClick}>
  <Grid option={gridOptions} />
</div>
