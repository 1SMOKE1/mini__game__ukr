import { Component } from '@angular/core';
import { FieldService } from '../../services/field.service';
import { DialogService } from '../../services/dialog.service';
import { GameFieldService } from '../../services/game-field.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  delay: number = 300;

  constructor(
    public readonly dialogService: DialogService,
    public readonly gameFieldService: GameFieldService,
    private readonly fieldService: FieldService,
  ){}

  public startGame(): void{
    this.fieldService.startGame2(0, 9, this.delay)
  }

  public setDelayValue(value: number): void{
    if(value < this.delay)
      return;
    this.delay = value;
  }

}
