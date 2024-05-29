import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Gamemode } from '../../../models/gamemode';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tr[app-select-gamemode-rank-lvl]',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './select-gamemode-rank-lvl.component.html',
  styleUrl: './select-gamemode-rank-lvl.component.css'
})
export class SelectGamemodeRankLvlComponent implements OnInit{

  @Input() gamemodes: Gamemode[];
  @Output() deleteRequest = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder) {}

  gamemodeStatForm: FormGroup;
  selectedGamemode: Gamemode | undefined;

  ngOnInit(): void {
    this.gamemodeStatForm = this.formBuilder.group({
      gamemode: ['default', Validators.required],
      rank: ['', Validators.required],
      lvl: ['', Validators.required]
    });
  }

  onDelete() {
    this.deleteRequest.emit();
  }

  onGamemodeChange() {
    this.selectedGamemode = this.gamemodes.find(gamemode => gamemode.id == this.gamemodeStatForm.value.gamemode);
    if (this.selectedGamemode) {
      this.selectedGamemode.ranked = Number(this.selectedGamemode.ranked)== 1 ? true : false;
      console.log(this.selectedGamemode);
    }
  }
}
