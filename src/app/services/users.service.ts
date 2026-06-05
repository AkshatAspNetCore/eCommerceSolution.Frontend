import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

/**
 * Adapter around MSAL — keeps the old UsersService surface
 * (isAuthenticated, isAdmin, currentusername, userID, logout)
 * so the rest of the app keeps working unchanged after the
 * migration from local auth to Microsoft Entra External ID.
 */
@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private msal: MsalService) {}

  /** True if a user is signed in via MSAL. */
  get isAuthenticated(): boolean {
    return this.msal.instance.getAllAccounts().length > 0;
  }

 /** True if the signed-in user has the Admin app role from Entra. */
  get isAdmin(): boolean {
  const account = this.msal.instance.getActiveAccount();
  const claims = account?.idTokenClaims as Record<string, unknown> | undefined;
  const roles = (claims?.['roles'] as string[] | undefined) ?? [];
  return roles.includes('Admin');
  }

  /** Display name from the active MSAL account. */
  get currentusername(): string | null {
     const account = this.msal.instance.getActiveAccount();
     if (!account) return null;

     // 'unknown' is Entra's placeholder when Display Name wasn't collected at sign-up
     if (account.name && account.name !== 'unknown') {
      return account.name;
     }

     const claims = account.idTokenClaims as Record<string, unknown> | undefined;
     const given = claims?.['given_name'] as string | undefined;
     const family = claims?.['family_name'] as string | undefined;
     if (given || family) {
       return `${given ?? ''} ${family ?? ''}`.trim();
     }

    return account.username || null;
  }

  /** Entra Object ID of the signed-in user (oid claim). */
get userID(): string | null {
  const account = this.msal.instance.getActiveAccount();
  return account?.localAccountId || (account?.idTokenClaims?.['oid'] as string) || null;
}

  /** Triggers MSAL redirect-based sign-out. */
  logout(): void {
    this.msal.logoutRedirect();
  }
}
