import {ModuleWithProviders} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ServicesComponent } from './services/services.component';

export const router: Routes = [

{
    path : '', redirectTo: 'about', pathMatch: 'full'},
     {path : 'about', component: AboutusComponent},
{  path : 'services', component: ServicesComponent}


];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);