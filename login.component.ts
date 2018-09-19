import { Component, HostListener, ElementRef } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { AlertMessageService } from '../shared/customMessages';
import { BaThemeSpinner } from '../../theme/services/baThemeSpinner';
@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  providers: [LoginService, BaThemeSpinner, AlertMessageService],
})
export class Login {
  pages: any;

  public administrationVal: any;
  public firstlastnames: any;
  public roleID: any;
  public defaultCat: any;
  public form: FormGroup;
  public userId;
  public username: AbstractControl;
  public password: AbstractControl;
  public submitted = false;
  public msg;
  constructor(private readonly fb: FormBuilder, private readonly  _router: Router, private readonly  service: LoginService, private readonly elRef: ElementRef,
    private readonly  customMsg: AlertMessageService, private readonly spinner: BaThemeSpinner) {
    this.form = fb.group({
      'username': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });
    localStorage.clear();
    sessionStorage.clear();
    this.username = this.form.controls['username'];
    this.password = this.form.controls['password'];
  }

  // @HostListener('window:popstate', ['$event'])
  // onPopState(event) {
  //   localStorage.clear();
  //   sessionStorage.clear();
  //   this._router.navigate(['/login']);
  // }

  public onSubmit(values: Object): void {
    this.submitted = true;
    this.pages = this.elRef.nativeElement.querySelectorAll('.fa');
    this.pages[0].className = ''
    this.pages[0].className = 'fa fa-refresh fa-spin'

    if (this.form.valid) {

      //  this.spinner.show();
      const username = this.form.value.username;
      const password = this.form.value.password;
      // this._router.navigate(['./pages/resourcemanagement/vieweditresource']); 
      this.service.authenticate(username, password)

        .then((response) => {
          //  this.spinner.hide(1000);
         
          if (response.status === 401) {
           
            const message = response.message;
            if (message.search("Bad") !== -1) {
              this.msg = 'Bad Credentials.';
            
              this.customMsg.errorAlert(this.msg);
              this.changeLoadingIcon();
            }
            else if (message.search("DB") !== -1) {
              this.msg = 'User not exists in DB,Please contact ADMINISTRATOR.';
              this.customMsg.errorAlert(this.msg);
              this.changeLoadingIcon();

            }

          } else if (response.status === 0) {
            this.customMsg.errorAlert('Server down');
            this.changeLoadingIcon();

          }
          else {

            this.userId = response.data.user_ID;

            this.administrationVal = response.data.role.administration;
            this.firstlastnames = response.data.first_Name;
            this.firstlastnames = this.firstlastnames + ` ${response.data.last_Name}`;
            this.roleID = response.data.role.role_ID;
            this.defaultCat = response.data.role.defaultCategory.category_ID;

            localStorage.setItem("firstlastnames", JSON.stringify(btoa(this.firstlastnames)));
            sessionStorage.setItem("adminVal", JSON.stringify(btoa(this.administrationVal)));
            localStorage.setItem("roleID", JSON.stringify(btoa(this.roleID)));
            localStorage.setItem("defaultCategory", JSON.stringify(btoa(this.defaultCat)))
            localStorage.setItem("userid", btoa(this.userId));
            this._router.navigate(['./pages/resourcemanagement/vieweditresource']);


          }

        })
        .catch((error) => {
          console.log(error.err)

        });
      // this.form.controls['username'].setValue('');
      // this.form.controls['password'].setValue('');
    }
    else {

      this.form.controls['username'].setValue('');
      this.form.controls['password'].setValue('');
      this.changeLoadingIcon();

    }

  }
  changeLoadingIcon() {
    this.pages[0].className = ''
    this.pages[0].className = 'fa fa-lock'
  }
}
