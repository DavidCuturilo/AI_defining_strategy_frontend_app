import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastr: ToastrService) {
  }

  public showSuccessToast(message: string): void {
    this.toastr.success(message, 'Success', {
        positionClass: 'toast-top-right',
        closeButton: true,
    });
  }

  public showErrorToast(message: string = 'Unexpected error occurred'): void {
    this.toastr.error(message, 'Error', {
        positionClass: 'toast-top-right',
        closeButton: true,
    });
  }

}
