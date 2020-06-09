/*
 * Anarchy, a Direct Democracy system. Copyright 2020 - Thomas Hansen thomas@servergardens.com
 */

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { CaseService } from 'src/app/services/http/case.service';

/*
 * Input data to dialog.
 * Notice, if dialog is instantiated in "create entity mode", the
 * entity property will be an empty object, with no fields.
 */
export interface DialogData {
  isEdit: boolean;
  isAccept: boolean;
  entity: any;
}

/*
 * Modal dialog for editing your existing Cases entity types, and/or
 * creating new entity types.
 */
@Component({
  templateUrl: './edit.cases.component.html',
  styleUrls: ['./edit.cases.component.scss']
})
export class EditCasesComponent implements OnInit {

  /*
   * Only the following properties of the given data.entity will actually
   * be transmitted to the server when we create records. This is done to
   * make sure we don't submit "automatic" primary key values.
   */
  private createColumns: string[] = ['region', 'subject', 'body'];
  private updateColumns: string[] = ['id', 'type', 'deadline'];
  private primaryKeys: string[] = ['id'];

  /*
   * Constructor taking a bunch of services injected using dependency injection.
   */
  constructor(
    public dialogRef: MatDialogRef<EditCasesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private snackBar: MatSnackBar,
    private service: CaseService) { }

  ngOnInit(): void {
    if (this.data.isAccept) {
      this.data.entity.type = 'open';
      const when = new Date();
      when.setDate(when.getDate() + 30);
      this.data.entity.deadline = when;
    }
  }

  getCodeMirrorOptions() {
    return {
      lineNumbers: true,
      theme: 'material',
      mode: 'markdown'
    };
  }

  canEditColumn(name: string) {
    if (this.data.isAccept && (name === 'type' || name === 'body')) {
      return false;
    }
    if (this.data.isEdit) {
      return this.updateColumns.filter(x => x === name).length > 0 &&
        this.primaryKeys.filter(x => x === name).length == 0;
    }
    return this.createColumns.filter(x => x === name).length > 0;
  }

  /*
   * Invoked when the user clicks the "Save" button.
   */
  save() {

    /*
     * Checking if we're editing an existing entity type, or if we're
     * creating a new instance.
     */
    if (this.data.isAccept) {

      // Updating existing item. Invoking update HTTP REST endpoint and closing dialog.
      const args = {
        id: this.data.entity.id,
        deadline: this.data.entity.deadline,
      };
      this.service.acceptCase(args).subscribe(res => {
        this.dialogRef.close(this.data.entity);
        if (res['updated-records'] !== 1) {

          // Oops, error!
          this.snackBar.open(`Oops, number of items was ${res['updated-records']}, which is very wrong. Should have been 1`, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        }
      }, error => {

        // Oops, error!
        this.snackBar.open(error.error.message, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      });
    } else if (this.data.isEdit) {

      /*
       * Removing all columns that we're not supposed to transmit during "edit mode".
       */
      for (const idx in this.data.entity) {
        if (this.updateColumns.indexOf(idx) === -1) {
          delete this.data.entity[idx];
        }
      }

      // Updating existing item. Invoking update HTTP REST endpoint and closing dialog.
      this.service.updateCase(this.data.entity).subscribe(res => {
        this.dialogRef.close(this.data.entity);
        if (res['updated-records'] !== 1) {

          // Oops, error!
          this.snackBar.open(`Oops, number of items was ${res['updated-records']}, which is very wrong. Should have been 1`, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        }
      }, error => {

        // Oops, error!
        this.snackBar.open(error.error.message, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      });
    } else {

      /*
       * Removing all columns that we're not supposed to transmit during "create mode".
       */
      for (const idx in this.data.entity) {
        if (this.createColumns.indexOf(idx) === -1) {
          delete this.data.entity[idx];
        }
      }

      // Creating new item. Invoking create HTTP REST endpoint and closing dialog.
      this.service.createCase(this.data.entity).subscribe(res => {
        this.dialogRef.close(this.data.entity);

        if (res === null || res === undefined) {
          // Oops, error!
          this.snackBar.open(`Oops, for some reasons backend returned ${res}, which seems to be very wrong!`, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        }
      }, error => {

        // Oops, error!
        this.snackBar.open(error.error.message, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      });
    }
  }

  // Invoked when user cancels edit/create operation.
  cancel() {
    this.dialogRef.close();
  }
}
