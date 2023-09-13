<!-- 
/**
* Summary: Divider控件
* Created: 2022/04/29
* Author1: lixiaozheng
* Author2:
*/
-->
<script>
	export let column = false;
</script>


<div class={column ? "vertical-line" : "horizontal-line"}></div>

<style>
	.horizontal-line {
	  width:  100%;
    height: 0.0625rem;
    background-color: #ccc;
  }
  .vertical-line {
	  width:  0.0625rem;
    height: 100%;
    background-color: #ccc;
  }
</style>