import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FieldService } from '../../services/field.service';

@Component({
  selector: 'app-user-interface',
  templateUrl: './user-interface.component.html',
  styleUrls: ['./user-interface.component.scss']
})
export class UserInterfaceComponent implements OnInit{

  @Output() rangeValueE: EventEmitter<number> = new EventEmitter();

  rangeValue: number = 1;

  constructor(
    public readonly fieldService: FieldService
  ){}

  ngOnInit(): void {
    
  }

  public changeRangeValue(event: Event): void{
    const cur = event.target as HTMLInputElement;
    this.rangeValue = +cur.value;
    this.rangeValueE.emit(this.rangeValue);
  }
}
