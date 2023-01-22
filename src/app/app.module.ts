import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CrossmenuComponent } from './crossmenu/crossmenu.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { MenuComponent } from './menu/menu.component';
import { LateralmenuComponent } from './lateralmenu/lateralmenu.component';
import { ChickensComponent } from './chickens/chickens.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SheedComponent } from './sheed/sheed.component';
import AddfarmComponent from './addfarm/addfarm.component';
import { SpacemagnamentComponent } from './spacemagnament/spacemagnament.component';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { WaterComponent } from './water/water.component';
import { MortalityComponent } from './mortality/mortality.component';
import { WeightComponent } from './weight/weight.component';
import { InventoryComponent } from './inventory/inventory.component';
import { FooddetailsComponent } from './fooddetails/fooddetails.component';
import { VacunationComponent } from './vacunation/vacunation.component';
import { RouterhomeComponent } from './routerhome/routerhome.component';
import { RoutermenuComponent } from './routermenu/routermenu.component';
import { FoodHistoryComponent } from './food-history/food-history.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { FoodreportComponent } from './foodreport/foodreport.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MortalityReportComponent } from './mortality-report/mortality-report.component';
import { WaterReportComponent } from './water-report/water-report.component';
import { CostsReportComponent } from './costs-report/costs-report.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { NgxSpinnerModule } from 'ngx-spinner'
import { InterceptorInterceptor } from './services/interceptor.interceptor';

registerLocaleData(en);

const routes: Routes = [
  { path: '', redirectTo: '/home/news', pathMatch: 'full' },
  {
    path: 'home', component: RouterhomeComponent,
    children: [
      { path: 'news', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'registerWithGoogle/:email/:name', component: RegisterComponent },
      { path: 'registerWithFacebook/:email/:name', component: RegisterComponent }
    ]
  },
  {
    path: 'menu', component: RoutermenuComponent, ...canActivate(() => redirectUnauthorizedTo(['/home/news'])),
    children: [
      { path: 'news', component: MenuComponent, ...canActivate(() => redirectUnauthorizedTo(['/home/news'])) },
      { path: 'addFarm', component: AddfarmComponent, ...canActivate(() => redirectUnauthorizedTo(['/home/news'])) },
      { path: 'chickens/1', component: ChickensComponent, ...canActivate(() => redirectUnauthorizedTo(['/home/news'])) },
      { path: 'chickens/2', component: VacunationComponent, ...canActivate(() => redirectUnauthorizedTo(['/home/news'])) },
      { path: 'chickens/3', component: MortalityComponent, ...canActivate(() => redirectUnauthorizedTo(['/home/news'])) },
      { path: 'chickens/4', component: WeightComponent, ...canActivate(() => redirectUnauthorizedTo(['/home/news'])) },
      { path: 'sheeds/1', component: SheedComponent, ...canActivate(() => redirectUnauthorizedTo(['/home/news'])) },
      { path: 'sheeds/2', component: SpacemagnamentComponent, ...canActivate(() => redirectUnauthorizedTo(['/home/news'])) },
      { path: 'food/1', component: InventoryComponent, ...canActivate(() => redirectUnauthorizedTo(['/home/news'])) },
      { path: 'food/1/:name', component: FooddetailsComponent, ...canActivate(() => redirectUnauthorizedTo(['/home/news'])) },
      { path: 'food/2', component: WaterComponent, ...canActivate(() => redirectUnauthorizedTo(['/home/news'])) },
      { path: 'food/3', component: FoodHistoryComponent, ...canActivate(() => redirectUnauthorizedTo(['/home/news'])) },
      { path: 'foodreport', component: FoodreportComponent, ...canActivate(() => redirectUnauthorizedTo(['/home/news'])) },
      { path: 'mortalityReport', component: MortalityReportComponent, ...canActivate(() => redirectUnauthorizedTo(['/home/news'])) },
      { path: 'waterReport', component: WaterReportComponent, ...canActivate(() => redirectUnauthorizedTo(['/home/news'])) },
      { path: 'costsReport', component: CostsReportComponent, ...canActivate(() => redirectUnauthorizedTo(['/home/news'])) },
      { path: 'configurations', component: ConfigurationComponent, ...canActivate(() => redirectUnauthorizedTo(['/home/news'])) }
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CrossmenuComponent,
    AboutusComponent,
    ContactComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    MenuComponent,
    LateralmenuComponent,
    ChickensComponent,
    SheedComponent,
    AddfarmComponent,
    SpacemagnamentComponent,
    WaterComponent,
    MortalityComponent,
    WeightComponent,
    InventoryComponent,
    FooddetailsComponent,
    VacunationComponent,
    RouterhomeComponent,
    RoutermenuComponent,
    FoodHistoryComponent,
    FoodreportComponent,
    MortalityReportComponent,
    WaterReportComponent,
    CostsReportComponent,
    ConfigurationComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    NzSliderModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    BrowserAnimationsModule,
    NgxChartsModule,
    NgxSpinnerModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
