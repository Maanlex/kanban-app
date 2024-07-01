<script lang="ts">
	import {TestBoard, List } from '$lib/entities';
	import BoardCpnt from '$lib/components/Board.svelte'
	import { boardStore } from '$lib/stores';

	$boardStore = TestBoard();


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
