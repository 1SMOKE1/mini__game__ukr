import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription, interval, map } from 'rxjs';
import { GameFieldService } from './game-field.service';
import { FieldColorsEnum } from '../enums/field-colors.enum';
import { DialogService } from './dialog.service';

@Injectable({
  providedIn: 'root'
})
export class FieldService {

  constructor(
    private readonly gameFieldService: GameFieldService,
    private readonly dialogService: DialogService
  ){}

  AIPoints: number = 0;
  playerPoints: number = 0;

  arrOfRandomFields: number[][] = [];

  randomFieldSubject: Subject<number[]> = new Subject();
  randomField$: Observable<number[]> = this.randomFieldSubject.asObservable();
  randomFieldSubscription!: Subscription;

  intervalSubscription!: Subscription;



  public startGame2(minNumber: number, maxNumber: number, delay: number){
    
    this.intervalSubscription = interval(delay)
    .pipe(
      map(() => {
        return [this.generateRandomNumber(minNumber, maxNumber), this.generateRandomNumber(minNumber, maxNumber)];
      })
    )
    .subscribe((randomField: number[]) => {
      // якщо рандомний елемент вже співпав з тим, що існує
      this.gameFieldService.startBtn = true;
      if(this.arrOfRandomFields.find((el) => (JSON.stringify(el) === JSON.stringify(randomField)))){
        return;
      };
      this.arrOfRandomFields.push(randomField);
      this.randomFieldSubject.next(randomField);
      if(this.playerPoints === 10){
        this.dialogService.showDialog = true;
        this.gameFieldService.answer = {text: 'Вітаю, ви перемогли', emoji: '🎉✨🎊🥳🎆🎇'};
        this.stopGame();
      }
      if(this.AIPoints === 10){
        this.dialogService.showDialog = true;
        this.gameFieldService.answer = {text: 'Нажаль, ви програли - переміг \"Штучний інтелект\"', emoji: ' ( •ˇ‸ˇ•) 💔 (•᷄∩•᷅  )'};
        this.stopGame();
      }
    })
    
    

    this.randomFieldSubscription = this.randomField$.subscribe(
      (field: number[]) => {
        this.gameFieldService.gameField = this.changeColorOfField(field, this.gameFieldService.colorFields.yellow);        
        const lastField =  this.arrOfRandomFields[this.arrOfRandomFields.length - 2]
        if(this.arrOfRandomFields.length > 1){
          const [raw, col] = lastField
          if(this.gameFieldService.gameField[raw][col] !== this.gameFieldService.colorFields.player){
            this.gameFieldService.gameField = this.changeColorOfField(lastField, this.gameFieldService.colorFields.AI);
            this.addPointToAI();
          }
        }
        
    })
  }

  public addPointToPlayer(): void{
    this.playerPoints += 1;
  }
  
  private generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private addPointToAI(): void{
    this.AIPoints += 1;
  }

  public resetGame(): void{
    this.gameFieldService.gameField = [];
    this.gameFieldService.initGameField();
    this.AIPoints = 0;
    this.playerPoints = 0;
    this.arrOfRandomFields = [];
    this.gameFieldService.startBtn = false;
  }

  private changeColorOfField(field: number[], condition: FieldColorsEnum, ){
    const [changeRaw, changeCol] = field;

    return this.gameFieldService.gameField.map((raw: FieldColorsEnum[], i: number) => {
      if(i === changeRaw){
        return raw.map((value: FieldColorsEnum, j) => {
          if(j === changeCol) {
            return condition
          }
          return value
        });
      }
      return raw  
      }
    )
  }

  private stopGame(): void{
    this.randomFieldSubscription.unsubscribe();
    this.intervalSubscription.unsubscribe();
  }
  
  
}
