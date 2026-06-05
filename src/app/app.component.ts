import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLinkActive, RouterOutlet, RouterLink, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import {
  MsalService,
  MsalBroadcastService,
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration,
} from '@azure/msal-angular';

import {
  AuthenticationResult,
  EventMessage,
  EventType,
  InteractionStatus,
  RedirectRequest,
} from '@azure/msal-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    ReactiveFormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  userName: string | null = null;
  searchForm: FormGroup;

  private readonly destroy$ = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      searchStr: ['']
    });
  }

  ngOnInit(): void {
    this.authService.handleRedirectObservable().subscribe();

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.updateAuthState());

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
        takeUntil(this.destroy$)
      )
      .subscribe((result: EventMessage) => {
        const payload = result.payload as AuthenticationResult;
        this.authService.instance.setActiveAccount(payload.account);
        this.updateAuthState();
      });
  }

  signIn(): void {
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect({
        ...this.msalGuardConfig.authRequest,
      } as RedirectRequest);
    } else {
      this.authService.loginRedirect();
    }
  }

  signOut(): void {
    this.authService.logoutRedirect({
      postLogoutRedirectUri: 'https://localhost:4200/',
    });
  }

  get isAdmin(): boolean {
  const account = this.authService.instance.getActiveAccount();
  const claims = account?.idTokenClaims as Record<string, unknown> | undefined;
  const roles = (claims?.['roles'] as string[] | undefined) ?? [];
  return roles.includes('Admin');
  }

  search(): void {
    const searchStr = this.searchForm.value.searchStr;
    if (searchStr && searchStr.trim()) {
      this.router.navigate(['/products', 'showcase'], {
        queryParams: { q: searchStr.trim() }
      });
    } else {
      this.router.navigate(['/products', 'showcase']);
    }
  }

private updateAuthState(): void {
  const accounts = this.authService.instance.getAllAccounts();
  this.isLoggedIn = accounts.length > 0;

  if (this.isLoggedIn) {
    if (!this.authService.instance.getActiveAccount()) {
      this.authService.instance.setActiveAccount(accounts[0]);
    }
    const account = this.authService.instance.getActiveAccount();

    if (account?.name && account.name !== 'unknown') {
      this.userName = account.name;
    } else if (account?.username) {
      this.userName = account.username.split('@')[0];
    } else {
      this.userName = null;
    }
  } else {
    this.userName = null;
  }
}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
