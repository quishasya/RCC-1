const counterDisplay = document.getElementById('counter');
const targetDisplay = document.getElementById('target');
const targetInput = document.getElementById('target-input');
const notification = document.getElementById('notification');

const incrementBtn = document.getElementById('increment-btn');
const decrementBtn = document.getElementById('decrement-btn'); // Pastikan di HTML id="decrement-btn"
const resetBtn = document.getElementById('reset-btn');

const presetButtonsList = document.querySelectorAll('.flex.justify-center.my-2 button');
const customTargetBtn = document.querySelector('#target-input + button');

let count = 0;
let target = 0;

function updateDisplay() {
    counterDisplay.innerText = count;
    targetDisplay.innerText = target;
}

function showSuccessNotification() {
    if(notification) {
        notification.style.top = '20px'; 
        setTimeout(() => {
            notification.style.top = '-100px';
        }, 3000);
    }
}

function resetPresetButtons() {
    presetButtonsList.forEach(btn => {
        btn.classList.remove('bg-[#FBD17F]', 'color-primary');
        btn.classList.add('bg-[#064e30]', 'text-white');
    });
}

if(incrementBtn) {
    incrementBtn.addEventListener('click', () => {
        count++;
        updateDisplay();
        if (target > 0 && count === target) {
            showSuccessNotification();
            if (navigator.vibrate) navigator.vibrate(200);
        }
    });
}

if(decrementBtn) {
    decrementBtn.addEventListener('click', () => {
        if (count > 0) {
            count--;
            updateDisplay();
        }
    });
}

if(resetBtn) {
    resetBtn.addEventListener('click', () => {
        count = 0;
        updateDisplay();
    });
}

presetButtonsList.forEach(button => {
    button.addEventListener('click', () => {
        const value = parseInt(button.innerText);
        target = value;
        count = 0; 
        updateDisplay();
        resetPresetButtons();
        button.classList.remove('bg-[#064e30]', 'text-white');
        button.classList.add('bg-[#FBD17F]', 'color-primary');
    });
});

if(customTargetBtn) {
    customTargetBtn.addEventListener('click', () => {
        const value = parseInt(targetInput.value);
        if (value > 0) {
            target = value;
            count = 0;
            updateDisplay();
            resetPresetButtons();
            targetInput.value = '';
        } else {
            alert('Masukkan angka target yang valid ya!');
        }
    });
}