import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from '../environment';

import {
  IPublicClientApplication,
  PublicClientApplication,
  InteractionType,
  BrowserCacheLocation,
  LogLevel,
} from '@azure/msal-browser';

import {
  MSAL_INSTANCE,
  MSAL_GUARD_CONFIG,
  MSAL_INTERCEPTOR_CONFIG,
  MsalService,
  MsalGuard,
  MsalBroadcastService,
  MsalInterceptor,
  MsalGuardConfiguration,
  MsalInterceptorConfiguration,
} from '@azure/msal-angular';


// === Entra External ID config ===
const SUBDOMAIN = 'akshatwebuniversity';
const TENANT_ID = '6e6eaccf-7ddd-4bda-8560-c6d826e0c2bd';
const CLIENT_ID = 'f4922796-875f-43e1-b48b-a7771638c2f1';

const AUTHORITY = `https://${SUBDOMAIN}.ciamlogin.com/${TENANT_ID}`;
const KNOWN_AUTHORITY = `${SUBDOMAIN}.ciamlogin.com`;

// === MSAL instance factory ===
export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: CLIENT_ID,
      authority: AUTHORITY,
      knownAuthorities: [KNOWN_AUTHORITY],
      redirectUri: 'https://localhost:4200/',
      postLogoutRedirectUri: 'https://localhost:4200/',
      navigateToLoginRequestUrl: true,
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: false,
    },
    system: {
      loggerOptions: {
        loggerCallback: (level, message) => console.log(message),
        logLevel: LogLevel.Warning,
        piiLoggingEnabled: false,
      },
    },
  });
}

// === MSAL Guard config (for protected routes) ===
export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ['openid', 'profile', 'offline_access', environment.auth.apiScope],
    },
  };
}

// === MSAL Interceptor config (for auto-attaching tokens to API calls) ===
export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set(environment.gatewayURL, [environment.auth.apiScope]);
  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),

    { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory },
    { provide: MSAL_GUARD_CONFIG, useFactory: MSALGuardConfigFactory },
    { provide: MSAL_INTERCEPTOR_CONFIG, useFactory: MSALInterceptorConfigFactory },

    MsalService,
    MsalGuard,
    MsalBroadcastService,

    { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
  ],
};
