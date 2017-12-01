import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FlightsComponent } from './flights/flights.component';
import { CityComponent } from './city/city.component';
import { CityVideoComponent } from './city-video/city-video.component';
import { SeatsComponent } from './seats/seats.component';
import { BookingComponent } from './booking/booking.component';
import { GuardService } from './shared/guard.service';

// Route Configuration
export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: HomeComponent,
        canActivate: [GuardService]
    },
    {
        path: 'barcelona',
        component: CityComponent,
        canActivate: [GuardService]
    },
    {
        path: 'barcelona-video',
        component: CityVideoComponent,
        canActivate: [GuardService]
    },
    {
        path: 'flights',
        component: FlightsComponent,
        canActivate: [GuardService]
    },
    {
        path: 'seats',
        component: SeatsComponent,
        canActivate: [GuardService]
    },
    {
        path: 'booking',
        component: BookingComponent,
        canActivate: [GuardService]
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
