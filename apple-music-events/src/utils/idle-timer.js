// src/utils/idleTimer.js

export function startIdleTimer(onExpire, timeoutMinutes = 30) {
    let idleTimeout;

    function resetTimer() {
        clearTimeout(idleTimeout);
        idleTimeout = setTimeout(() => {
            console.log("Session expired due to inactivity.");
            onExpire(); // what to do when user idle too long
        }, timeoutMinutes * 60 * 1000);
    }

    // reset on any user activity
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("scroll", resetTimer);
    resetTimer(); // start timer immediately
}
