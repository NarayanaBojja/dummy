import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Login } from './login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTranslationModule } from '../../app.translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { BootstrapModalModule, DialogService } from 'ng2-bootstrap-modal';
import { FormBuilder } from '@angular/forms';
import { LoginService } from './login.service';
import { BaThemeSpinner } from '../../theme/services/baThemeSpinner';
import { AlertMessageService } from '../shared/customMessages';
import { ElementRef } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { MockBackend, MockConnection } from '@angular/http/testing';
import {
    HttpModule, Http, XHRBackend, Response, ResponseOptions
} from '@angular/http';
var login = require('../../../assets/testdata/login.componentobj.json');

class MockElementRef implements ElementRef {
    nativeElement = {};
}

class LoginServiceSpy {

    public authenticate() {
        return Promise.resolve(login.user);
    }
}

describe('Component: LoginComponent', () => {

    let backend: MockBackend;
    let loginService: LoginService;
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    let component: any;
    let fixture: ComponentFixture<Login>;

    let authenticateSpy: any;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                AppTranslationModule,
                FormsModule,
                ReactiveFormsModule,
                NgaModule,
                BootstrapModalModule,
                HttpModule
            ],
            declarations: [
                Login
            ],
            providers: [{ provide: Router, useValue: routerSpy }, FormBuilder,
            { provide: LoginService, useClass: LoginServiceSpy },
                BaThemeSpinner, AlertMessageService, { provide: ElementRef, useValue: new MockElementRef() }]
        }).compileComponents();
        fixture = TestBed.createComponent(Login);
        authenticateSpy = TestBed.get(LoginService);
        component = fixture.componentInstance;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
        expect(authenticateSpy).toBeTruthy();
    });

    it('should contain login button', () => {
        fixture.detectChanges();
        const bannerElement: HTMLElement = fixture.nativeElement;
        let btnsList: any = bannerElement.getElementsByTagName("button");
        expect(btnsList[0].textContent.trim()).toEqual('Log In');
    });

    it('form invalid when empty', () => {
        expect(component.form.valid).toBeFalsy();
    });

    it('username field validity', () => {
        let errors = {};
        let username = component.form.controls['username'];
        expect(username.valid).toBeFalsy();
        // username field is required
        errors = username.errors || {};
        expect(errors['required']).toBeTruthy();
        // Set username to something  bathiyat
        username.setValue(login.validcred.username);
        errors = username.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['minlength']).toBeFalsy();
        expect(username.valid).toBeTruthy();
        //should be minlength error
        username.setValue(login.min);
        errors = username.errors || {};
        expect(errors['minlength']).toBeTruthy();

    });

    it('password field validity', () => {
        let errors = {};
        let password = component.form.controls['password'];
        expect(password.valid).toBeFalsy();
        // password field is required
        errors = password.errors || {};
        expect(errors['required']).toBeTruthy();
        // Set password to something
        password.setValue(login.validcred.password);
        errors = password.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['minlength']).toBeFalsy();

        // should be minlength error
        password.setValue(login.min);
        errors = password.errors || {};
        expect(errors['minlength']).toBeTruthy();

    });
    it('onSubmit method should be defined', () => {
        expect(component.onSubmit).toBeDefined();
    });

    it('submitting a form with in-valid credentials', () => {

        let user = { message: "Bad Credentials", status: 401 };
        let loginService = fixture.debugElement.injector.get(LoginService);
        const spyUsersData = spyOn(loginService, 'authenticate').and.returnValue(Promise.resolve(login.userFail));

        expect(component.form.valid).toBeFalsy();
        component.form.controls['username'].setValue(login.invalidcred.username);
        component.form.controls['password'].setValue(login.invalidcred.password);
        expect(component.form.valid).toBeTruthy();
        component.onSubmit(null);

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(component.msg).toContain('Bad')
        });
    });

    it('submitting a form with valid credentials', () => {

        let loginService = fixture.debugElement.injector.get(LoginService);
        const spyUsersData = spyOn(loginService, 'authenticate').and.returnValue(Promise.resolve(login.user));

        expect(component.form.valid).toBeFalsy();
        component.form.controls['username'].setValue(login.validcred.username);
        component.form.controls['password'].setValue(login.validcred.password);
        expect(component.form.valid).toBeTruthy();

        component.onSubmit(null);

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            console.log(component.userId);
            expect(component.userId).toEqual(1);

        });

    });

});