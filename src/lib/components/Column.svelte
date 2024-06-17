<script lang="ts">
	import { flip } from 'svelte/animate';
    import { dndzone } from 'svelte-dnd-action';
    import {BoardColumn,Card} from '$classes'
	const flipDurationMs = 150;

    // Components parameter
    export let column: BoardColumn;
	export let onDrop: (newItems: Array<Card>) => void;

	let name: string = column.name;
	let items: Array<Card> = column.items;
	
	function handleDndConsiderCards(e: CustomEvent<DndEvent<Card>>) {
        //console.warn("got consider", name); 
        items = e.detail.items;
    }
    function handleDndFinalizeCards(e: CustomEvent<DndEvent<Card>>) {
        onDrop(e.detail.items);
    }
</script>
<style>
	.wrapper {
		height: 100%;
		width: 100%;
		/*Notice we make sure this container doesn't scroll so that the title stays on top and the dndzone inside is scrollable*/
		overflow-y: hidden;
	}
	.column-content {
        height: calc(100% - 2.5em);
        /* Notice that the scroll container needs to be the dndzone if you want dragging near the edge to trigger scrolling */
        overflow-y: scroll;
    }
    .column-title {
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
        background-color: #dddddd;
        border: 1px solid #ffffff ;
    }
</style>
<div class='wrapper'>
 	<div class="column-title">
		{name}
	</div>
	<div class="column-content" use:dndzone={{items, flipDurationMs, zoneTabIndex: -1}}
     	on:consider={handleDndConsiderCards} 
		on:finalize={handleDndFinalizeCards}>
		
        {#each items as item (item.id)}
            <div class="card" animate:flip="{{duration: flipDurationMs}}" >
                id= {item.id} name= {item.name}
            </div>
        {/each}
    </div>
</div>