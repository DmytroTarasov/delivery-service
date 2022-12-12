import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
    isLoginMode = false;
    authForm!: FormGroup;
    error: string = '';
    formSubmitting = false;
    registerMessage = '';
    pickedFile: any;
    previewUrl!: string | ArrayBuffer | null;
    emailSent = false;
    sendingForgetPasswordRequest = false;

    constructor(private authService: AuthService, private router: Router,
        public translateService: TranslateService) { }

    ngOnInit(): void {
        this.authForm = new FormGroup({
            'email': new FormControl(null, [Validators.required, Validators.email]),
            'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
            'role': new FormControl('SHIPPER', [Validators.required]),
            'image': new FormControl(null)
        })
    }

    onSwitchMode() {
        this.registerMessage = '';
        this.error = '';
        this.isLoginMode = !this.isLoginMode;
        this.emailSent = false;
    }

    onSubmit() {

        if (!this.authForm.valid) {
            return;
        }

        this.formSubmitting = true;

        const { email, password, role, image } = this.authForm.value;

        let authObservable: Observable<any>;
        if (this.isLoginMode) {
            authObservable = this.authService.login(email, password);
        } else {
            authObservable = this.authService.register(email, password, role, image);
        }

        authObservable.subscribe({
            next: (responseData) => {
                this.formSubmitting = false;
                if (!responseData.jwt_token) {
                    this.registerMessage = responseData.message;
                    return;
                }
                this.authService.getUserProfile().subscribe(_ => {
                    this.authForm.reset();
                    this.router.navigate(['/']);
                });
            },
            error: (errorMessage: string) => {
                this.formSubmitting = false;
                this.error = errorMessage;
            }
        });
    }

    changeRole(e: any) {
        this.role?.setValue(e.target.value, {
            onlySelf: true
        });
    }

    get role() {
        return this.authForm.get('role');
    }

    onFileChange(event: any) {
        if (event.target.files && event.target.files.length === 1) {
            this.pickedFile = event.target.files[0];

            const fileReader = new FileReader();

            fileReader.onload = () => {
                this.previewUrl = fileReader.result;
            };

            fileReader.readAsDataURL(this.pickedFile);
        }
    }

    forgotPassword() {
        this.error = '';
        const email = this.authForm.get('email')!!.value;
        if (!email) {
            this.error = 'Email is required';
            return;
        }
        this.sendingForgetPasswordRequest = true;
        this.authService.forgotPassword(email)
            .subscribe({
                next: (_) => {
                    this.sendingForgetPasswordRequest = false;
                    this.emailSent = true;
                },
                error: (errorMessage) => {
                    this.sendingForgetPasswordRequest = false;
                    this.error = errorMessage;
                }
            });
    }
}
