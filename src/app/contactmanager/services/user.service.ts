import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { promise } from 'protractor';
import { reject, resolve } from 'q';

@Injectable(
   // {providedIn: 'root'}
)
export class UserService {

  private _users: BehaviorSubject<User[]>;

  private dataStore: {
    users: User []
  // tslint:disable-next-line:semicolon
  }
  constructor(private http: HttpClient) {
    this.dataStore = {users: []};
    this._users = new BehaviorSubject<User[]>([]);
   }

   get users(): Observable<User[]> {
     return this._users.asObservable();
   }

   addUser(user: User): Promise <User> {
     // tslint:disable-next-line:no-shadowed-variable
     return new Promise ((resolver, reject) => {
       user.id = this.dataStore.users.length + 1;
       this.dataStore.users.push(user);
       this._users.next(
        Object.assign({}, this.dataStore).users);
        resolver(user);
     });
   }

   userById(id: number) {
     // tslint:disable-next-line:triple-equals
     return this.dataStore.users.find(x => x.id == id);
   }

   loadAll() {
     const usersUrl = 'https://angular-material-api.azurewebsites.net/users';

     return this.http.get<User[]>(usersUrl)
     .subscribe(data => {
       this.dataStore.users = data;
       this._users.next(
         Object.assign({}, this.dataStore).users);
     }, error => {
      console.log('Failed to fetch users');

     });
   }

}
