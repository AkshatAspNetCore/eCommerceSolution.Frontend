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

  /** TODO Step 10: read role/group claim from the JWT. */
  get isAdmin(): boolean {
    return false;
  }

  /** Display name from the active MSAL account. */
  get currentusername(): string | null {
    const account = this.msal.instance.getActiveAccount();
    return account?.name || account?.username || null;
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
