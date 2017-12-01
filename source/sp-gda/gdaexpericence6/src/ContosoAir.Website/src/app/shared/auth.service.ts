import {Injectable} from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
    public get adalConfig(): any {
        return {
            tenant: environment.adal.tenant,
            clientId: environment.adal.clientId,
            redirectUri: window.location.origin + '/',
            postLogoutRedirectUri: window.location.origin + '/',
            extraQueryParameter: environment.adal.extraQueryParameter
        }
    }
}