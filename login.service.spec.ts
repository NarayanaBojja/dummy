import { TestBed, async } from '@angular/core/testing';
import { LoginService } from './login.service';

import { MockBackend, MockConnection } from '@angular/http/testing';
import {
    HttpModule, Http, XHRBackend, Response, ResponseOptions
} from '@angular/http';

var login = require('./login.componentobj.json');

describe('LoginService ', () => {
    let backend: MockBackend;
    let loginService: LoginService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                LoginService,
                { provide: XHRBackend, useClass: MockBackend }
            ]
        });

    });
    it('can instantiate service via DI', () => {
        loginService = TestBed.get(LoginService);
        expect(loginService instanceof LoginService).toBe(true);
    });

    it('should return user object', () => {
    

        let options = new ResponseOptions({ status: 200, body: { data: login.user.data } });
        let response: Response = new Response(options);
        backend = TestBed.get(XHRBackend);
        backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
        loginService = TestBed.get(LoginService);
        loginService.authenticate(login.validcred.username, login.validcred.password).then((res) => {

            expect(res.userId).toEqual(login.user.data.user_ID);
        });

    });

    it('submitting a form with in-valid credentials', () => {

        let options = new ResponseOptions({ status: 200, body: JSON.stringify(login.userFail) });
        let response: Response = new Response(options);
        backend = TestBed.get(XHRBackend);
        backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
        loginService = TestBed.get(LoginService);
        loginService.authenticate(login.invalidcred.username, login.invalidcred.password).then((res) => {
            expect(res.message).toContain('Bad');
        });

    });

});

