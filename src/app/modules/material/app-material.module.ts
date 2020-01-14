import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// FLEX LAYOUT
import { FlexLayoutModule } from '@angular/flex-layout';

// MATERIAL
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
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material/expansion';

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
    MatPaginatorModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatTooltipModule,
    MatListModule,
    MatBadgeModule,
    MatExpansionModule,
    FlexLayoutModule
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
