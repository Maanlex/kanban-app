<script lang="ts">
	import type { Task, TaskLabel } from "$lib/entities";
	import { pickTextColorBasedOnBgColor } from "$lib/utils";

    export let task: Task;
</script>

<style lang="postcss">

</style>
{#if task.labels || task.dueDate}
    <div class="flex flex-wrap w-full gap-1 ml-2 mt-1 mb-2 items-center">
        {#if task.labels}
            {#each task.labels as label}
                <div class="badge badge-md"
                style="background-color: {label.color}; border-color: {label.color};
                color: {pickTextColorBasedOnBgColor(label.color,"#FFFFFF","#000000")}">
                    {label.name}</div>
            {/each}
        {/if}
        {#if task.dueDate}
            <div class="btn btn-xs">
                <span class="icon-[mdi--calendar]" style="width: 1.2rem; height: 1.2rem;"></span>
                <p>{task.dueDate.toLocaleDateString('en-us',{day: "numeric", month:"short"})}</p>
            </div>
        {/if}
    </div>
{/if}