<script lang="ts">
	import { clickOutside, flyAndScale } from "$lib/utils";
	import { AlertDialog, Dialog, DropdownMenu, Separator } from "bits-ui";
	import { createEventDispatcher } from "svelte";
	import { fade } from "svelte/transition";
	import InputHelp from "../InputHelp.svelte";
	import type { List } from "$lib/types";

    export let list: List;
    export let getAllListsName: () => Array<{id: number,name: string}>

    let isDropdownMenuOpen: boolean;
    enum AlertDialogType {DELETE_ALL_TASKS, DELETE_LIST}
    let alertDialogType: AlertDialogType;
    let dispatch = createEventDispatcher();
    

    let limitDialogTrigger: HTMLDivElement;
    let deleteDialogTrigger: HTMLDivElement;
    let moveDialogTrigger: HTMLDivElement;
    let closeTrigger: HTMLDivElement;
    let inputTasksLimit: HTMLInputElement;

    function inputinit(el: HTMLInputElement){
        inputTasksLimit = el;
        inputTasksLimit.focus();
    }

    function handleEditTitle(){
        dispatch("edit-list-name");
    }
    function handleTasksLimitInputKeydown(e: KeyboardEvent){
        switch(e.key){
            case 'Enter':
                if(inputTasksLimit.value !== ""){
                    dispatch("edit-tasks-limit",{listId: list.id, tasksLimit: Number(inputTasksLimit.value)});
                    closeTrigger.click();
                }
        }
    }

    function handleDelete(){
        switch(alertDialogType){
            case AlertDialogType.DELETE_ALL_TASKS:
                dispatch("delete-all-tasks",list.id);
                break;
            case AlertDialogType.DELETE_LIST:
                dispatch("delete-list",list.id);
                break;
        }
        
    }

    const EMPTY = -2;
    const NEW_LIST = -1;
    let selectListValue: number;
    let newListValue: string;

    $: newList = (selectListValue == -1);
    function handleMoveTasks(){
        if(selectListValue != EMPTY){
            if(selectListValue == NEW_LIST){
                if(newListValue !== "" && newListValue != undefined){
                    dispatch("move-all-tasks-new-list",{oldList: list.id, newListName: newListValue});
                }else{
                    // warning message
                }
            }else{
                dispatch("move-all-tasks",{oldList: list.id, newList: selectListValue});
            }
        }else{
            // warning message
        }
    }

</script>

<!-- FIXME: dropdown menu adaptation on the side of the screen-->
<DropdownMenu.Root bind:open={isDropdownMenuOpen}> 
    <DropdownMenu.Trigger class="btn btn-ghost btn-xs absolute right-2 top-3"> 
        <span class="icon-[mdi--dots-vertical]" style="width: 1.2rem; height: 1.2rem;"></span>
    </DropdownMenu.Trigger>
    
    <DropdownMenu.Content class="dropOrContextMenu w-56" side="right">
        <div use:clickOutside on:click_outside={() => {isDropdownMenuOpen = false}}>
            <DropdownMenu.Group>
                <DropdownMenu.Label><h2 class="text-base left-2">List</h2></DropdownMenu.Label>
                <DropdownMenu.Item> 
                    <button class="btn-dropOrContextMenu" on:click={handleEditTitle}>
                        <span class="icon-[mdi--edit]" style="width: 1.2rem; height: 1.2rem;"></span>
                        <p>Edit title</p>
                    </button>
                    
                </DropdownMenu.Item>
                <DropdownMenu.Item> 
                    <button class="btn-dropOrContextMenu" on:click={() => {limitDialogTrigger.click()}}>
                        <span class="icon-[mdi--numeric]" style="width: 1.2rem; height: 1.2rem;"></span>
                        <p>Set limit</p>
                    </button>
                </DropdownMenu.Item>
                <DropdownMenu.Item> 
                    <button class="btn-dropOrContextMenu"
                    on:click={() => {deleteDialogTrigger.click();
                        alertDialogType = AlertDialogType.DELETE_LIST}}>
                        <span class="icon-[mdi--delete] text-delete" style="width: 1.2rem; height: 1.2rem"></span>
                        <p class="text-delete">Delete list</p>
                    </button>
                </DropdownMenu.Item>
            </DropdownMenu.Group>
            <div class="divider mb-0 mt-0"></div>
            <DropdownMenu.Group> 
                <DropdownMenu.Label><h2 class="text-base left-2">Tasks</h2></DropdownMenu.Label>
                <DropdownMenu.Item>
                    <button class="btn-dropOrContextMenu" on:click={() => moveDialogTrigger.click()}>
                        <span class="icon-[mdi--arrow-left-right]" style="width: 1.2rem; height: 1.2rem;"></span>
                        <p>Move to another list</p>
                    </button>
                </DropdownMenu.Item>
                <DropdownMenu.Item> 
                    <!-- TODO: onclick function-->
                    <button class="btn-dropOrContextMenu"
                    on:click={() => {deleteDialogTrigger.click();
                        alertDialogType = AlertDialogType.DELETE_ALL_TASKS}}>
                        <span class="icon-[mdi--delete] text-delete" style="width: 1.2rem; height: 1.2rem"></span>
                        <p class="text-delete">Delete all tasks</p>
                    </button>
                </DropdownMenu.Item>
            </DropdownMenu.Group>
        </div>
    </DropdownMenu.Content>
