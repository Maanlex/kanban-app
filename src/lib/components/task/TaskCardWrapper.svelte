<style lang="postcss">
    .card {
        height: fit-content;
        width: 95%;
        margin: 0.4em 0;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        @apply rounded-lg;
        @apply bg-base-100;
        @apply text-base;
        @apply ml-auto mr-auto;
    }
</style>
<script lang="ts">
	import{ Task } from "$lib/entities";
	import TaskCardFooter from "./TaskCardFooter.svelte";

    export let task: Task;
    
</script>

<div class="card">
    <!-- TODO: Task Component -->
    <p class="mt-3 mb-3">{task.name}</p>
    <TaskCardFooter task={task}/>
</div>
