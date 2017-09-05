import { Task } from "./task";

export class TasksResponse {
    success: boolean;
    msg: string;
    tasks: Task[];
}