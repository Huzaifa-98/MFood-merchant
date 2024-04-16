import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  headers = { 'Content-Type': 'application/json-patch+json' };
  shopId: any = 3309;
  private navLinkId$ = new BehaviorSubject<any>({});
  private menuObjForEdit$ = new BehaviorSubject<any>({});

  encodeFormData(data: any) {
    return Object.keys(data)
      .map(
        (key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
      )
      .join('&');
  }

  constructor(private http: HttpClient) {}

  public NavIdForMenuTab() {
    return this.navLinkId$.asObservable();
  }

  public setNavIdForMenuTab(data: any) {
    this.navLinkId$.next(data);
  }

  public EditMenuObj() {
    return this.menuObjForEdit$.asObservable();
  }

  public setEditMenuObj(data: any) {
    this.menuObjForEdit$.next(data);
  }

  //Get Menu Group List by Shop ID
  getAllMenues() {
    return this.http.get(
      environment.QA_API + `/GetMenuesByShopId?ShopID=${this.shopId}`
    );
  }

  //Get Category List with mapped menus by MenuID and ShopID
  getMenuListItemSubItem(MenuId: any) {
    return this.http.get(
      environment.QA_API + `/GetMenuListCategoryandItemsByMenuListId?MenuListId=${MenuId}&shopId=${this.shopId}`
    );
  }

  //Get All Menu List
  getMenusGroup() {
    return this.http.get(
      environment.QA_API + `/GetAllMenueDetailsByShopId?shopId=${this.shopId}`
    );
  }

  //Get Menu By menuId For Edit
  GetMenuByMenuId(menuId: any){
    return this.http.get(
      environment.QA_API + `/GetAllMenueTimingDetailsByMenuListId?menuListId=${menuId}`
    );
  }

  //Get All Category List
  getCategoryDetails() {
    return this.http.get(
      environment.QA_API +
        `/GetMenuListCategoriesandItemsByShopId?shopId=${this.shopId}`
    );
  }

  //Get Category by categoryId to edit category
  getCategoryById(ctgryId: any){
    return this.http.get(
      environment.QA_API + `/GetMenuListCategory/${ctgryId}`
    );
  }

  //Update Category By category id
  updateCategory(obj: any, ctgryId: any) {

    let url = `${environment.QA_API}/UpdateMenuListCategory/${ctgryId}`;

    return this.http.put(url, obj, {
      headers: this.headers,
      responseType: 'json',
    });
  }

  //Delete category by category id
  deleteCategoryById(ctgryId: any) {
    return this.http.delete(
      environment.QA_API + `/DeleteMenuListCategory/${ctgryId}`
    );
  }

  //Add New Category for Multiple Menus
  addNewCategoryMenu(obj: any) {
    // console.log(obj);

    let url = `${environment.QA_API}/AddNewMenuListCategory`;
    // const body = this.encodeFormData(x);
    return this.http.post(url, obj, {
      headers: this.headers,
      responseType: 'json',
    });
  }

  //Add New Items for Multiple Categories
  addNewCategoryItem(obj: any) {
    const headers = new HttpHeaders({
      'enctype': 'multipart/form-data',
    });
    let url = `${environment.QA_API}/AddNewMenuListCategoryItem`;
    // const body = this.encodeFormData(x);
    return this.http.post(url, obj,
      {
        headers
      });
  }

  addNewMenus(obj: any) {

    let url = `${environment.QA_API}/AddNewMenuwithTimingsAndDays`;
    // const body = this.encodeFormData(x);

    return this.http.post(url, obj, {
      headers: this.headers,
      responseType: 'json',
    });
  }

  //Update Menu By menu id
  updateMenus(obj: any, menuId: any) {

    let url = `${environment.QA_API}/UpdateMenuwithTimingsAndDays/${menuId}`;

    return this.http.put(url, obj, {
      headers: this.headers,
      responseType: 'json',
    });
  }

  //Delete menu by menu id
  deleteMenuById(menuId: any) {
    return this.http.delete(
      environment.QA_API + `/DeleteMenueFromMenuListById?menuId=${menuId}`
    );
  }

  //Get Item List by Shop ID
  getItemDetails() {
    return this.http.get(
      environment.QA_API + `/GetItemsWithDetailByShopId?shopId=${this.shopId}`
    );
  }

  //Get item by item id for edit
  getItemByItemId(itemId: any) {
    return this.http.get(
      environment.QA_API + `/GetMenuListCategoryItem/${itemId}?shopId=${this.shopId}`
    );
  }

  deleteItemById(itemId: any) {
    return this.http.delete(
      environment.QA_API + `/DeleteMenuListCategoryItem/${itemId}`
    );
  }

  updateItemById(obj: any, itemId: any) {
    const headers = new HttpHeaders({
      'enctype': 'multipart/form-data',
    });
    let url = `${environment.QA_API}/UpdateMenuListCategoryItem/${itemId}`;
    // const body = this.encodeFormData(x);
    return this.http.put(url, obj,
      {
        headers
      });
  }
}
