import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-extra',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './extra.component.html',
  styleUrl: './extra.component.css'
})
export class ExtraComponent {

  copied = false;
  fadeOut = false;

  copyToClipboard(): void {
    const textToCopy = 'FullUsername#1234';
    navigator.clipboard.writeText(textToCopy).then(() => {
      this.copied = true;
      setTimeout(() => {
        this.fadeOut = true;
        setTimeout(() => {
          this.copied = false;
          this.fadeOut = false;
        }, 1000); // Duración de la animación fade-out
      }, 500); // Duración de la animación fade-in
    }).catch(err => {
      console.error('No se pudo copiar el texto: ', err);
    });
  }
}
