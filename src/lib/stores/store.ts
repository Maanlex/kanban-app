import {writable} from 'svelte/store';
import {Board} from '../entities';

export const boardStore = writable<Board>();


export const currentlyAddingTaskStore = writable("");

export const contextMenuUp = writable("");

export const isDragging = writable(false);

export const listNameChange = writable({listId: "", name:""});
