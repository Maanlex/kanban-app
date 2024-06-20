<style lang="postcss">
	.wrapper {
		height: 100%;
		width: 100%;
		/*Notice we make sure this container doesn't scroll so that the title stays on top and the dndzone inside is scrollable*/
		overflow-y: hidden;
	}
	.list-content {
        height: calc(100% - 4em);
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
        height: 4em;
        width: 100%;
        margin: 0.4em 0;
        display: flex;
        justify-content: center;
        align-items: center;
        @apply bg-secondary;
        @apply text-secondary-content;
    }

    :global(.droppableColumn){
        @apply bg-base-300;
    }


</style>
<script lang="ts">
	import { flip } from 'svelte/animate';
    import { dndzone,  TRIGGERS, SHADOW_ITEM_MARKER_PROPERTY_NAME } from 'svelte-dnd-action';
    import { Button, Popover } from "bits-ui";
    import {type Task} from '$lib/types';
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
        const {id, trigger} = e.detail.info;
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
				} 
    }

    let newTaskName: string;
    function handleAddTask(){
        
    }
</script>

<div class='wrapper'>
 	<div class="list-title">
		{name}
	</div>
    <div class="divider"/>
	<div class="list-content" use:dndzone={{items, flipDurationMs, zoneTabIndex: -1,
        dropTargetStyle: {"outline":"0px"},dropTargetClasses: ["droppableColumn"]}}
     	on:consider={handleDndConsiderCards} 
		on:finalize={handleDndFinalizeCards}>
		
        {#each items as item (item.id)}
            <div class="card" animate:flip="{{duration: flipDurationMs}}" >
                id= {item.id} name= {item.name}
            </div>
            
        {/each}
        
    </div>

</div>