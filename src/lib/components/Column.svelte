<style lang="postcss">
	.wrapper {
		height: 100%;
		width: 100%;
        position: relative;
        @apply rounded-lg;
        @apply bg-neutral-content bg-opacity-25;
		/*Notice we make sure this container doesn't scroll so that the title stays on top and the dndzone inside is scrollable*/
		overflow-y: hidden;
	}
	.list-content {
        height: calc(100% - 8em);
        /* Notice that the scroll container needs to be the dndzone if you want dragging near the edge to trigger scrolling */
        overflow-y: scroll;
    }
    .list-title {
		height: 2.5em;
		font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .card {
        height: 3em;
        width: 100%;
        margin: 0.4em 0;
        display: flex;
        justify-content: center;
        align-items: center;
        @apply bg-secondary;
        @apply text-secondary-content;
    }

    :global(.droppableColumn){
        @apply bg-neutral-content bg-opacity-10;
    }


</style>
<script lang="ts">
    import {currentlyAddingTaskStore} from '$lib/stores';
	import { flip } from 'svelte/animate';
    import { dndzone,  TRIGGERS, SHADOW_ITEM_MARKER_PROPERTY_NAME } from 'svelte-dnd-action';
    import {createEventDispatcher} from 'svelte';
    import { Separator } from "bits-ui";
    import {type Task} from '$lib/types';
    import { clickOutside } from '$lib/utils';
    
	const flipDurationMs = 200;

    // Components parameter
    export let name: string;
	export let items: Task[];
    export let listId: number;
	export let onDrop: (newItems: Task[]) => void;

	
	function handleDndConsiderCards(e: CustomEvent<DndEvent<Task>>) {
        items = e.detail.items;
    }
    function handleDndFinalizeCards(e: CustomEvent<DndEvent<Task>>) {
        onDrop(e.detail.items);
        /*const {id, trigger} = e.detail.info;
			  switch(trigger) {
						case(TRIGGERS.DROPPED_INTO_ZONE):
						case(TRIGGERS.DROPPED_OUTSIDE_OF_ANY): {
							console.log(`item ${id} was added to list ${listId}`);
							break;
						}
						case(TRIGGERS.DROPPED_INTO_ANOTHER): {
							console.log(`item ${id} was taken out of list ${listId}`);
							break;
						}
					default: console.log("this basically never happens");
				}*/ 
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
</script>

<div class='wrapper'>
 	<div class="list-title">
		{name}
	</div>
    <div class="divider mb-0 mt-0"/>
	<div class="list-content" use:dndzone={{items, flipDurationMs, zoneTabIndex: -1,
        dropTargetStyle: {"outline":"0px"},dropTargetClasses: ["droppableColumn"]}}
     	on:consider={handleDndConsiderCards} 
		on:finalize={handleDndFinalizeCards}>


		<!-- TODO: Task Component -->
        {#each items as item (item.id)}
            <div class="card" animate:flip="{{duration: flipDurationMs}}" >
                {item.name}
            </div>
        {/each}
        
    </div>

    <!-- FIXME: button and input text not centered--> 
    <div class="w-11/12 left-0 right-0 ml-auto mr-auto absolute bottom-2">
        {#if !isAddingTask}
            <button class="btn btn-block bg-transparent border-transparent"
            on:click={handleAddTaskSwitch}>Add a new Task</button>
        {:else}
            <input id="task_name_input" type="text" placeholder="Enter a title for this Task..."
            class="input max-w-xs" autocomplete="off" 
            use:clickOutside on:click_outside on:keydown={handleTaskNameInputKeydown} use:inputinit/>
        {/if}
    </div>

</div>