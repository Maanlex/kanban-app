<script lang="ts">
	import type { Task } from "$lib/types";
	import { flyAndScale } from "$lib/utils";
	import { Dialog, Separator } from "bits-ui";
	import { createEventDispatcher } from "svelte";
	import { fade } from "svelte/transition";

    export let task:Task;

    let dispatch = createEventDispatcher();
    let dialogTrigger: HTMLButtonElement;

    function handleEditTask(){
        
    }

    function handleDeleteTask(){
        
    }
</script>

<ul class="menu bg-base-200 w-56 rounded-box">
    <li>
        <button class="btn" on:click={() => {dialogTrigger.click()}}>
            <span class="icon-[mdi--edit]" style="width: 1.2rem; height: 1.2rem;"></span>
            Edit title
        </button>
  
    </li>
    <li>
        <button class="btn">
            <span class="icon-[mdi--delete]" style="width: 1.2rem; height: 1.2rem; color: #c20000;"></span>
            Delete this Task
        </button> 
    </li>
</ul>

<Dialog.Root> 
    <Dialog.Trigger> 
        <button class="hidden" id="dialogTrigger" bind:this={dialogTrigger}/>
    </Dialog.Trigger>
    <Dialog.Portal> 
        <Dialog.Overlay
        transition={fade}
        transitionConfig={{ duration: 150 }}
        class="fixed inset-0 z-49 bg-primary-content/80"
        />
        <Dialog.Content transition={flyAndScale}
            class="modal-box fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50">
            <Dialog.Title> 
                Edit task title
            </Dialog.Title>
            <input id="task_name_input" type="text" placeholder="Enter the new title..."
            class="input max-w-xs" required autocomplete="off" />
            <Dialog.Close> 
                Save
            </Dialog.Close>
        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>