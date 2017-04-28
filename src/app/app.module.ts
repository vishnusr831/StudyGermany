import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {routes} from './app.routes';
import { AppComponent } from './app.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ServicesComponent } from './services/services.component';
import { HomeComponent } from './home/home.component';
import { GuidelinesComponent } from './guidelines/guidelines.component';
import { ContactusComponent } from './contactus/contactus.component';
import { SearchComponent } from './search/search.component';
import { SearchFormComponent } from './search-form/search-form.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutusComponent,
    ServicesComponent,
    HomeComponent,
    GuidelinesComponent,
    ContactusComponent,
    SearchComponent,
    SearchFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routes
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
