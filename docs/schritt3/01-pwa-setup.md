# PWA-Konfuguration und Setup

Die PWA wurde mithilfe von vite-plugin-pwa konfiguriert und eingerichtet. Die Konfiguration wurde in der Datei vite.config.ts vorgenommen. Da das Projekt auf Standard Vite läuft war dieses Plugin die beste Wahl, da es ziemlich einfach zu installieren ist und das Projekt sehr leicht auf die neuen Funktionalitäten angepasst werden kann. Die Farbwerte wurden direkt aus dem Tokenset übernommen um die visuelle Konsistenz der App beizubehalten.

### Setup Notiz

Zuerst npm run build, dann npm run preview.

Dies ist der Fall, da Service Worker nur auf localhost oder HTTPS installiert werden können.

Da die GitHub Pages Website über HTTPS läuft ist der obig angeführte Setupbefehl nicht notwendig.


### Manifest-Werte

- name: 'VibeConnect App',
- short_name: 'VCApp',
- start_url: '/FRONT-assignment3/',
- description: 'The Only Conference App You Need',
- theme_color: '#850c54',
- background_color: '#ffffff',
- display: 'standalone',
- scope: '/FRONT-assignment3/',
- id: '/FRONT-assignment3/',
- icons:
  - { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
  - { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
  - { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }