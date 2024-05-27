import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { EventFeedService } from '../../../services/event-feed.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  @Input() isLoading: boolean;

  @ViewChild('searchEventInput') searchInput: ElementRef;

  ngOnInit() {
    this.addKeyboardShortcut();
  }

  constructor(private eventFeedService: EventFeedService) { }

onSelectChange(event: any) {
  this.eventFeedService.changeGroup(event.target.value);
}

  addKeyboardShortcut() {
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.key === 'k') {
        this.searchInput.nativeElement.focus();
        event.preventDefault();
      } else if (event.key === 'Escape' || event.key === 'Esc') { // Esc key
        this.searchInput.nativeElement.blur();
      }
    });
}
}
