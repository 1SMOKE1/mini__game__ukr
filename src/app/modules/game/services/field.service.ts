import { Injectable } from '@angular/core';
import { Observable, Subject, distinctUntilChanged, interval, map } from 'rxjs';
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

  randomDelay: Subject<number> = new Subject();
  randomDelay$: Observable<number> = this.randomDelay.asObservable();

  delay: number = 0;

  AIclickSubject: Subject<number[]> = new Subject();
  AIClick$: Observable<number[]> = this.AIclickSubject.asObservable();

  private generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  public generateRandomDelay(minSec: number, maxSec: number): number {
    return this.generateRandomNumber(minSec, maxSec ) * 1000; // Convert to milliseconds
  }

  public generateRandomFieldWithDelay(minNumber: number, maxNumber: number, minSec: number, maxSec: number): void{
    this.randomDelay.next(this.generateRandomDelay(minSec, maxSec));
    this.randomDelay$.subscribe((delay: number) => {
      const intervalSubscription = interval(delay).pipe(
        map(() =>  {
          this.randomDelay.next(this.generateRandomDelay(minSec, maxSec));
        })
      ).subscribe(() => {
        const randomField = [this.generateRandomNumber(minNumber, maxNumber), this.generateRandomNumber(minNumber, maxNumber)];

        // якщо рандомний елемент вже співпав з тим, що існує
        if(this.arrOfRandomFields.find((el) => (JSON.stringify(el) === JSON.stringify(randomField)))){
          intervalSubscription.unsubscribe();
          return;
        };
        this.arrOfRandomFields.push(randomField);
        this.randomFieldSubject.next(randomField);


        if(this.arrOfRandomFields.length > 1){
          this.AIclickSubject.next(this.arrOfRandomFields[this.arrOfRandomFields.length - 2])
        }
        intervalSubscription.unsubscribe();
      })
    })  
    
  }

  public startGame(){
    this.generateRandomFieldWithDelay(0, 9, 1, 5);

    this.randomDelay.next(this.generateRandomDelay(1, 5));

    this.randomField$
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

        const AIClickSubscription = this.AIClick$
            .pipe(
              distinctUntilChanged()
            )
            .subscribe((AIClick: number[]) => {
              const [raw, col] = AIClick;
              if(this.gameFieldService.gameField[raw][col] === this.gameFieldService.colorFields.yellow){
                this.gameFieldService.gameField[raw][col] = this.gameFieldService.colorFields.AI;
              }
              AIClickSubscription.unsubscribe();
            })

      })
  }
  





  // public generateRandomNumberWithDelay$(){
  //   this.generateRandomNumberWithDelay(
  //     0, 9, 1, 5
  //   ).subscribe((num) => {
  //     this.randomField.push(num);
  //     if(this.randomField.length === 2){
  //       console.log(this.randomField)
  //       this.randomField = [];
  //     }
  //   })
  // }
}
