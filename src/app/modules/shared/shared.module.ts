import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// MATERIAL
import { AppMaterialModule } from '@material/app-material.module';
import { ConfirmDialogComponent } from '@shared/components';


@NgModule({
    declarations: [ConfirmDialogComponent],
    imports: [
        CommonModule,
        AppMaterialModule
    ],
})
export class SharedModule {
}
