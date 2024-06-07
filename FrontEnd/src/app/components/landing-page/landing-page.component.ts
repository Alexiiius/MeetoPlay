import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit, OnDestroy{
  isSideMenuOpen: boolean = false;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private viewportScroller: ViewportScroller) { }

  toggleSideMenu() {
    this.isSideMenuOpen = !this.isSideMenuOpen;

    const layout = document.querySelector('.layout');

    if (this.isSideMenuOpen) {
      layout?.classList.add('overlay');
    } else {
      layout?.classList.remove('overlay');
    }
  }

  ngOnInit() {
    window.addEventListener('scroll', this.scroll, true); //third parameter

  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
  }

  scrollToAnchor(anchor: string, sideMenu: boolean = false): void {
    if (sideMenu) {
      this.toggleSideMenu();
    }
    const element = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({behavior: 'smooth', block: 'center'});
    }
  }
  scroll = (event: Event): void => {
    // here you can access the scroll event
    const scrollThreshold = 200; // replace with the amount of pixels you want
    if (window.scrollY > scrollThreshold && window.innerWidth < 550) {
      let percentage = ((window.scrollY - scrollThreshold) / (document.documentElement.scrollHeight - window.innerHeight)) * 300 - 150;
      let element = this.el.nativeElement.querySelector('#myObject');
      this.renderer.setStyle(element, 'transform', `translateX(${percentage}%)`);
    }
  };

}
