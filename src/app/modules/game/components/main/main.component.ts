import { Component } from '@angular/core';
import { FieldService } from '../../services/field.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  rangeValue: number = 1;

  constructor(
    private readonly fieldService: FieldService
  ){}

  public startGame(): void{
    console.log(this.rangeValue)
    this.fieldService.startGame(0, 9, 1, this.rangeValue);
  }

  changeRangeValue(value: number){
    this.rangeValue = value
  }
}
