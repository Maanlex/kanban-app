<script lang="ts">
	import {type Board, BasicBoard, type List } from '$lib/types';
	import BoardCpnt from '$lib/components/Board.svelte'
	import { boardStore } from '$lib/stores';

	$boardStore = BasicBoard;


	let handleBoardUpdated = (newLists: List[]) => {
		$boardStore.lists = newLists;
	}
	

</script>

<main class="p-2 grid">
	<div>
		{#key $boardStore.lists}
			<BoardCpnt lists={$boardStore.lists} onFinalUpdate={handleBoardUpdated}/>
		{/key}
	</div>
</main>
