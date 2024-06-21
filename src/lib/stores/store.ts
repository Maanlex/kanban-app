import {writable} from 'svelte/store';
import { type Board } from '../types';

export const boardStore = writable<Board>();

export const currentlyAddingTaskStore = writable(-1);