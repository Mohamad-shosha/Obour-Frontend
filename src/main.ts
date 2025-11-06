import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import AOS from 'aos';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(() => {
    AOS.init({
      duration: 800, // مدة الأنيميشن بالملّي ثانية
      once: true, // الأنيميشن يحصل مرة واحدة فقط
    });
  })
  .catch((err) => console.error(err));
