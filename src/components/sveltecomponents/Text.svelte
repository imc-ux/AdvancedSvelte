<!-- 
/**
* Summary: Text控件
* Created: 2022/04/29
* Author1: lixiaozheng
* Author2:
*/
-->
<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	
	export let singleLine = false;  // 是否只显示一行
	export let bold = false;

	function onTextClickHandler(e) {
		dispatch("click", {
			event: e,
		});
	}
</script>


<span class:single-line={singleLine} class:text-bold={bold} on:click={onTextClickHandler} {...$$restProps}>
	<slot></slot>
</span>

<style>
	.single-line {
		overflow: hidden;
  	white-space: nowrap;
  	text-overflow: ellipsis;
	}
	.text-bold {
		font-weight: 700;
	}
</style>