import { type Item } from "svelte-dnd-action"

export type Task = Item & {
    id: number,
    name: string
}

export type Board = {
    id: number,
    name: string,
    lists: List[]

}

export type List = {
    id: number,
    name: string,
    tasks: Task[]
    tasksLimit: number
}

export const BasicBoard:Board = {
    id:1,
    name: "Kanban Test",
    lists: [
        {
            id:1,
            name: "To Do",
            tasks: [
                {
                    id:1,
                    name:"Android App New Landing Page"
                },
                {
                    id:2,
                    name: "Analytics"
                }
            ],
            tasksLimit: 10
        },
        {
            id:2,
            name: "Doing",
            tasks: [
                {
                    id:3,
                    name:"Authentification"
                },
                {
                    id:4,
                    name: "IT Solutions page"
                }
            ],
            tasksLimit: 4
        },
        {
            id:3,
            name: "Done",
            tasks: [],
            tasksLimit: -1
        }
    ]
}
