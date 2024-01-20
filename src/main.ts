import { bootstrapApplication } from '@angular/platform-browser'
import { appConfig } from './app/app.config'
import { AppComponent } from './app/app.component'

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => {
    // TODO: logger util
    console.error('bootstrapApp error', err.message)
  })
