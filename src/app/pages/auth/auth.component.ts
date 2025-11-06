// src/app/pages/auth/auth.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  isLogin: boolean = true;
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  selectedRole: 'TEACHER' | 'STUDENT' = 'STUDENT';
  loading: boolean = false;
  cardAnimation: boolean = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadAuthMode();
  }

  initForms(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['STUDENT'],
    });
  }

  private loadAuthMode(): void {
    // تحميل الحالة من sessionStorage
    const mode = sessionStorage.getItem('authMode');
    if (mode === 'register') {
      this.isLogin = false;
    } else {
      this.isLogin = true;
    }
    sessionStorage.removeItem('authMode');

    // تشغيل حركة البطاقة
    setTimeout(() => (this.cardAnimation = true), 50);
  }

  toggleMode(): void {
    this.isLogin = !this.isLogin;
    this.cardAnimation = false;
    setTimeout(() => (this.cardAnimation = true), 50);
  }

  onFocus(event: any) {
    event.target.closest('.glow-border').classList.add('active');
  }

  onBlur(event: any) {
    event.target.closest('.glow-border').classList.remove('active');
  }

  onRoleSelect(role: 'TEACHER' | 'STUDENT'): void {
    this.selectedRole = role;
    this.registerForm.patchValue({ role: role });
  }

  async onSubmit(): Promise<void> {
    const form = this.isLogin ? this.loginForm : this.registerForm;
    form.markAllAsTouched();
    this.loading = true;
    try {
      if (this.isLogin) {
        if (this.loginForm.valid) {
          const { email, password } = this.loginForm.value;
          await this.authService.login(email, password).toPromise();

          await Swal.fire({
            title: 'تم تسجيل الدخول بنجاح!',
            text: 'مرحباً بك في منصة عبور.',
            icon: 'success',
            confirmButtonText: 'متابعة',
            confirmButtonColor: '#3b82f6',
            timer: 2000,
            timerProgressBar: true,
            willClose: () => {
              this.router.navigate(['/home']);
            },
          });
        }
      } else {
        if (this.registerForm.valid) {
          const { name, email, password } = this.registerForm.value;
          await this.authService
            .register(name, email, password, this.selectedRole)
            .toPromise();

          await Swal.fire({
            title: 'تم إنشاء الحساب بنجاح!',
            html: 'يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.<br>يمكنك الآن تسجيل الدخول.',
            icon: 'success',
            confirmButtonText: 'حسناً',
            confirmButtonColor: '#3b82f6',
          });
          this.isLogin = true;
          this.cardAnimation = false;
          setTimeout(() => (this.cardAnimation = true), 50);
        }
      }
    } catch (error: any) {
      console.error('Auth Error:', error);
      const errorMessage = error?.error?.message || 'حدث خطأ أثناء المصادقة';

      await Swal.fire({
        title: 'خطأ في المصادقة',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'إغلاق',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      this.loading = false;
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const form = this.isLogin ? this.loginForm : this.registerForm;
    return !!(form.get(fieldName)?.invalid && form.get(fieldName)?.touched);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.isLogin
      ? this.loginForm.get(fieldName)
      : this.registerForm.get(fieldName);
    if (control?.errors?.['required']) return 'هذا الحقل مطلوب';
    if (control?.errors?.['email']) return 'رجاءً أدخل بريد إلكتروني صحيح';
    if (control?.errors?.['minlength'])
      return 'يجب أن يكون طول النص على الأقل 6 أحرف';
    return '';
  }
}
