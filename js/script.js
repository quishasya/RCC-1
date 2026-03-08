document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SELEKTOR NAVIGASI & SECTION ---
    const navButtons = document.querySelectorAll('nav button');
    const sections = {
        'Shalat': document.getElementById('shalat'),
        'Quran': document.getElementById('quran'),
        'Puasa': document.getElementById('puasa'),
        'Dzikir': document.getElementById('dzikir')
    };
    
    // Section Progress (selalu tampil di atas semua tab sesuai permintaan)
    const progressSection = document.querySelector('section:has(.bg-gray-200)');
    const progressFill = document.querySelector('.bg-primary.h-2.5');
    const progressText = document.querySelector('.text-sm.py-2.text-gray-500');
    const motivationText = document.querySelector('header p');

    // --- 2. LOGIKA NAVIGASI (PINDAH HALAMAN) ---
    function switchTab(targetTab) {
        // Loop semua section dan sembunyikan
        Object.values(sections).forEach(section => {
            section.style.display = 'none';
        });

        // Tampilkan yang dipilih
        sections[targetTab].style.display = 'block';

        // Update Styling Button Navigasi
        navButtons.forEach(btn => {
            if (btn.innerText === targetTab) {
                btn.classList.add('text-primary', 'underline');
                btn.classList.remove('text-gray-500');
            } else {
                btn.classList.remove('text-primary', 'underline');
                btn.classList.add('text-gray-500');
            }
        });
    }

    // Pasang Event Listener ke semua tombol nav
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.innerText));
    });

    // Set tampilan awal ke 'Shalat'
    switchTab('Shalat');

    // --- 3. DATA & LOGIKA FITUR ---
    let data = JSON.parse(localStorage.getItem('ramadhanData')) || {
        shalat: [false, false, false, false, false],
        quran: { target: 0, current: 0 },
        puasa: []
    };

    function updateGlobalProgress() {
        // Hitung Shalat (100% jika 5 waktu tercentang)
        const shalatDone = data.shalat.filter(x => x).length;
        const shalatPct = (shalatDone / 5) * 100;

        // Hitung Quran
        let quranPct = 0;
        if (data.quran.target > 0) {
            quranPct = Math.min((data.quran.current / data.quran.target) * 100, 100);
        }

        // Rata-rata progress (Shalat + Quran)
        const totalProgress = Math.round((shalatPct + quranPct) / 2);
        
        progressFill.style.width = `${totalProgress}%`;
        progressText.innerText = `${totalProgress}% Complete`;

        // Update Motivasi di Header
        if (totalProgress <= 40) motivationText.innerText = "Belum optimal, ayo lebih semangat!";
        else if (totalProgress <= 80) motivationText.innerText = "Cukup baik, pertahankan konsistensinya!";
        else if (totalProgress < 100) motivationText.innerText = "Hampir sempurna, sedikit lagi!";
        else motivationText.innerText = "MasyaAllah lengkap! Pertahankan hari esok.";

        localStorage.setItem('ramadhanData', JSON.stringify(data));
    }

    // --- 4. INTEGRASI CHECKLIST SHALAT ---
    const shalatCheckboxes = document.querySelectorAll('#shalat input[type="checkbox"]');
    shalatCheckboxes.forEach((cb, i) => {
        cb.checked = data.shalat[i];
        cb.addEventListener('change', () => {
            data.shalat[i] = cb.checked;
            updateGlobalProgress();
        });
    });

    // --- 5. INTEGRASI QURAN ---
    const quranInputs = document.querySelectorAll('#quran input');
    const quranSaveBtn = document.querySelector('#quran button');
    
    quranInputs[0].value = data.quran.target || "";
    quranInputs[1].value = data.quran.current || "";

    quranSaveBtn.addEventListener('click', () => {
        data.quran.target = parseInt(quranInputs[0].value) || 0;
        data.quran.current = parseInt(quranInputs[1].value) || 0;
        
        const pct = (data.quran.current / data.quran.target) * 100;
        if (pct >= 100) alert("MasyaAllah, Target Tercapai!");
        else if (pct >= 50) alert("Hampir selesai, teruskan tilawahnya!");
        else alert("Masih bisa ditambah, yuk baca lagi!");
        
        updateGlobalProgress();
    });

    // --- 6. INTEGRASI PUASA (KALENDER) ---
    const puasaBtns = document.querySelectorAll('#puasa button');
    puasaBtns.forEach((btn, i) => {
        btn.innerText = i + 1; // Set angka tanggal
        
        // Cek status tersimpan
        if (data.puasa.includes(i)) {
            btn.innerHTML = "✅";
            btn.classList.replace('bg-[#F3F4F6]', 'bg-primary');
            btn.classList.replace('text-[#9CA3AF]', 'text-white');
        }

        btn.addEventListener('click', () => {
            if (data.puasa.includes(i)) {
                data.puasa = data.puasa.filter(item => item !== i);
                btn.innerText = i + 1;
                btn.classList.replace('bg-primary', 'bg-[#F3F4F6]');
                btn.classList.replace('text-white', 'text-[#9CA3AF]');
            } else {
                data.puasa.push(i);
                btn.innerHTML = "✅";
                btn.classList.replace('bg-[#F3F4F6]', 'bg-primary');
                btn.classList.replace('text-[#9CA3AF]', 'text-white');
            }
            localStorage.setItem('ramadhanData', JSON.stringify(data));
        });
    });

    updateGlobalProgress();
});