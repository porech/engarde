import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActionbarService {
  actionbarBackgroundColor : string = "white";
  actionbarTextColor : string = "grey";
  actionbarButtonList = [];
  _actionbarButtonListObservable : BehaviorSubject<Array<any>>;
  _actionbarBackgroundObservable : BehaviorSubject<string>;
  _actionbarTextColorObservable : BehaviorSubject<string>;

  constructor() { 
    this._actionbarBackgroundObservable = new BehaviorSubject(this.actionbarBackgroundColor);
    this._actionbarTextColorObservable = new BehaviorSubject(this.actionbarTextColor);
    this._actionbarButtonListObservable = new BehaviorSubject(this.actionbarButtonList);

  }

  addButton(button) {
    this.actionbarButtonList.push(button)
    this._actionbarButtonListObservable.next(this.actionbarButtonList);
  }
  setBackgroundColor(newValue) {
    this._actionbarBackgroundObservable.next(newValue);
  }

  setButtons(buttons) {
    this._actionbarButtonListObservable.next(buttons);
  }

  setTextColor(newValue) {
    this._actionbarTextColorObservable.next(newValue);
  }
  get backgroundColor() {
    return this._actionbarBackgroundObservable.asObservable();
  }

  get buttonList() {
    return this._actionbarButtonListObservable.asObservable();
  }

  


}
