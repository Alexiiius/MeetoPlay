import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventFeedService {

  private groupSource = new BehaviorSubject<string>('Public');
  currentGroup = this.groupSource.asObservable();

  changeGroup(group: string) {
    this.groupSource.next(group);
  }
}
