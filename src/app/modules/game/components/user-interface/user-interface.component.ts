import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FieldService } from '../../services/field.service';

@Component({
  selector: 'app-user-interface',
  templateUrl: './user-interface.component.html',
  styleUrls: ['./user-interface.component.scss']
})
export class UserInterfaceComponent{

  @Output() rangeValueE: EventEmitter<number> = new EventEmitter();
  @Output() delayConditionE: EventEmitter<boolean> = new EventEmitter();
  @Output() delayValueE: EventEmitter<number> = new EventEmitter();

  rangeValue: number = 0.5;

  constructor(
    public readonly fieldService: FieldService
  ){}

  public changeRangeValue(event: Event): void{
    const cur = event.target as HTMLInputElement;
    this.rangeValue = +cur.value;
    this.rangeValueE.emit(+cur.value);
  }

  public changeDelay(e: Event){
    const cur = e.target as HTMLInputElement;
    this.delayConditionE.emit(!!+cur.value);
  }

  public changeMsValue(e: Event){
    const cur = e.target as HTMLInputElement;
    this.delayValueE.emit(+cur.value);
  }
}
