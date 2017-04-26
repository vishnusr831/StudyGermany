import {ModuleWithProviders} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ServicesComponent } from './services/services.component';
import { GuidelinesComponent } from './guidelines/guidelines.component';
import { HomeComponent } from './home/home.component';
import { ContactusComponent } from './contactus/contactus.component';
import { SearchComponent } from './search/search.component';
export const router: Routes = [

    {path : '', redirectTo: 'home', pathMatch: 'full'},
    {path : 'about', component: AboutusComponent},
    {path : 'services', component: ServicesComponent},
    {path : 'guidelines', component: GuidelinesComponent},
    {path : 'home', component: HomeComponent},
    {path : 'contactus', component: ContactusComponent},
    {path : 'search', component: SearchComponent}



];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);