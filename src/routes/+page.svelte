<script lang="ts">
	import { Button } from 'svelte-ux';
	import {type Board, BasicBoard, type List } from '$lib/types';
	import BoardCpnt from '$lib/components/Board.svelte'

	let board: Board = BasicBoard


	let handleBoardUpdated = (newLists: List[]) => {
		board.lists = newLists;
	}

</script>

<main class="p-2 grid place-items-center content-center">
	<h1 class="text-2xl font-semibold mb-2">Welcome to a ✨Kanban App✨</h1>
	<div>
		<BoardCpnt lists={board.lists} onFinalUpdate={handleBoardUpdated}/>
	</div>
</main>
