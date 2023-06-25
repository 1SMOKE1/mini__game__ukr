import { Injectable } from '@angular/core';
import { FieldColorsEnum } from '../enums/field-colors.enum';
import { IAnswer } from '../interfaces/answer.interface';

@Injectable({
  providedIn: 'root'
})
export class GameFieldService {

  columnsCount: number = 10;
  gameField: FieldColorsEnum[][] = [];
  colorFields = FieldColorsEnum;
  answer: IAnswer = {text: '', emoji: ''};
  startBtn: boolean = false;

  public initGameField(): void{
    for(let i = 0; i < this.columnsCount; i++){
      const colorFieldsArr: FieldColorsEnum[] = [];
      for(let j = 0; j < this.columnsCount; j++){
        colorFieldsArr.push(this.colorFields.blue);
      }
      this.gameField.push(colorFieldsArr);
    }
  }




}
