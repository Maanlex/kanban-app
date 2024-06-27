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
    .list {
        height: 100%;
        width: 300px;
        padding: 0.5em;
        margin: 0.5em;
        //float: left; 
    }


</style>
<script lang="ts">
	import { flip } from 'svelte/animate';
  	import { dndzone, setDebugMode } from 'svelte-dnd-action';
	import ListCpnt from "./list/List.svelte";
  	import { type Board, type List, type Task, } from '$lib/types';
	import {currentlyAddingTaskStore} from '$lib/stores';
	import {clickOutside} from '$lib/utils'
	import { isDragging, listNameChange } from '$lib/stores/store';
	import { updated } from '$app/stores';
	const flipDurationMs = 150;

  	export let lists: List[];

	//$: lists, console.log(lists);
	

	// will be called any time a card or a list gets dropped to update the parent data
	export let onFinalUpdate: (newLists: List[]) => void;

	function getAllListsName(){
		let res = new Array<{id: number,name: string}>;
		res = lists.map((l) => {
			return {id: l.id, name: l.name};
		})
		return res
	}
 
	function handleDndConsiderColumns(e: CustomEvent<DndEvent<List>>) {
		$isDragging = true;
		lists = e.detail.items;
	}
  	function handleDndFinalizeColumns(e: CustomEvent<DndEvent<List>>) {
		$isDragging = false;
		lists = e.detail.items;
		if($listNameChange.listId != -1) handleEditListName();
		else onFinalUpdate(lists);
  	}
 	function handleItemFinalize(columnIdx: number, newItems: Task[]) {
		lists[columnIdx].tasks = newItems;
		if($listNameChange.listId != -1) handleEditListName();
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
    function inputinit(el: HTMLInputElement){
        el.focus();
    }
	function handleListNameInputKeydown(e: KeyboardEvent){
		switch(e.key){
            case "Enter":
                if(newListName === "") isAddingList = false;
                else{
					handleAddList(newListName);
					isAddingList = false;	
                }
                break;
            case "Escape":
				isAddingList = false;
        }
	}

	function handleAddList(newListName: string, tasks: Task[] = new Array<Task>){
		// TODO: id generation
		let id:number = Math.floor(Math.random() * 999999);
		let newList: List = {
			id:id,
			name: newListName,
			tasks: tasks,
			tasksLimit: 0
		};
		onFinalUpdate([...lists,newList]);
		return newList;
	}

	function handleEditListName(){
		let list: List | undefined = lists.find((l) => l.id == $listNameChange.listId);
		if (list) {
			list.name = $listNameChange.name;
			const updatedLists = lists.map((l) => {
				if(l.id == $listNameChange.listId) return list;
				else return l; 
			});
			lists = updatedLists;
			onFinalUpdate(lists);
			$listNameChange.listId = -1;
		}
	}
	function handleEditTasksLimit(e: CustomEvent){
		let list: List | undefined = lists.find((l) => l.id == e.detail.listId);
		if(list){
			list.tasksLimit = e.detail.tasksLimit
			const updatedLists = lists.map((l) => {
				if(l.id == list.id) return list;
				else return l; 
			});
			lists = updatedLists;
			onFinalUpdate(lists);
		}
	}
	function handleDeleteList(e: CustomEvent<number>){
		const updatedLists = lists.filter((l) => l.id != e.detail);
		lists = updatedLists;
		onFinalUpdate(lists);
	}
	function handleDeleteAllTasks(e: CustomEvent<number>){
		let list: List | undefined = lists.find((l) => l.id == e.detail);
		if(list){
			list.tasks = new Array<Task>;
			const updatedLists = lists.map((l) => {
				if(l.id == list.id) return list;
				else return l; 
			});
			lists = updatedLists;
			onFinalUpdate(lists);
		}
	}
	function handleMoveAllTasks(e: CustomEvent){
		let oldList: List | undefined = lists.find((l) => l.id == e.detail.oldList);
		let newList: List | undefined = lists.find((l) => l.id == e.detail.newList);
		if(oldList && newList && oldList.tasks.length > 0){
			newList.tasks = [...newList.tasks,...oldList.tasks];
			oldList.tasks = new Array<Task>;
			const updatedLists = lists.map((l) => {
				if(l.id == oldList.id) return oldList;
				if(l.id == newList.id) return newList;
				else return l;
			})
			lists = updatedLists;
			onFinalUpdate(lists)
		}
	}
	function handleMoveAllTasksNewList(e: CustomEvent){
		let oldList: List | undefined = lists.find((l) => l.id == e.detail.oldList);
		if(oldList && oldList.tasks.length > 0){
			let newList: List = handleAddList(e.detail.newListName,oldList.tasks);
			oldList.tasks = new Array<Task>;
			let updatedLists = lists.map((l) => {
				if(l.id == oldList.id) return oldList;
				else return l;
			});
			updatedLists = [...updatedLists,newList];
			lists = updatedLists;
			onFinalUpdate(lists);
		}
	}
</script>

<div class="board">
	<section class="actual-board" use:dndzone={{items:lists, flipDurationMs, 
	transformDraggedElement, type:'column',dropTargetStyle: {"outline":"1px"}}}
	on:consider={handleDndConsiderColumns} on:finalize={handleDndFinalizeColumns}>

		{#each lists as list, idx (list.id)}
			<div class="list" animate:flip="{{duration: flipDurationMs}}" >    
					<ListCpnt list={list}
					onDrop={(newItems) => handleItemFinalize(idx, newItems)} 
					getAllListsName= {getAllListsName}
					on:wants-add-task={handleWantsToAddTask}
					on:click_outside= {resetCurrentlyAddingTask}
					on:stop-add-task= {resetCurrentlyAddingTask}
					on:add-task = {handleAddTask}
					on:edit-list-name = {handleEditListName}
					on:edit-tasks-limit= {handleEditTasksLimit}
					on:delete-list= {handleDeleteList}
					on:delete-all-tasks= {handleDeleteAllTasks}
					on:move-all-tasks = {handleMoveAllTasks}
					on:move-all-tasks-new-list = {handleMoveAllTasksNewList}/>
			</div>
		{/each}
	</section>
	<div class="list">
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
				on:keydown={handleListNameInputKeydown} use:inputinit bind:value={newListName}/>
			</div>
		{/if}
	</div>
</div>