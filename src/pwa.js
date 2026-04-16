import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Une mise à jour est disponible. Voulez-vous rafraîchir la page ?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('L\'application est prête à être utilisée hors-ligne.');
  },
});
