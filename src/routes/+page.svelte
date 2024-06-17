<script lang="ts">
	import { Button } from 'svelte-ux';
	import { BoardColumn, Card } from '$classes';
	import { Board } from '$components'

	let board: Array<BoardColumn> = [
		new BoardColumn("to do",[
			new Card("Test 1"),
			new Card("Test 2"),
			new Card("Test 3")
		]),
		new BoardColumn("Doing",[
			new Card("Test 4"),
			new Card("Test 5"),
			new Card("Test 6")
		]),
		new BoardColumn("Done",[])
	];

	let handleBoardUpdate = (newBoard: Array<BoardColumn>) => {
		board = newBoard;
	}

</script>

<main class="p-2 grid place-items-center content-center">
	<h1 class="text-2xl font-semibold mb-2">Welcome to a ✨Kanban App✨</h1>
	<div>
		<Board columns={board} onFinalUpdate={handleBoardUpdate}/>
	</div>
</main>
