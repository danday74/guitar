import { APP_INITIALIZER, ApplicationConfig } from '@angular/core'
import { provideRouter, withComponentInputBinding } from '@angular/router'
import { routes } from './app.routes'
import { AppInitService } from '@services/app-init.service'

const initAppFactory = (appInitService: AppInitService): () => Promise<boolean> => {
  return () => appInitService.init()
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    {
      provide: APP_INITIALIZER,
      useFactory: initAppFactory,
      multi: true,
      deps: [AppInitService]
    }
  ]
}
