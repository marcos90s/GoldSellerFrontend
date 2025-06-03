import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideZoneChangeDetection({eventCoalescing: true}),
    //função para registrar os provedores do HttpClient.
    //Adiona o provide ao array de providers kkk
    provideHttpClient()
  ]
};
