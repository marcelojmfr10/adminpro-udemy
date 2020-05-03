import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';

const APP_ROUTES: Routes = [
    // {
    //     path: '',
    //     component: PagesComponent,
    //     children: [
    //         { path: 'dashboard', component: DashboardComponent},
    //         { path: 'progress', component: ProgressComponent},
    //         { path: 'graficas1', component: Graficas1Component},
    //         { path: '', pathMatch: 'full', redirectTo: 'dashboard'},
    //     ]
    // },
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: '**', component: NopagefoundComponent}
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, { useHash: true});
