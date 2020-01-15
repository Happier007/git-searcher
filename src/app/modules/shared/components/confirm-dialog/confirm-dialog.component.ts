// ANGULAR
import { Component } from '@angular/core';

// MATERIAL
import { MatDialogRef } from '@angular/material/dialog';

// MAIN
import { GitService } from '@services/git.service';


@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

    constructor(private gitService: GitService,
                private dialogRef: MatDialogRef<ConfirmDialogComponent>) {
    }

    logout() {
        this.gitService.logout();
        this.dialogRef.close();
    }

    private close() {
        this.dialogRef.close();
    }
}
