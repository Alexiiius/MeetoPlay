import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AdvisesService } from '../../../services/advises.service';
import { Advise } from '../../../interfaces/advise';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-advises',
  standalone: true,
  imports: [],
  templateUrl: './advises.component.html',
  styleUrl: './advises.component.css'
})
export class AdvisesComponent implements OnInit {

  @Output() hasAdvises = new EventEmitter<boolean>();

  advises: Advise[];

  sampleAdvise: Advise = {
    id: 1,
    title: 'Sample Advise',
    description: 'This is a sample advise'
  }

  constructor(
    private advisesService: AdvisesService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.advises = [this.sampleAdvise];

    if (!sessionStorage.getItem('advisesComponentLoaded')) {
      if (this.advises.length > 0) {
        this.alertService.showAlert('info', 'Hay avisos nuevos Revisa los avisos para mantenerte informado 🔔');
      }
      sessionStorage.setItem('advisesComponentLoaded', 'true');
    }

    // this.advisesService.getAdvises().subscribe((advises: Advise[]) => {
    //   this.advises = advises
    // });
  }

}
