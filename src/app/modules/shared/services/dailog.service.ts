import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@shared/components';

@Injectable({
    providedIn: 'root'
})
export class DialogService {

    constructor(private dialog: MatDialog) {
    }

  public openConfirmDialog(): void {
      this.dialog.open(ConfirmDialogComponent, {
        width: '250px',
        disableClose: true
      });
    }
}
