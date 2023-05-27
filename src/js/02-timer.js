import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Notiflix from "notiflix";

const startButton = document.querySelector("[data-start]");
const daysElement = document.querySelector("[data-days]");
const hoursElement = document.querySelector("[data-hours]");
const minutesElement = document.querySelector("[data-minutes]");
const secondsElement = document.querySelector("[data-seconds]");

startButton.disabled = true; // Кнопка неактивна изначально

startButton.addEventListener("click", startTimer);

let countdownDate = null;
let intervalId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (selectedDate < new Date()) {
      Notiflix.Notify.warning("Please choose a date in the future");
      startButton.disabled = true; // Кнопка остается неактивной
    } else {
      countdownDate = selectedDate.getTime();
      startButton.disabled = false; // Кнопка становится активной
    }
  },
};

flatpickr("#datetime-picker", options);

function startTimer() {
  startButton.disabled = true;

  intervalId = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    if (distance < 0) {
      clearInterval(intervalId);
      updateTimer(0, 0, 0, 0);
      Notiflix.Report.success("Countdown Finished", "The countdown has reached zero!", "OK");
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(distance);
    updateTimer(days, hours, minutes, seconds);
  }, 1000);
}

function updateTimer(days, hours, minutes, seconds) {
  daysElement.textContent = addLeadingZero(days);
  hoursElement.textContent = addLeadingZero(hours);
  minutesElement.textContent = addLeadingZero(minutes);
  secondsElement.textContent = addLeadingZero(seconds);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, "0");
}