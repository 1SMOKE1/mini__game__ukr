import { Component, EventEmitter, Output } from '@angular/core';
import { FieldService } from '../../services/field.service';

@Component({
  selector: 'app-user-interface',
  templateUrl: './user-interface.component.html',
  styleUrls: ['./user-interface.component.scss']
})
export class UserInterfaceComponent{

  @Output() delayValueE: EventEmitter<number> = new EventEmitter();

  constructor(
    public readonly fieldService: FieldService
  ){}

  public changeMsValue(e: Event){
    const cur = e.target as HTMLInputElement;
    this.delayValueE.emit(+cur.value);
  }
}
