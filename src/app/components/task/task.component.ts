import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlaningService } from '../../services/planing.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Task } from '../../classes/task';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit, OnDestroy {
  sub: any;
  task: Task;

  constructor(
    private planingService: PlaningService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private flashMessagesService: FlashMessagesService
  ) { }

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe(
      params => {
        this.planingService.getOneTask(params['id']).subscribe(
          data => {
            this.task = data.task;
            console.log('Got task '+ JSON.stringify(data));
          },
          err => {
            console.log(err);
            return false;
          }
        );
      },
      err => {
        this.flashMessagesService.show('Error, routing to tasks...', {cssClass: 'alert-danger', timeout: 3000});
        this.router.navigate(['/tasks']);
      }
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
