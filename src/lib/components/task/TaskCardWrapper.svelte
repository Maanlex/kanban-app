<style lang="postcss">
    .card {
        height: 3em;
        width: 95%;
        margin: 0.4em 0;
        display: flex;
        justify-content: center;
        align-items: center;
        @apply rounded-lg;
        @apply bg-secondary;
        @apply text-secondary-content;
        @apply ml-auto mr-auto;
    }
</style>
<script lang="ts">
	import type { Task } from "$lib/types";

    export let task: Task;
    
</script>

<div class="card">
    <!-- TODO: Task Component -->
    <p>{task.name}</p>
</div>
