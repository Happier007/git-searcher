import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';

const MODULES = [
    MatToolbarModule,
    MatCardModule,
    MatDividerModule,
    MatCheckboxModule,
    MatIconModule,
    MatTableModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule
]

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MODULES
    ],
    exports: [
        MODULES
    ],
})
export class AppMaterialModule {
}
