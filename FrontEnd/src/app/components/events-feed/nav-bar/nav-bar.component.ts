import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { EventFeedService } from '../../../services/event-feed.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  searchControl = new FormControl();
  searchSubscription: Subscription;

  @Input() isLoading: boolean;
  @Input() isSearchLoading: boolean;
  @Input() firstLoad: boolean;
  @Output() searchEventInput = new EventEmitter<string>();

  @ViewChild('searchEventInput') searchInputElement: ElementRef;

  ngOnInit() {
    this.addKeyboardShortcut();

    this.searchSubscription = this.searchControl.valueChanges.subscribe(value => {
      if (value !== null) {
        const trimmedValue = value.trim();
        if (trimmedValue !== '' || value === '') {
          this.searchEventInput.emit(trimmedValue);
        }
      }
    });
  }

  constructor(private eventFeedService: EventFeedService) { }


  onSelectChange(event: any) {
    this.eventFeedService.changeGroup(event.target.value);
  }

  addKeyboardShortcut() {
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.key === 'k') {
        this.searchInputElement.nativeElement.focus();
        event.preventDefault();
      } else if (event.key === 'Escape' || event.key === 'Esc') { // Esc key
        this.searchInputElement.nativeElement.blur();
      }
    });
  }

  //Si es la primera carga, el campo de busqueda se deshabilita
  ngOnChanges() {
    if (this.firstLoad) {
      this.searchControl.disable();
    } else {
      this.searchControl.enable();
    }
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
