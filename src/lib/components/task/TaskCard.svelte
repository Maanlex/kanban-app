<script lang="ts">
    import {Task} from '$lib/entities'
	import TaskCardWrapper from './TaskCardWrapper.svelte';
	import {createEventDispatcher} from 'svelte'
    import { AlertDialog, ContextMenu, Dialog } from "bits-ui";
	import { flyAndScale } from '$lib/utils';
	import { fade } from 'svelte/transition';
	import InputHelp from '../InputHelp.svelte';
	import { contextMenuUp } from '$lib/stores/store';
	import { toaster } from '@svelte-kit/svelte-toast';

    export let task: Task;

    let dispatch = createEventDispatcher();
    let editDialogTrigger: HTMLDivElement;
    let deleteDialogTrigger: HTMLDivElement;
    let closeTrigger: HTMLDivElement;
    let newTaskNameInput: HTMLInputElement;
    function inputinit(el: HTMLInputElement){
        newTaskNameInput = el;
        newTaskNameInput.focus();
    }

    let newTaskName: string;
    $: isEmptyInput = (newTaskNameInput == undefined || newTaskNameInput.value === "");
    function handleTaskNameInputKeydown(e: KeyboardEvent){
        switch(e.key){
            case "Enter":
                newTaskName = newTaskNameInput.value;
                if(newTaskName !== ""){
                    task.name = newTaskName;
                    dispatch("edit-task",task);
                    closeTrigger.click();
                }else{
                    toaster.error({title: "Empty name", content:"The new name cannot be empty."});
                }
                break;
        }
    }

    function handleDelete(){
        dispatch("delete-task",task);
    }
</script>

<ContextMenu.Root>
    <ContextMenu.Trigger> 
        <div on:contextmenu|preventDefault={() => {$contextMenuUp = task.id}}
            tabindex="-1" role="button">
            <TaskCardWrapper task={task}/>
        </div>
    </ContextMenu.Trigger>
    {#if ($contextMenuUp == task.id)}
        <ContextMenu.Content class="dropOrContextMenu"> 
            <ContextMenu.Item> 
                <button class="btn-dropOrContextMenu" on:click={() => {editDialogTrigger.click()}} tabindex="0">
                    <span class="icon-[mdi--edit]" style="width: 1.2rem; height: 1.2rem;"></span>
                    <p>Edit title</p>
                </button>
            </ContextMenu.Item>
            <div class="divider hover:bg-transparent mt-0 mb-0" ></div>
            <ContextMenu.Item> 
                <button class="btn-dropOrContextMenu" on:click={() => {deleteDialogTrigger.click()}}>
                    <span class="icon-[mdi--delete] text-delete" style="width: 1.2rem; height: 1.2rem"></span>
                    <p class="text-delete">Delete this Task</p>
                </button> 
            </ContextMenu.Item>
        </ContextMenu.Content>
    {/if}
</ContextMenu.Root>

<!-- Edit Task Dialog -->
<Dialog.Root> 
    <Dialog.Trigger class="hidden"> 
        <div class="hidden" bind:this={editDialogTrigger}/>
    </Dialog.Trigger>
    <Dialog.Portal> 
        <Dialog.Overlay
        transition={fade}
        transitionConfig={{ duration: 150 }}
        class="fixed inset-0 z-49 bg-primary-content/80"
        />
        <Dialog.Content transition={flyAndScale}
            class="prose modal-box fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-fit z-50">

            <Dialog.Title> 
                <h3 class="mt-0 mb-0">Edit task name</h3> 
            </Dialog.Title>

            <input id="new_task_name_input" type="text" placeholder="Enter the new name..."
            class="input input-bordered max-w-xs justify-center" autocomplete="off" on:keydown={handleTaskNameInputKeydown}
            use:inputinit/>
            <InputHelp/>
            <Dialog.Close>
                <div class="hidden" bind:this={closeTrigger}/>
            </Dialog.Close>

        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>


<AlertDialog.Root>
    <AlertDialog.Trigger class="hidden"> 
        <div class="hidden" bind:this={deleteDialogTrigger}/>
    </AlertDialog.Trigger>
    <AlertDialog.Portal>
        <AlertDialog.Overlay transition={fade}
        transitionConfig={{ duration: 150 }}
        class="fixed inset-0 z-49 bg-primary-content/80"/>
        <AlertDialog.Content transition={flyAndScale}
        class="prose modal-box fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 p-7">
            <div class="flex flex-col">
                <AlertDialog.Title asChild> 
                    <h2 class="mt-0 mb-0">Confirm Delete</h2>
                </AlertDialog.Title>
                <AlertDialog.Description> 
                    <p>Are you sure you want to delete the task "{task.name}" ?</p>
                    <div role="alert" class="alert alert-warning">
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <span>Warning: You cannot undo this!</span>
                    </div>
                </AlertDialog.Description>
                <div class="modal-action flex w-full items-center justify-center gap-2 box-border">
                    <AlertDialog.Cancel class="inline-flex btn ">
                        Cancel
                    </AlertDialog.Cancel>
                    <AlertDialog.Action class="inline-flex btn btn-primary" on:click={handleDelete}> 
                        Confirm
                    </AlertDialog.Action>
                </div>           
            </div>
        </AlertDialog.Content>
    </AlertDialog.Portal>
</AlertDialog.Root>
    
