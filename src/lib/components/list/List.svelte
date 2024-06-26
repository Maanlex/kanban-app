<style lang="postcss">
	.wrapper {
		height: 100%;
		width: 100%;
        position: relative;
        @apply rounded-lg;
        @apply bg-neutral-400 bg-opacity-25;
		/*Notice we make sure this container doesn't scroll so that the title stays on top and the dndzone inside is scrollable*/
		overflow-y: hidden;
	}
	.list-content {
        height: calc(100% - 9em);
        /* Notice that the scroll container needs to be the dndzone if you want dragging near the edge to trigger scrolling */
        overflow-y: scroll;
    }
    .list-header {
		height: 4em;
        width: 100%;
		font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    :global(.droppableColumn){
        @apply bg-neutral-content bg-opacity-10;
    }


</style>
<script lang="ts">
    import {currentlyAddingTaskStore} from '$lib/stores';
	import { flip } from 'svelte/animate';
    import { dndzone,  TRIGGERS, SHADOW_ITEM_MARKER_PROPERTY_NAME } from 'svelte-dnd-action';
    import {createEventDispatcher, onMount} from 'svelte';
    import {List, Task} from '$lib/entities';
    import { clickOutside } from '$lib/utils';
	import TaskCard from '$lib/components/task/TaskCard.svelte';
	import { isDragging, listNameChange } from '$lib/stores/store';
	import ListDropdownMenu from './ListDropdownMenu.svelte';
    
	const flipDurationMs = 200;

    // Components parameter
    export let list: List;
    let name: string = list.name;
    let items: Task[] = list.tasks;
    let listId: string = list.id;
    let tasksLimit: number = list.tasksLimit;
	export let onDrop: (newItems: Task[]) => void;
    export let getAllListsName: () => Array<{id: string, name: string}>


	function handleDndConsiderCards(e: CustomEvent<DndEvent<Task>>) {
        items = e.detail.items;
        $isDragging = true;
    }
    function handleDndFinalizeCards(e: CustomEvent<DndEvent<Task>>) {
        $isDragging = false;
        if(name !== actualListName){
            dispatch("edit-list-name");
        }
        onDrop(e.detail.items);
    }

    let isAddingTask: boolean = false;
    $: isAddingTask = ($currentlyAddingTaskStore == listId);

    let newTaskName: string;
    const dispatch = createEventDispatcher();
    let taskNameInput: HTMLInputElement;
    function inputinit(el: HTMLInputElement){
        taskNameInput = el;
        taskNameInput.focus();
    }

    function handleAddTaskSwitch(){
        dispatch("wants-add-task",listId);
    }

    function handleTaskNameInputKeydown(e: KeyboardEvent){
        switch(e.key){
            case "Enter":
                newTaskName = taskNameInput.value;
                if(newTaskName === "") dispatch("stop-add-task");
                else{
                    dispatch("add-task",{listId: listId, name: newTaskName});
                    taskNameInput.value = "";
                }
                break;
            case "Escape":
                dispatch("stop-add-task");
        }

    }

    function handleEditTask(e: CustomEvent<Task>){
        let newTask: Task = e.detail;
        const updatedTasks = items.map((task) =>{
            if(task.id == newTask.id) return newTask;
            else return task;
        })
        items = updatedTasks;
        onDrop(items);
    }
    function handleDeleteTask(e: CustomEvent<Task>){
        let deletedTask: Task = e.detail;
        const updatedTasks = items.filter((task) => task.id != deletedTask.id);
        items = updatedTasks;
        onDrop(items);
    }

    function transformDraggedElement(draggedEl?: HTMLElement, data?: Item, index?: number){
        draggedEl?.style.setProperty("outline", "0");
    }

    let listNameInput: HTMLInputElement;
    let isInputHidden: boolean = true;
    let actualListName: string = name;
    $: listNameInputState = isInputHidden ? "hidden" : "";
    $: listNameH2State = isInputHidden ? "" : "hidden"; 

    //$: isInputHidden, console.log(isInputHidden);
    

    function handleEditListName(){
            if(!isInputHidden){
                if(actualListName !== name){
                if(actualListName === "") actualListName = name;
                $listNameChange = {listId: listId, name: actualListName};
                if(!$isDragging) dispatch("edit-list-name");
                }
                isInputHidden = true;
            }

            
    }
    function handleListNameInputKeydown(e: KeyboardEvent){
        switch(e.key){
            case "Enter":
            case "Escape":
                handleEditListName();
                break;
        }
    }
    function handleListNameInputActivation(){

        isInputHidden = false;
        setTimeout(() => {
            listNameInput.focus();
            listNameInput.select();
        },15);
    }
    

</script>
<!-- TODO: change drop zone target -->
<div class='wrapper'>
 	<div class="list-header">

        <button class="absolute left-5 top-3 justify-start text-left {listNameH2State}" on:click={handleListNameInputActivation} type="button" aria-label="Edit column name">
            <h2 class="absolute bg-transparent w-52">{actualListName}</h2>
        </button>

        <input type="text" maxlength="22" class="absolute bg-transparent w-52 left-5 top-3 {listNameInputState}" bind:this={listNameInput}
        on:keydown={handleListNameInputKeydown} bind:value={actualListName}
        use:clickOutside on:click_outside={handleEditListName}
        on:focusout={handleEditListName}/>


        <ListDropdownMenu list={list} getAllListsName={getAllListsName}
        on:edit-list-name={handleListNameInputActivation} 
        on:edit-tasks-limit
        on:delete-list
        on:delete-all-tasks
        on:move-all-tasks
        on:move-all-tasks-new-list/>
    
        {#if tasksLimit>0}
            <h2 class="absolute left-5 top-9 {items.length>=tasksLimit ? "text-error" : "text-primary"}">
            {items.length + "/" + tasksLimit}</h2>
        {/if}
	</div>
    <div class="divider mb-0 mt-0"/>
	<div class="list-content" use:dndzone={{items, flipDurationMs, transformDraggedElement, zoneTabIndex: -1,
        dropTargetStyle: {"outline":"0px"},dropTargetClasses: ["droppableColumn"], }}
     	on:consider={handleDndConsiderCards} 
		on:finalize={handleDndFinalizeCards}>

        {#each items as item (item.id)}
            <div animate:flip="{{duration: flipDurationMs}}" >
                <TaskCard task={item} on:edit-task={handleEditTask} on:delete-task={handleDeleteTask}/>
            </div>
        {/each}
        
    </div>

    <div class="w-11/12 left-0 right-0 ml-auto mr-auto absolute bottom-2">
        {#if !isAddingTask}
            <button class="btn btn-block btn-ghost"
            on:click={handleAddTaskSwitch}>
                <span class="icon-[mdi--plus]" style="width: 1.2rem; height: 1.2rem;"></span>
                Add a new Task
            </button>
        {:else}
            <input id="task_name_input" type="text" placeholder="Enter a title for this Task..."
            class="input input-md w-full max-w-xs" autocomplete="off" 
            use:clickOutside on:click_outside on:keydown={handleTaskNameInputKeydown} use:inputinit/>
        {/if}
    </div>

</div>