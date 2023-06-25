import { Component } from '@angular/core';
import { FieldService } from '../../services/field.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  rangeValue: number = 1;
  changeCondition: boolean = true;
  delay: number = 0;

  constructor(
    private readonly fieldService: FieldService
  ){}

  public startGame(): void{
    if(this.changeCondition)
      this.fieldService.startGame(0, 9, 0.5, this.rangeValue);
    else 
      this.fieldService.startGame(0, 9, this.delay)
  }

  public changeRangeValue(value: number): void{
    this.rangeValue = value
  }

  public changeDelayCondition(value: boolean): void{
    this.changeCondition = value;
  }

  public setDelayValue(value: number): void{
    this.delay = value;
  }

}
