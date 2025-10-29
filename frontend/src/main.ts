import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app-routing.module';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { appConfig } from './app/app.config';

import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init({
  duration: 800,
  once: true,
});

bootstrapApplication(AppComponent, appConfig) // Passa la configurazione qui
  .catch((err) => console.error(err));
