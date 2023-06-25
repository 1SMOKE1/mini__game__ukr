import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { MainComponent } from './components/main/main.component';
import { FieldComponent } from './components/field/field.component';
import { UserInterfaceComponent } from './components/user-interface/user-interface.component';
import { DialogComponent } from './components/dialog/dialog.component';


@NgModule({
  declarations: [
    MainComponent,
    FieldComponent,
    UserInterfaceComponent,
    DialogComponent
  ],
  imports: [
    CommonModule,
    GameRoutingModule
  ]
})
export class GameModule { }
