import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
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
export class LandingPageComponent implements OnInit, OnDestroy {
  isSideMenuOpen: boolean = false;

  whatAudio = new Audio();
  whenAudio = new Audio();
  whoAudio = new Audio();
  whyAudio = new Audio();

  @ViewChild('myCanvas') myCanvas: ElementRef;

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

  ngAfterViewInit() {
    const canvas = this.myCanvas.nativeElement;
    const context = canvas.getContext('2d');
    const image = new Image();
    image.src = 'assets/landing/textsplash.svg';

    const drawImage = () => {
      // Aumenta la resolución del canvas
      const scale = window.devicePixelRatio;
      canvas.width = canvas.offsetWidth * scale;
      canvas.height = canvas.offsetHeight * scale;
      context.scale(scale, scale);

      // Calcula la escala para mantener la relación de aspecto
      const imageScale = Math.min(canvas.offsetWidth / image.width, canvas.offsetHeight / image.height);

      // Calcula el tamaño de la imagen escalada
      const imageWidth = image.width * imageScale;
      const imageHeight = image.height * imageScale;

      // Calcula la posición para centrar la imagen en el canvas
      const imageX = (canvas.offsetWidth - imageWidth) / 2;
      const imageY = (canvas.offsetHeight - imageHeight) / 2;

      // Limpia el canvas y dibuja la imagen
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, imageX, imageY, imageWidth, imageHeight);
    };

    image.onload = drawImage;

    // Redibuja la imagen cuando cambia el tamaño de la ventana
    window.addEventListener('resize', drawImage);
  }

  scrollToAnchor(anchor: string, sideMenu: boolean = false): void {
    if (sideMenu) {
      this.toggleSideMenu();
    }
    const element = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

  // Audios
  playWhatAudio() {
    this.whatAudio.src = 'assets/landing/sounds/what.mp3';
    this.whatAudio.load();
    this.whatAudio.play();
  }

  playWhenAudio() {
    this.whenAudio.src = 'assets/landing/sounds/when.mp3';
    this.whenAudio.load();
    this.whenAudio.play();
  }

  playWhoAudio() {
    this.whoAudio.src = 'assets/landing/sounds/who.mp3';
    this.whoAudio.load();
    this.whoAudio.play();
  }

  playWhyAudio() {
    this.whyAudio.src = 'assets/landing/sounds/why.mp3';
    this.whyAudio.load();
    this.whyAudio.play();
  }
}
