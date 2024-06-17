<script lang="ts">
	import { flip } from 'svelte/animate';
  import { dndzone, setDebugMode } from 'svelte-dnd-action';
	import Column from "./Column.svelte";
  import { BoardColumn, Card } from '$classes';
	const flipDurationMs = 300;

  setDebugMode(true);
	
  export let columns: Array<BoardColumn>;
	// will be called any time a card or a column gets dropped to update the parent data
	export let onFinalUpdate: (newItems: Array<BoardColumn>) => void;
 
  function handleDndConsiderColumns(e: CustomEvent<DndEvent<BoardColumn>>) {
    columns = e.detail.items;
  }
  function handleDndFinalizeColumns(e: CustomEvent<DndEvent<BoardColumn>>) {
    onFinalUpdate(e.detail.items);
  }
 	function handleItemFinalize(columnIdx: number, newItems: Array<Card>) {
		columns[columnIdx].items = newItems;
		onFinalUpdate([...columns]);
	}
</script>
<style>
    .board {
        height: 90vh;
        width: 100%;
        padding: 0.5em;
    }
    .column {
        height: 100%;
        width: 300px;
        padding: 0.5em;
        margin: 0.5em;
        float: left;
        border: 1px solid #333333;
    }
</style>

<section class="board" use:dndzone={{items:columns, flipDurationMs, type:'column'}} on:consider={handleDndConsiderColumns} on:finalize={handleDndFinalizeColumns}>
    {#each columns as boardColumn, idx (boardColumn.id)}
  		<div class="column" animate:flip="{{duration: flipDurationMs}}" >    
				<Column column={boardColumn} onDrop={(newItems) => handleItemFinalize(idx, newItems)} />
			</div>
    {/each}
</section>