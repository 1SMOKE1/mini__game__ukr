import { Component, OnInit } from '@angular/core';
import { FieldColorsEnum } from '../../enums/field-colors.enum';
import { FieldService } from '../../services/field.service';
import { GameFieldService } from '../../services/game-field.service';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
})
export class FieldComponent implements OnInit{

  colorFields = FieldColorsEnum;
  
  constructor(
    private readonly fieldService: FieldService,
    public readonly gameFieldService: GameFieldService
  ){}

  ngOnInit(): void {
    this.gameFieldService.initGameField();
    this.fieldService.startGame();
  }

  

  

  public getClassOf(val: FieldColorsEnum) {
    switch(true){
      case val === this.colorFields.blue:
        return 'btn bg1';
      case val === this.colorFields.yellow:
        return 'btn bg2';
      case val === this.colorFields.player:
        return 'btn bg3';
      case val === this.colorFields.AI:
        return 'btn bg4';
      default: 
        return 'btn bg1';
    }
  }

  public catchField(raw: number, col: number): void{
    const field = this.gameFieldService.gameField[raw][col];
    if(field === this.colorFields.yellow){
      this.gameFieldService.gameField[raw][col] = this.colorFields.player;
    } 
  }

  

  
}
