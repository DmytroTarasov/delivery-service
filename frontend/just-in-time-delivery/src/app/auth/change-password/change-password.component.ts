import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
    passwordForm!: FormGroup;
    error: string = '';
    formSubmitting = false;

    constructor(private authService: AuthService, private router: Router,
        public translateService: TranslateService) { }

    ngOnInit(): void {
        this.passwordForm = new FormGroup({
            'oldPassword': new FormControl(null, [Validators.required, Validators.minLength(6)]),
            'newPassword': new FormControl(null, [Validators.required, Validators.minLength(6)]),
        })
    }

    onSubmit() {

        if (!this.passwordForm.valid) {
            return;
        }

        this.formSubmitting = true;

        const { oldPassword, newPassword } = this.passwordForm.value;

        this.authService.changePassword(oldPassword, newPassword).subscribe({
            next: (_) => {
                this.formSubmitting = false;
                this.passwordForm.reset();
                this.clearSessionStorageData();
                this.router.navigate(['/auth']);
            },
            error: (errorMessage: string) => {
                this.formSubmitting = false;
                this.error = errorMessage;
            }
        });
    }

    clearSessionStorageData() {
        sessionStorage.removeItem('userData');
        sessionStorage.removeItem('token');
    }

}
