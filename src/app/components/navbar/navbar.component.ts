import { AfterViewInit, Component, ElementRef, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';
import { AuthService, User } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnDestroy {
  heightToolbar = 0;
  me: User | undefined | null;
  private destroyed$ = new Subject<void>();

  constructor(private authService: AuthService, private matIconRegistry: MatIconRegistry){
    this.authService.currentUser$
      .pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe(user => {
        this.me = user;
        if(user){
          this.matIconRegistry.addSvgIcon("profile", "https://w7.pngwing.com/pngs/529/832/png-transparent-computer-icons-avatar-user-profile-avatar.png")
        }
      })
  }

  logout(): void{
    this.authService.logout();
  }
  
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
