document.addEventListener('DOMContentLoaded', () => {
    const timeDisplay = document.getElementById('time-display');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const resetBtn = document.getElementById('resetBtn');

    let startTime = 0;
    let elapsedTime = 0;
    let timerInterval = null;
    let isRunning = false;

    function formatTime(time) {
        const milliseconds = Math.floor((time % 1000) / 10); // Get hundredths of a second
        const seconds = Math.floor((time / 1000) % 60);
        const minutes = Math.floor((time / (1000 * 60)) % 60);
        const hours = Math.floor((time / (1000 * 60 * 60)) % 24); // Optional: add hours if needed

        // Pad with leading zeros
        const formattedMs = String(milliseconds).padStart(2, '0');
        const formattedSec = String(seconds).padStart(2, '0');
        const formattedMin = String(minutes).padStart(2, '0');
        const formattedHr = String(hours).padStart(2, '0'); // Optional

        // return `${formattedMin}:${formattedSec}.${formattedMs}`; // MM:SS.ms
        return `${formattedHr}:${formattedMin}:${formattedSec}.${formattedMs}`; // HH:MM:SS.ms
    }

    function updateDisplay() {
        const currentTime = Date.now();
        const timePassed = currentTime - startTime + elapsedTime;
        timeDisplay.textContent = formatTime(timePassed);
    }

    function startTimer() {
        if (isRunning) return; // Prevent multiple intervals

        isRunning = true;
        startTime = Date.now(); // Reset startTime based on current time
        // If resuming, elapsedTime already holds the previously paused duration.
        // We don't subtract elapsedTime from startTime here,
        // instead, we add it in updateDisplay to get the total time passed.

        timerInterval = setInterval(updateDisplay, 10); // Update every 10ms for smoother ms display

        startBtn.disabled = true;
        stopBtn.disabled = false;
        resetBtn.disabled = true; // Disable reset while running
    }

    function stopTimer() {
        if (!isRunning) return;

        isRunning = false;
        clearInterval(timerInterval);
        // Record the total elapsed time up to this point
        elapsedTime += Date.now() - startTime;

        startBtn.disabled = false;
        startBtn.textContent = 'Resume'; // Change text to Resume
        stopBtn.disabled = true;
        resetBtn.disabled = false; // Enable reset when stopped
    }

    function resetTimer() {
        isRunning = false;
        clearInterval(timerInterval);
        startTime = 0;
        elapsedTime = 0;
        timeDisplay.textContent = formatTime(0);

        startBtn.disabled = false;
        startBtn.textContent = 'Start'; // Reset text to Start
        stopBtn.disabled = true;
        resetBtn.disabled = true; // Disable reset until started again
    }

    // Event Listeners
    startBtn.addEventListener('click', startTimer);
    stopBtn.addEventListener('click', stopTimer);
    resetBtn.addEventListener('click', resetTimer);

    // Initial state
    resetTimer(); // Call reset to set initial display and button states
});