import { Entity } from "./Entity";
import type { Task } from "./Task";

export class List extends Entity{
    name: string;
    tasks: Array<Task>;
    tasksLimit: number;

    public constructor(name: string, tasks: Array<Task> = new Array<Task>, tasksLimit = 0){
        super();
        this.name = name;
        this.tasks = tasks;
        this.tasksLimit = tasksLimit;
    }
}