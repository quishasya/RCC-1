// Konfigurasi API
const API_BASE = "https://api.myquran.com/v2/sholat";
const CITY_SELECT = document.getElementById('city-select');
const SCHEDULE_BODY = document.getElementById('schedule-body');
const TABLE_WRAPPER = document.getElementById('table-wrapper');
const LOADING_STATE = document.getElementById('loading-state');
const ERROR_STATE = document.getElementById('error-state');

let currentCityId = "1301"; 
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1; 
const todayDateString = now.toISOString().split('T')[0]; 

async function initCities() {
    try {
        const response = await fetch(`${API_BASE}/kota/semua`);
        const result = await response.json();
        
        if (result.status) {
            CITY_SELECT.innerHTML = ""; // Bersihkan placeholder
            result.data.forEach(kota => {
                const option = document.createElement('option');
                option.value = kota.id;
                option.textContent = kota.lokasi;
                if(kota.id === currentCityId) option.selected = true;
                CITY_SELECT.appendChild(option);
            });
        }
    } catch (err) {
        console.error("Gagal memuat daftar kota", err);
    }
}

async function fetchJadwal() {
    TABLE_WRAPPER.classList.add('hidden');
    ERROR_STATE.classList.add('hidden');
    LOADING_STATE.classList.remove('hidden');

    try {
        const response = await fetch(`${API_BASE}/jadwal/${currentCityId}/${year}/${month}`);
        const result = await response.json();

        if (result.status) {
            const jadwalFiltered = result.data.jadwal.filter(item => {
                const tgl = parseInt(item.date.split('-')[2]); 
                return tgl <= 20;
            });

            renderTable(jadwalFiltered);
            
            document.getElementById('display-location').textContent = result.data.lokasi;
            document.getElementById('display-month').textContent = "Ramadhan 1447 H | 1 - 20 Maret 2026";
            
            LOADING_STATE.classList.add('hidden');
            TABLE_WRAPPER.classList.remove('hidden');
        } else {
            throw new Error("Data tidak ditemukan");
        }
    } catch (err) {
        LOADING_STATE.classList.add('hidden');
        ERROR_STATE.classList.remove('hidden');
        console.error(err);
    }
}

function renderTable(jadwal) {
    SCHEDULE_BODY.innerHTML = "";

    jadwal.forEach(item => {
        const isToday = item.date === todayDateString;
        const rowClass = isToday ? 'highlight-today' : 'hover:bg-gray-50';

        const row = `
            <tr class="${rowClass} transition-colors">
                <td class="p-4 text-[12px] md:text-sm">
                    <div class="font-bold text-emerald-900">${item.tanggal}</div>
                </td>
                <td class="p-4 text-[14px] md:text-sm font-bold">${item.imsak}</td>
                <td class="p-4 text-[14px] md:text-sm">${item.subuh}</td>
                <td class="p-4 text-[14px] md:text-sm">${item.dzuhur}</td>
                <td class="p-4 text-[14px] md:text-sm">${item.ashar}</td>
                <td class="p-4 text-[14px] md:text-sm font-bold text-emerald-700">${item.maghrib}</td>
                <td class="p-4 text-[14px] md:text-sm">${item.isya}</td>
            </tr>
        `;
        SCHEDULE_BODY.innerHTML += row;

        if (isToday) {
            setTimeout(() => {
                const activeRow = document.querySelector('.highlight-today');
                if (activeRow) activeRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }
    });
}

CITY_SELECT.addEventListener('change', (e) => {
    currentCityId = e.target.value;
    fetchJadwal();
});

initCities();
fetchJadwal();