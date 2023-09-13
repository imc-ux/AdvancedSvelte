<!-- 
/**
* Summary: DateField控件
* Created: 2022/07/06
* Author1: ljh
* Author2:
*/
-->
<script>
  import { DatePicker, DatePickerInput } from "carbon-components-svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  $: props = {
    ...$$restProps,
  };

  function onDateChangeHandler(e) {
    dispatch("change", { data: e.target });
  }
</script>

<DatePicker hideLabel datePickerType="range" dateFormat="Y-m-d" on:change={onDateChangeHandler}>
  <DatePickerInput placeholder="yyyy-mm-dd"/>
  <DatePickerInput placeholder="yyyy-mm-dd"/>
</DatePicker>