</DropdownMenu.Root>

<!-- Set limit Dialog -->
<Dialog.Root> 
    <Dialog.Trigger class="hidden"> 
        <div class="hidden" bind:this={limitDialogTrigger}/>
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
                <h3 class="mt-0 mb-0">Edit tasks limit</h3> 
            </Dialog.Title>

            <input id="new_limit_input" type="number" min="0" max="99"
            class="input input-bordered input-sm justify-center" on:keydown={handleTasksLimitInputKeydown}
            use:inputinit/>
            <div class="label">
                <span class="label-text"><p class="mt-0 mb-0">A non-blocking limit on the number of tasks that should be in that list.</p></span>
            </div>
            
            <InputHelp/>
            <Dialog.Close>
                <div class="hidden" bind:this={closeTrigger}/>
            </Dialog.Close>

        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>

<!-- Move tasks to another column Dialog -->
<Dialog.Root> 
    <Dialog.Trigger class="hidden"> 
        <div class="hidden" bind:this={moveDialogTrigger}/>
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
                <h3 class="mt-0 mb-0">Move all tasks to another list</h3> 
            </Dialog.Title>

            <select bind:value={selectListValue} class="select select-bordered w-full max-w-xs">
                <option value={EMPTY} disabled selected>The list you want the tasks to move to </option>
                {#each getAllListsName().filter((l) => l.id != list.id) as l}
                    <option value={l.id}>{l.name}</option>
                {/each}
                <option value={NEW_LIST}>New list</option>
            </select>
            {#if (newList)}
                <input id="new_list_name_input" type="text" placeholder="Enter a title for this List..."
                class="input input-bordered input-sm justify-center mt-3" autocomplete="off" use:inputinit
                bind:value={newListValue}/>
            {/if}

            <div class="modal-action flex w-full items-center justify-center gap-2 box-border">
                <button class="inline-flex btn" on:click={() => closeTrigger.click()}>
                    Cancel
                </button>
                <button class="inline-flex btn btn-primary" on:click={handleMoveTasks}> 
                    Confirm
                </button>
            </div> 
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
                    {#if alertDialogType == AlertDialogType.DELETE_LIST}
                        <p>Are you sure you want to delete the list "{list.name}" ?</p>
                    {:else if alertDialogType == AlertDialogType.DELETE_ALL_TASKS}
                        <p>Are you sure want to delete <b>ALL</b> the tasks in this list ?</p>
                    {/if}
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