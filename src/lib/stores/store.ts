import {writable} from 'svelte/store';
import { type Board } from '../types';

export const boardStore = writable<Board>();


export const currentlyAddingTaskStore = writable(-1);

export const contextMenuUp = writable(-1);

export const isDragging = writable(false);

export const listNameChange = writable({listId: -1, name:""});
