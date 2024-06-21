<script lang="ts">
	import { flip } from 'svelte/animate';
  	import { dndzone, setDebugMode } from 'svelte-dnd-action';
	import Column from "./Column.svelte";
  	import { type Board, type List, type Task, } from '$lib/types';
	import {currentlyAddingTaskStore} from '$lib/stores'
	const flipDurationMs = 150;

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

	const handleWantsToAddTask = (e: CustomEvent<number>) => {
		currentlyAddingTaskStore.set(e.detail);
	}

	const resetCurrentlyAddingTask = () => {
		currentlyAddingTaskStore.set(-1)
	}

	function handleAddTask(e: CustomEvent){
		// TODO: id generation
		let id:number = Math.floor(Math.random() * 999999);
		let newTask: Task = {id: id, name:e.detail.name};

		let list: List | undefined = lists.find((l) => l.id == e.detail.listId);
		if (list) {
			list.tasks.push(newTask);
			onFinalUpdate([...lists]);
		}
		
	}
</script>
<style lang="postcss">
    .board {
        height: 84vh;
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
				<Column name={list.name} items={list.tasks} listId={list.id}
				onDrop={(newItems) => handleItemFinalize(idx, newItems)} 
				on:wants-add-task={handleWantsToAddTask}
				on:click_outside= {resetCurrentlyAddingTask}
				on:stop-add-task= {resetCurrentlyAddingTask}
				on:add-task = {handleAddTask}/>
			</div>
    {/each}
</section>