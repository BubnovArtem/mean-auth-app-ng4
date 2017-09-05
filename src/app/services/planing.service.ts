import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { HttpParams} from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { User } from '../classes/user';
import { Task } from '../classes/task';

@Injectable()
export class PlaningService {

  constructor(private http: Http) {
  }

  loadUser(): string {
    return localStorage.getItem('user');
  }

  getTasks(): Observable<any> {
    const user: string = this.loadUser();
    let headers: Headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('user', JSON.parse(user).id);
    return this.http.get('http://localhost:3000/tasks', {headers: headers})
      .map(res => res.json());
  }

  getOneTask(taskId: string): Observable<any> {
    let headers: Headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('id', taskId);
    return this.http.get('http://localhost:3000/tasks/:id', {headers: headers})
      .map(res => res.json());
  }

  addNewTask(newTask: string): Observable<any> {
    const user: string = this.loadUser();
    let headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/tasks', {userId: JSON.parse(user).id, task: newTask}, {headers: headers})
      .map(res => res.json());
  }

  deleteTask(taskIdtoDelete: string): Observable<any> {
    let headers: Headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('id', taskIdtoDelete);
    return this.http.delete('http://localhost:3000/tasks/:id', {headers: headers})
      .map(res => res.json());
  }

  updateTask(task: Task): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('http://localhost:3000/tasks/:id', {task: task}, {headers: headers})
      .map(res => res.json());
  }

}
