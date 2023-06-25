import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription, debounceTime, interval, map } from 'rxjs';
import { GameFieldService } from './game-field.service';
import { FieldColorsEnum } from '../enums/field-colors.enum';

@Injectable({
  providedIn: 'root'
})
export class FieldService {

  constructor(
    private readonly gameFieldService: GameFieldService
  ){}

  AIPoints: number = 0;
  playerPoints: number = 0;

  arrOfRandomFields: number[][] = [];

  randomFieldSubject: Subject<number[]> = new Subject();
  randomField$: Observable<number[]> = this.randomFieldSubject.asObservable();
  randomFieldSubscription!: Subscription;

  randomDelay: Subject<number> = new Subject();
  randomDelay$: Observable<number> = this.randomDelay.asObservable();
  randomDelaySubscription!: Subscription;

  AIclickSubject: Subject<number[]> = new Subject();
  AIClick$: Observable<number[]> = this.AIclickSubject.asObservable();
  AIClickSubscription!: Subscription;

  intervalSubscription!: Subscription;

  AIClickArr: number[][] = [];

  public startGame(minNumber: number, maxNumber: number, ...delayArr: number[]){
    console.log(delayArr.length)
    if(delayArr.length === 2){
      const [minSec, maxSec] = delayArr;

      this.generateRandomFieldWithDelay(minNumber, maxNumber, minSec, maxSec);
      this.randomDelay.next(this.generateRandomDelay(minSec, maxSec));
    } 

    if(delayArr.length === 1){
      const [delay] = delayArr;
      this.generateRandomFieldWithDelay(minNumber, maxNumber, delay);
      this.randomDelay.next(delay)
    }

    this.randomFieldSubscription = this.randomField$
      .subscribe((field: number[]) => {
        const [changeRaw, changeCol] = field;

        this.gameFieldService.gameField = this.gameFieldService.gameField.map((raw: FieldColorsEnum[], i: number) => {
          if(i === changeRaw){
            return raw.map((value: FieldColorsEnum, j) => {
              if(j === changeCol) {
                return this.gameFieldService.colorFields.yellow
              }
              return value
            });
          }
          return raw  
          }
        )

        this.AIClickSubscription = this.AIClick$
            .pipe(
              map((AIClick: number[]) => {
                this.AIClickArr.push(AIClick);
                if(this.AIClickArr.length === 1){
                  this.AIClickSubscription.unsubscribe();
                }
                return AIClick;
              }),
              debounceTime(50)
            )
            .subscribe((AIClick: number[]) => {
            
              const [raw, col] = AIClick;
              if(this.gameFieldService.gameField[raw][col] === this.gameFieldService.colorFields.yellow){
                this.gameFieldService.gameField[raw][col] = this.gameFieldService.colorFields.AI;
                this.addPointToAI();
                this.AIClickSubscription.unsubscribe();
              }

              if(this.playerPoints === 10 || this.AIPoints === 10){
                this.resetGame();
                this.AIClickSubscription.unsubscribe();
              }
              this.AIClickSubscription.unsubscribe();
            })
          this.randomFieldSubscription.unsubscribe();
      })
  }

  public addPointToPlayer(): void{
    this.playerPoints += 1;
  }
  
  private generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private generateRandomDelay(minSec: number, maxSec: number): number {
    return this.generateRandomNumber(minSec, maxSec ) * 1000; // Convert to milliseconds
  }

  private generateRandomFieldWithDelay(minNumber: number, maxNumber: number, ...delayArr: number[]): void{
    this.randomDelaySubscription = this.randomDelay$.subscribe((delay: number) => {
      console.log(delay)
      this.intervalSubscription = interval(delay).pipe(
        map(() =>  {
          if(delayArr.length === 2){
            const [minSec, maxSec] = delayArr
            this.randomDelay.next(this.generateRandomDelay(minSec, maxSec));;
            this.randomDelaySubscription.unsubscribe();
          }
          if(delayArr.length === 1){
            const [delay] = delayArr;
            this.randomDelay.next(delay);
            this.randomDelaySubscription.unsubscribe();
          }
        })
      ).subscribe(() => {
        console.log('yellow')
        const randomField = [this.generateRandomNumber(minNumber, maxNumber), this.generateRandomNumber(minNumber, maxNumber)];

        // якщо рандомний елемент вже співпав з тим, що існує
        if(this.arrOfRandomFields.find((el) => (JSON.stringify(el) === JSON.stringify(randomField)))){
          this.intervalSubscription.unsubscribe();
          return;
        };
        this.arrOfRandomFields.push(randomField);
        this.randomFieldSubject.next(randomField);


        if(this.arrOfRandomFields.length > 1){
          this.AIclickSubject.next(this.arrOfRandomFields[this.arrOfRandomFields.length - 2]);
        }
        this.intervalSubscription.unsubscribe();

      })
    })  
    
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
    this.AIClickArr = []; 
    this.randomFieldSubscription.unsubscribe();
    this.intervalSubscription.unsubscribe();
    this.randomDelaySubscription.unsubscribe();
    this.AIClickSubscription.unsubscribe();
  }

  
  
}
