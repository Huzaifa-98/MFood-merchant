import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable , } from '@angular/core';
import { environment } from 'src/environments/environment';
import { userModel } from './models/userModel';
import { Observable,Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  
  public userDialog = new Subject<any>();
  public userLoadData = new Subject<any>();


  postUserFormData(userModel: any): Observable<any> {
    const params = new HttpParams({fromObject: userModel})
    let url = (environment.Live_API + "/AddUser");
    return this.http.post(url, params);
  }

  putUserFormData(userModel: any): Observable<any> {
    const params = new HttpParams({fromObject: userModel})
    let url = (environment.Live_API + "/UpdateUser");
    return this.http.post(url, params);
  }

  getUsersListByShopId(userShopId: number): Observable<any> {
    return this.http.get<userModel[]>(environment.Live_API + `/GetUsersByShop?ShopId=${userShopId}`);
  }

  userDialog$() {
    return this.userDialog.asObservable();
  }

  userLoadData$() {
    return this.userLoadData.asObservable();
  }

}
