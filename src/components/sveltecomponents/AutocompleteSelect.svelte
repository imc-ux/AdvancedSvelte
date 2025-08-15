<script>
  export let onSubmit = () => {};
  export let onInput = () => {};
  export let name;
  export let getValue = (option) => option;
  export let predicate = (results, search = "") =>
    results.filter((result) =>
      getValue(result).toLowerCase().includes(search.toLowerCase())
    );
  export let options = [];
  export let isSelectRequired = false;
  export let classes = {};
  export let value = "--请选择--";
  export let listId = Date.now().toString();
  export let inputId;
  export let placeholder = "";
  export let isExpanded = false;
  export let width = 570;
  export let height = 24;

  let modifierLabelWidth;
  let inputRef;
  let highlightIndex = 0;
  let containerHeight;

  $: props = {
    ...$$restProps,
    style: `${getWidthOrHeight("width", width)};${getWidthOrHeight(
      "height",
      height
    )}`,
  };

  function getWidthOrHeight(type, value) {
    switch (typeof value) {
      case "string":
        return `${type}:${value}`;
      case "number":
        return `${type}:${value}px`;
      default:
        break;
    }
  }

  const handleExpandResults = () => {
    highlightIndex = 0;
    isExpanded = true;
  };

  const hideResults = () => {
    isExpanded = false;

    if (
      isSelectRequired &&
      !options.find((option) => getValue(option) === value)
    ) {
      value = "";
      onInput(value);
    }
  };

  const handleInput = (event) => {
    onInput(event);
    handleExpandResults();
  };

  const handleKeyDown = ({ key }) => {
    switch (key) {
      case "Escape":
        hideResults();
        break;
      case "ArrowUp":
        if (isExpanded && highlightIndex === 0) {
          highlightIndex = matches.length - 1;
        } else {
          highlightIndex -= 1;
        }
        break;
      case "ArrowDown":
        if (!value && !isExpanded) {
          handleExpandResults();
          break;
        }

        if (isExpanded && highlightIndex === matches.length - 1) {
          highlightIndex = 0;
        } else {
          highlightIndex += 1;
        }
        break;
      case "Tab":
        hideResults();
        break;
      case "Enter":
        handleSubmit(matches[highlightIndex] || value);
        break;
      default:
        return;
    }
  };

  const handleSubmit = (match) => {
    if (!match) return;
    onSubmit(match);
    value = getValue(match);
    hideResults();
  };

  $: matches = predicate(options, value);
</script>

<div
  class="svelte-autocomplete-select {classes.container ?? ''}"
  bind:clientHeight={containerHeight}>
  <input
    id={inputId}
    type="text"
    {...props}
    class="svelte-autocomplete-select-input {classes.input ?? ''}"
    bind:value
    bind:this={inputRef}
    on:keydown={handleKeyDown}
    on:input={handleInput}
    on:click={handleExpandResults}
    aria-autocomplete="list"
    aria-controls={listId}
    autocapitalize="none"
    autocomplete="off"
    {placeholder}
    {name} />
  <span bx--list-box__label
    ><svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="currentColor"
      preserveAspectRatio="xMidYMid meet"
      width="16"
      height="16"
      aria-hidden="true"
      class="bx--select__arrow"
      ><path d="M16 22L6 12 7.4 10.6 16 19.2 24.6 10.6 26 12z" /></svg
    ></span>
  <slot name="icon" {value} {isExpanded} />
  <!-- svelte-ignore a11y-role-has-required-aria-props -->
  <div
    class:isExpanded
    class="svelte-autocomplete-results-container {classes.results ?? ''}"
    role="combobox"
    aria-expanded={isExpanded}
    aria-owns={listId}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      class="svelte-autocomplete-select-overlay {classes.overlay ?? ''}"
      on:click={hideResults}
      style="position: absolute;" />
    <ul
      id={listId}
      class="svelte-autocomplete-select-list {classes.list ??
        ''} {matches?.length > 0 ? 'has-options' : ''}"
      style="top: {containerHeight}px;height:100px;overflow-y:auto;z-index:9100;"
      role="listbox">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      {#each matches as match, index (match)}
        <slot name="option" {matches} {match} {index} {handleSubmit}>
          <li
            class="svelte-autocomplete-select-option {classes.option ?? ''}"
            on:click={() => handleSubmit(match)}
            aria-selected={index === highlightIndex}
            role="option">
            {getValue(match)}
          </li>
        </slot>
      {/each}
    </ul>
  </div>
</div>

<style lang="scss">
  :global(.svelte-autocomplete-select) {
    display: inline-block;
    position: relative;    
    border-radius: 0.25rem;    
    display: flex;
    align-items: center;
    height: 30px;
    padding-top: 0px;
    padding-bottom: 0px;
  }

  :global(.svelte-autocomplete-select-input) {
    outline: none !important;
    color: #212121;
    border: 1px solid #bebebe;
    height: 30px;
    padding: 0;

    cursor: pointer;
    padding-left: 1rem;
    font-size: 14px;
  }  

  :global(.svelte-autocomplete-results-container) {
    display: none;
  }

  :global(.svelte-autocomplete-results-container.isExpanded) {
    display: block;
  }

  :global(.svelte-autocomplete-select-overlay) {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
  }

  :global(.svelte-autocomplete-select-list) {
    width: calc(100% - 2px);
    position: absolute;
    left: 0;
    right: 0;
    top: 1rem;
    list-style-type: none;
    border: 1px solid transparent;
    background-color: transparent;
    color: #212121;
    border-radius: 0 0 0.1rem 0.1rem;
    padding-left: 0;
    margin: 0;
    z-index: 10;
    text-align: left;
  }

  :global(.svelte-autocomplete-select-list.has-options) {
    border-color: #bebebe;
    background-color: #fff;
  }

  :global(.svelte-autocomplete-select-option) {
    padding-left: 1rem;
    user-select: none;
    cursor: pointer;
    font-size: 14px;
    height: 26px;
    line-height: 26px;
  }

  :global(.svelte-autocomplete-select-option span) {
    font-weight: bold;
    color: #212121;
  }  
</style>
