<script lang="ts">
	import { flip } from 'svelte/animate';
  import { dndzone, setDebugMode } from 'svelte-dnd-action';
	import Column from "./Column.svelte";
  import { type Board, type List, type Task, } from '$lib/types';
	const flipDurationMs = 150;

  //setDebugMode(true);
	
  export let lists: List[];

	// will be called any time a card or a column gets dropped to update the parent data
	export let onFinalUpdate: (newLists: List[]) => void;
 
  function handleDndConsiderColumns(e: CustomEvent<DndEvent<List>>) {
    lists = e.detail.items;
  }
  function handleDndFinalizeColumns(e: CustomEvent<DndEvent<List>>) {
		onFinalUpdate(e.detail.items);
  }
 	function handleItemFinalize(columnIdx: number, newItems: Task[]) {
		lists[columnIdx].tasks = newItems;
    onFinalUpdate([...lists]);
	}
</script>
<style lang="postcss">
    .board {
        height: 85vh;
        width: 100%;
        padding: 0.5em;
    }
    .column {
        height: 100%;
        width: 300px;
        padding: 0.5em;
        margin: 0.5em;
        float: left; 
    }
</style>

<section class="board" use:dndzone={{items:lists, flipDurationMs, type:'column',dropTargetStyle: {"outline":"1px"}}}
  on:consider={handleDndConsiderColumns} on:finalize={handleDndFinalizeColumns}>

    {#each lists as list, idx (list.id)}
  		<div class="column" animate:flip="{{duration: flipDurationMs}}" >    
				<Column name={list.name} items={list.tasks} listId={list.id} onDrop={(newItems) => handleItemFinalize(idx, newItems)} />
			</div>
    {/each}
</section>