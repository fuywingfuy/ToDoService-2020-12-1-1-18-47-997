import { Router } from '@angular/router';
import { ToDoItem } from './../model/ToDoItem';
import { TodoHttpService } from './todo-http.service';
import { Injectable } from '@angular/core';
import { TodoStoreService } from './todo-store.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  public updatingToDoItem: ToDoItem;
  public selectedTodoItem: ToDoItem;
  private currentId: number = 0;

  private _todoItems: Array<ToDoItem>;
  public getAllFailMessage: string;
  public createFailMessage: string;
  public updateFailMessage: string;
  public getByIdFailMessage: string;
  public deleteFailMessage: string;

  constructor(private todoStore: TodoStoreService, private todoHttpService: TodoHttpService, private router: Router) {
    this._todoItems = todoStore.GetAll();
    this.updatingToDoItem = new ToDoItem(-1, '', '', false);
    this.selectedTodoItem = new ToDoItem(-1, '', '', false);
    this.getAllFailMessage = '';
    this.createFailMessage = '';
    this.updateFailMessage = '';
    this.getByIdFailMessage = '';
    this.deleteFailMessage = '';
    // this.currentId = this.todoItems.length;
  }


  public get todoItems(): Array<ToDoItem> {
      const allTodoItem = new Array<ToDoItem>();
      this.todoHttpService.GetAll().subscribe(todoItems => {
        allTodoItem.push(...todoItems);
      },
      error => {
        this.getAllFailMessage = 'Get all fail because web api error';
      });
      return allTodoItem;
  }

  public SetUpdatingTodoItemId(id: number): void {
    const foundTodoItem = this.todoStore.FindById(id);

    if (foundTodoItem !== undefined) {
      this.updatingToDoItem = Object.assign({}, foundTodoItem);
    }
  }

  public Create(todoItem: ToDoItem): void {
    this.todoHttpService.Create(todoItem).subscribe(todoitem => {
      console.log(todoitem);
      this.createFailMessage = '';
    },
    error => {
      this.createFailMessage = 'Create fail because web api error';
    });
  }

  public UpdateTodoItem(updateTodoItems: ToDoItem): void {
    this.todoHttpService.Update(updateTodoItems).subscribe(todoitem => {
      console.log(todoitem);
      this.updateFailMessage = '';
    },
    error => {
      this.updateFailMessage = 'Update fail because web api error';
    });
  }

  public DeleteTodoItem(id: number): void {
    this.todoHttpService.Delete(id).subscribe(todoitem => {
      this.deleteFailMessage = '';
    },
    error => {
      this.deleteFailMessage = 'Delete fail because web api error';
    });
  }

  public SetSelectedTodoItemId(id: number): void {
    this.todoHttpService.FindById(id).subscribe(todoitem => {
        this.selectedTodoItem = todoitem;
        this.getByIdFailMessage = '';
    },
    error => {
      this.getByIdFailMessage = 'Get By Id fail because web api error';
    });
  }
}
