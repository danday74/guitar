import { APP_INITIALIZER, ApplicationConfig } from '@angular/core'
import { provideRouter, withComponentInputBinding } from '@angular/router'
import { routes } from './app.routes'
import { AppInitService } from '@services/app-init.service'

const initializeAppFactory = (appInitService: AppInitService): () => Promise<boolean> => {
  return () => appInitService.init()
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      multi: true,
      deps: [AppInitService]
    }
  ]
}
