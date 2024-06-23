<script lang="ts">
	import { flip } from 'svelte/animate';
  	import { dndzone, setDebugMode } from 'svelte-dnd-action';
	import Column from "./Column.svelte";
  	import { type Board, type List, type Task, } from '$lib/types';
	import {currentlyAddingTaskStore} from '$lib/stores';
	import {clickOutside} from '$lib/utils'
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
	function transformDraggedElement(draggedEl?: HTMLElement, data?: Item, index?: number){
        draggedEl?.style.setProperty("outline", "0");
    }

	let isAddingList: boolean;
	let newListName: string;
	let listNameInput: HTMLInputElement;
    function inputinit(el: HTMLInputElement){
        listNameInput = el;
        listNameInput.focus();
    }
	function handleListNameInputKeydown(e: KeyboardEvent){
		switch(e.key){
            case "Enter":
                newListName = listNameInput.value;
                if(newListName === "") isAddingList = false;
                else{
					// TODO: id generation
					let id:number = Math.floor(Math.random() * 999999);
					let newList: List = {
						id:id,
						name: listNameInput.value,
						tasks: [],
						tasksLimit: -1
					};
					onFinalUpdate([...lists,newList]);
                    listNameInput.value = "";
					isAddingList = false;	
                }
                break;
            case "Escape":
				isAddingList = false;
        }
	}

</script>
<style lang="postcss">
    .board {
        height: 84vh;
        width: 100%;
		display: flex;
		overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
    }
	.actual-board{
		display: flex;
	}
    .column {
        height: 100%;
        width: 300px;
        padding: 0.5em;
        margin: 0.5em;
        //float: left; 
    }


</style>
<div class="board">
	<section class="actual-board" use:dndzone={{items:lists, flipDurationMs, 
	transformDraggedElement, type:'column',dropTargetStyle: {"outline":"1px"}}}
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
	<div class="column">
		{#if !isAddingList}
			<button class="btn btn-primary btn-block" on:click={() => {isAddingList = true}}>
				<span class="icon-[mdi--plus]" style="width: 1.2rem; height: 1.2rem;"></span>
				Add a new list 
			</button>
		{:else}
			<div class="addinglist-wrapper">
				<input id="list_name_input" type="text" placeholder="Enter a title for this List..."
				class="input max-w-xs" autocomplete="off" 
				use:clickOutside on:click_outside={() => {isAddingList = false}}
				on:keydown={handleListNameInputKeydown} use:inputinit/>
			</div>
		{/if}
	</div>
</div>