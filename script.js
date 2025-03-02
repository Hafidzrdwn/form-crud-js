import { apps } from './apps.js';

const jenisAplikasiSelect = document.getElementById('jenisAplikasi');
const aplikasiSelect = document.getElementById('aplikasi');
const tipeOrderSelect = document.getElementById('tipeOrder');
const durasiSelect = document.getElementById('durasi');
const tanggalInput = document.getElementById('tanggal');

tanggalInput.value = new Date().toISOString().split('T')[0];

jenisAplikasiSelect.addEventListener('change', function () {
  
  const selectedJenis = this.value;
  
  let options = `<option value="">-- Pilih Aplikasi --</option>`;
  if (selectedJenis) {
    // APLIKASI
    const appsSelected = apps[selectedJenis];
    aplikasiSelect.disabled = false;
    appsSelected.forEach(app => {
      options += `<option value="${app.name}">${app.name}</option>`;
    });
  } else {
    aplikasiSelect.disabled = true;
  }
  aplikasiSelect.innerHTML = options;

  if (!tipeOrderSelect.disabled) {
    aplikasiSelect.dispatchEvent(new Event('change'));
  }
});

aplikasiSelect.addEventListener('change', function () {
  const selectedJenis = jenisAplikasiSelect.value;
  let selectedApp = this.value;

  let options = `<option value="">-- Pilih Tipe Order --</option>`;
  if (selectedJenis && selectedApp) {
    const appsSelected = apps[selectedJenis];
    const appSelected = appsSelected.find(app => app.name === selectedApp);

    appSelected.types.forEach(type => {
      options += `<option value="${type.type}">${type.type}</option>`;
    });
    tipeOrderSelect.disabled = false;
  } else {
    tipeOrderSelect.disabled = true;
  }

  tipeOrderSelect.innerHTML = options;

  if (!durasiSelect.disabled) {
    tipeOrderSelect.dispatchEvent(new Event('change'));
  }
});

tipeOrderSelect.addEventListener('change', function () {
  const selectedJenis = jenisAplikasiSelect.value;
  const selectedApp = aplikasiSelect.value;
  const selectedType = this.value;

  let options = `<option value="">-- Pilih Durasi --</option>`;
  if (selectedJenis && selectedApp && selectedType) {
    const appsSelected = apps[selectedJenis];
    const appSelected = appsSelected.find(app => app.name === selectedApp);
    const typeSelected = appSelected.types.find(type => type.type === selectedType);
    for (const [key, value] of Object.entries(typeSelected.duration)) {
      const formatDuration = key.replace(/_/g, ' ');
      options += `<option value="${key}">${formatDuration} - ${toRupiah(value)}</option>`;
    }
    durasiSelect.disabled = false;
  } else {
    durasiSelect.disabled = true;
  }

  durasiSelect.innerHTML = options;
});

function toRupiah(number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
}