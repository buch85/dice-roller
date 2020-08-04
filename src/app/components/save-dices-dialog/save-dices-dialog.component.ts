import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-save-dices-dialog',
  templateUrl: './save-dices-dialog.component.html',
  styleUrls: ['./save-dices-dialog.component.scss']
})
export class SaveDicesDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<SaveDicesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string, expression: string }) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
