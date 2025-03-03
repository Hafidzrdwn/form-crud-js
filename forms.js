// get all input fields
const inputNama = document.getElementById('nama');
const inputTanggal = document.getElementById('tanggal');
const jenisAplikasiSelect = document.getElementById('jenisAplikasi');
const aplikasiSelect = document.getElementById('aplikasi');
const tipeOrderSelect = document.getElementById('tipeOrder');
const durasiSelect = document.getElementById('durasi');
const inputEmail = document.getElementById('email');
const inputDevice = document.getElementById('device');
const paymentSelect = document.getElementById('payment');
const orderForm = document.getElementById('orderForm');

const submitBtn = document.getElementById('btnSubmit');

// check if input is empty
function checkInput(input) {
  if (input.value.trim() === '') {
    const inputLabel = input.previousElementSibling
    showError(input, `${inputLabel.textContent} wajib diisi!`);
    return false;
  } else {
    showSuccess(input);
    return true;
  }
}

// check if input is valid email
function checkEmail(input) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailPattern.test(input.value)) {
    showSuccess(input);
    return true;
  } else {
    showError(input, 'Email tidak valid!');
    return false;
  }
}

// do validation
function validateForm() {
  let isValid = true;
  
  isValid = checkInput(inputNama) && isValid;
  isValid = checkInput(inputTanggal) && isValid;
  isValid = checkInput(jenisAplikasiSelect) && isValid;
  isValid = checkInput(aplikasiSelect) && isValid;
  isValid = checkInput(tipeOrderSelect) && isValid;
  isValid = checkInput(durasiSelect) && isValid;
  isValid = checkInput(inputEmail) && isValid;
  isValid = checkInput(inputDevice) && isValid;
  isValid = checkInput(paymentSelect) && isValid;

  if(inputEmail.value.trim() !== '') {
    isValid = checkEmail(inputEmail) && isValid;
  }
  
  return isValid;
}

// show error message
function showError(input, message) {
  const errorText = input.nextElementSibling;
  errorText.innerText = message;
  input.classList.add('error');
}

// show success message
function showSuccess(input) {
  input.classList.remove('error');
  const errorText = input.nextElementSibling;
  errorText.innerText = '';
}

import { apps } from './apps.js';
let editId = null; // Menyimpan ID data yang sedang diedit

// event listener
orderForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const isValid = validateForm();

  // cek jika semua input sudah valid
  if (isValid) {
    
    // ambil seluruh value dari input
    const nama = inputNama.value;
    const tanggal = inputTanggal.value;
    const jenisAplikasi = jenisAplikasiSelect.value;
    const aplikasi = aplikasiSelect.value;
    const tipeOrder = tipeOrderSelect.value;
    const durasi = durasiSelect.value;
    const email = inputEmail.value;
    const device = inputDevice.value;
    const payment = paymentSelect.value;

    // GET HARGA FROM apps object
    const appSelected = apps[jenisAplikasi].find(app => app.name === aplikasi);
    const typeSelected = appSelected.types.find(type => type.type === tipeOrder);
    const price = typeSelected.duration[durasi];

    const orderId = new Date().getTime();

    // simpan data ke local storage
    const order = {
      orderId,
      nama,
      tanggal,
      jenisAplikasi,
      aplikasi,
      tipeOrder,
      durasi,
      email,
      price,
      device,
      payment
    };
    
    saveToLocalStorage(order);
    renderOrderToTable(getFromLocalStorage());

    alert('Data Order berhasil disimpan!');
    // reset form
    orderForm.reset();
  }
});

function getFromLocalStorage() {
  const orders = JSON.parse(localStorage.getItem('order'));
  return orders || [];
}

let table = document.getElementById('orderTable');
const orderEmptyText = document.querySelector('.order-empty');

function renderOrderToTable(data) {
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = '';

  if (!data || data.length === 0) {
    table.style.display = 'none';
    orderEmptyText.style.display = 'block';
    return;
  }

  table.style.display = 'table';
  orderEmptyText.style.display = 'none';

  data.forEach(order => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${order.nama}</td>
      <td>${order.tanggal}</td>
      <td>${order.jenisAplikasi}</td>
      <td>${order.aplikasi}</td>
      <td>${order.tipeOrder}</td>
      <td>${order.durasi}</td>
      <td>${toRupiah(order.price)}</td>
      <td>${order.email}</td>
      <td>${order.device}</td>
      <td>${order.payment}</td>
      <td>
        <div class="btn-group">
          <button class="btn btn-warning btn-sm" onClick="editData(${order.orderId})">Edit</button>
          <button class="btn btn-danger btn-sm" onClick="hapusData(${order.orderId})">Hapus</button>
        </div>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function readData() {
  const dataOrders = getFromLocalStorage();
  renderOrderToTable(dataOrders);
}

// Panggil readData saat halaman dimuat
readData();

function saveToLocalStorage(data) {
  // get data from local storage
  const orders = getFromLocalStorage();

  if (editId !== null) {
    const index = orders.findIndex((order) => order.orderId === editId);
    if (index !== -1) {
      data.orderId = editId;
      orders[index] = data;
    }
    editId = null; 
  } else {
    orders.push(data);
  }
  
  localStorage.setItem('order', JSON.stringify(orders));
}

function toRupiah(number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
}

window.editData = function (orderId) {
  submitBtn.innerText = 'Edit Data';
  const orders = getFromLocalStorage();
  const order = orders.find(order => order.orderId === orderId);
  if (!order) return;
  
  aplikasiSelect.disabled = false;
  tipeOrderSelect.disabled = false;
  durasiSelect.disabled = false;

  inputNama.value = order.nama;
  inputTanggal.value = order.tanggal;
  jenisAplikasiSelect.value = order.jenisAplikasi;
  jenisAplikasiSelect.dispatchEvent(new Event('change'));
  
  setTimeout(() => {
    aplikasiSelect.value = order.aplikasi;
    aplikasiSelect.dispatchEvent(new Event('change'));
    
    setTimeout(() => {
      tipeOrderSelect.value = order.tipeOrder;
      tipeOrderSelect.dispatchEvent(new Event('change'));
      
      setTimeout(() => {
        durasiSelect.value = order.durasi;
      }, 100);
    }, 100);
  }, 100);
  
  inputEmail.value = order.email;
  inputDevice.value = order.device;
  paymentSelect.value = order.payment;

  editId = orderId;
  
  window.scrollTo({ top: orderForm.offsetTop, behavior: 'smooth' });
}

window.hapusData = function(orderId) {
  if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
    let orders = getFromLocalStorage();
    orders = orders.filter((order) => order.orderId !== orderId);
    localStorage.setItem("order", JSON.stringify(orders));
    renderOrderToTable(orders);
  }
};