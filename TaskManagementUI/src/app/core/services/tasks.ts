import { Injectable } from '@angular/core';
import { Task } from '../../models/task';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Tasks {
  private api =
    'http://localhost:56449/api/tasks';

  constructor(private http: HttpClient) { }

  // GET all tasks
  getAll() {
    return this.http.get<Task[]>(this.api);
  }

  // CREATE task
  create(task: Partial<Task>) {
    return this.http.post(this.api, task);
  }

  // UPDATE task
  update(id: number, task: Task) {
    return this.http.put(`${this.api}/${id}`, task);
  }

  // DELETE task
  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}
