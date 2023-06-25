import { Component } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { GameFieldService } from '../../services/game-field.service';
import { FieldService } from '../../services/field.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent { 

  constructor(
    public readonly dialogService: DialogService,
    public readonly gameFieldService: GameFieldService,
    public readonly fieldService: FieldService
    ){}

  public closeDialog(): void{
    this.dialogService.showDialog = false;
    this.fieldService.resetGame();
  }
}
