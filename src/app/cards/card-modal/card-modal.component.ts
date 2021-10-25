import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CardService} from "../../services/card.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {config} from "rxjs";
import {Card} from "../../models/card";
import {SnackbarService} from "../../services/snackbar.service";

@Component({
  selector: 'app-card-modal',
  templateUrl: './card-modal.component.html',
  styleUrls: ['./card-modal.component.scss']
})
export class CardModalComponent implements OnInit {
  cardForm!: FormGroup;
  showSpinner: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<CardModalComponent>,
    private fb: FormBuilder,
    private cardService: CardService,
    private _snackBar: MatSnackBar,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: Card
  ) {
  }

  ngOnInit(): void {
    console.log(this.data);
    this.cardForm = this.fb.group({
      name: [this.data?.name || '', Validators.maxLength(50)],
      title: [this.data?.title || '', [Validators.required, Validators.maxLength(255)]],
      phone: [this.data?.phone || '', [Validators.required, Validators.maxLength(20)]],
      email: [this.data?.email || '', [Validators.email, Validators.maxLength(50)]],
      address: [this.data?.address || '', Validators.maxLength(255)],
    });
  }

  addCard(): void {
    this.showSpinner = true;
    this.cardService.addCard(this.cardForm.value)
      .subscribe((res: any) => {
        this.getSuccess(res || 'Kartvizitiniz əlavə olundu');
      }, (err: any) => {
        this.getError(err.message || 'Kartvizitiniz əlavə olunarkən bir xəta baş verdi.')
      });
  }

  updateCard(): void {
    this.showSpinner = true;
    this.cardService.updateCard(this.cardForm.value, this.data.id)
      .subscribe((res: any) => {
        this.getSuccess(res || 'Kartvizitiniz yeniləndi');
      }, (err: any) => {
        this.getError(err.message || 'Kartvizitiniz yenilənərkən bir xəta baş verdi.')
      })
  }

  deleteCard(): void {
    this.showSpinner = true;
    this.cardService.deleteCard(this.data.id)
      .subscribe((res: any) => {
        this.getSuccess(res || 'Kartvizitiniz silindi');
      }, (err: any) => {
        this.getError(err.message || 'Kartvizitiniz silinərkən bir xəta baş verdi.')
      });
  }

  getSuccess(message: string): void {
    this.snackbarService.createSnackbar('success',message);
    this.cardService.getCards();
    this.showSpinner = false;
    this.dialogRef.close();
  }

  getError(message: string) {
    this.snackbarService.createSnackbar('error',message);
    this.showSpinner = false;
  }

}
