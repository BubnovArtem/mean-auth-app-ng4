import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlaningService } from '../../services/planing.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Task } from '../../classes/task';
import { TasksResponse } from '../../classes/tasks-response';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit, OnDestroy {
  sub: any;
  tasksResponse: TasksResponse;
  newTask: string;

  constructor(
    private planingService: PlaningService, 
    private flashMessagesService: FlashMessagesService,
    private router: Router) { }

  ngOnInit() {
    this.sub = this.planingService.getTasks().subscribe(
      tasks => {
        this.tasksResponse = tasks;
        console.log(tasks);
      },
      err => {
        console.log(err);
        return false;
      }
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  addNewTask(newTask: string): any {
    this.planingService.addNewTask(newTask).subscribe(
      data => {
        this.flashMessagesService.show('New task added', {cssClass: 'alert-success', timeout: 3000}); 
        this.tasksResponse.tasks.push(data.task);
      },
      err => {
        this.flashMessagesService.show('Something went wrong ' + err, {cssClass: 'alert-danger', timeout: 3000});
        return false;
      }
    );
    this.newTask = null;
  }

  deleteTask(taskId: string): any {
    this.planingService.deleteTask(taskId).subscribe(
      data => {
        console.log(data);
        this.flashMessagesService.show('Task deleted', {cssClass: 'alert-success', timeout: 3000}); 
        // Delete in view here
        for (let i=0; i<this.tasksResponse.tasks.length; i++) {
          if(this.tasksResponse.tasks[i]._id === data.taskId) {
            this.tasksResponse.tasks.splice(i, 1);
          }
        }
      },
      err => {
        this.flashMessagesService.show('Something went wrong ' + err, {cssClass: 'alert-danger', timeout: 3000});
        return false;
      }
    );
  }

  updateTask(task: Task): any {
    this.planingService.updateTask(task).subscribe(
      data => {
        this.flashMessagesService.show('Task updated', {cssClass: 'alert-success', timeout: 3000});
        // Update in view
        for (let i=0; i<this.tasksResponse.tasks.length; i++) {
          if(this.tasksResponse.tasks[i]._id === data._id) {
            this.tasksResponse.tasks[i].task = task.task;
            this.tasksResponse.tasks[i].isDone = task.isDone;
          }
        }
      },
      err => {
        console.log(err);
        return false;
      }
    );
  }

  goToTask(taskId: string): boolean {
    if(!taskId) return false;
    this.router.navigate(['/task/' + taskId]);
  }

}
