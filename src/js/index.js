import keysData from './keysData.js';
import {
  renderApp, renderKeyboardRows, renderKeyboardKeys, changeKeysCase,
} from './helpers.js';

window.addEventListener('load', () => {
  let isCapsLocked = false;
  let lang;

  if (!localStorage.getItem('lang')) lang = 'en';
  else lang = localStorage.getItem('lang');

  renderApp();

  const textarea = document.querySelector('.textarea');
  const keyboard = document.querySelector('.keyboard');

  renderKeyboardRows(keysData, keyboard);
  renderKeyboardKeys(keysData);

  const keys = document.querySelectorAll('.keyboard__key');

  keys.forEach((key) => {
    key.querySelector(`.${lang === 'en' ? 'ru' : 'en'}`).classList.remove('active');
    key.querySelector(`.${lang === 'en' ? 'ru' : 'en'}`).classList.add('hidden');
  });
  keys.forEach((key) => {
    key.querySelector(`.${lang}`).classList.add('active');
    key.querySelector(`.${lang}`).classList.remove('hidden');
  });

  const tab = document.querySelector('.Tab');
  const backspace = document.querySelector('.Backspace');
  const capsLock = document.querySelector('.CapsLock');
  const del = document.querySelector('.Delete');
  const enter = document.querySelector('.Enter');
  const shiftLeft = document.querySelector('.ShiftLeft');
  const shiftRight = document.querySelector('.ShiftRight');
  const space = document.querySelector('.Space');

  keyboard.addEventListener('mousedown', (e) => {
    const clicked = e.target.closest('.active');
    if (!clicked || !clicked.closest('.keyboard__key').classList.contains('key')) return;

    let symbol = '';
    let currentCursorPos = textarea.selectionStart;
    let beforeCursor = textarea.value.substring(0, currentCursorPos);
    let afterCursor = textarea.value.substring(textarea.selectionEnd);

    if (clicked.closest('.keyboard__key').classList.contains('char')) symbol = clicked.textContent;
    if (clicked.closest('.keyboard__key') === capsLock) {
      isCapsLocked = !isCapsLocked;
      changeKeysCase(keys, isCapsLocked, lang);
    }
    if (clicked.closest('.keyboard__key') === enter) symbol = '\n';
    if (clicked.closest('.keyboard__key') === tab) symbol = '    ';
    if (clicked.closest('.keyboard__key') === space) symbol = ' ';
    if (clicked.closest('.keyboard__key') === backspace) {
      if (currentCursorPos === textarea.selectionEnd) {
        beforeCursor = beforeCursor.slice(0, -1);
        if (currentCursorPos) currentCursorPos -= 2;
        else currentCursorPos -= 1;
      } else currentCursorPos -= 1;
    }
    if (clicked.closest('.keyboard__key') === del) {
      afterCursor = afterCursor.slice(1);
      currentCursorPos -= 1;
    }
    if (clicked.closest('.keyboard__key') === shiftLeft || clicked.closest('.keyboard__key') === shiftRight) {
      isCapsLocked = !isCapsLocked;
      changeKeysCase(keys, isCapsLocked, lang);
    }
    textarea.value = beforeCursor + symbol + afterCursor;
    textarea.focus();
    if (symbol === '    ') textarea.setSelectionRange(currentCursorPos + 4, currentCursorPos + 4);
    else textarea.setSelectionRange(currentCursorPos + 1, currentCursorPos + 1);
  });

  keyboard.addEventListener('mouseup', () => {
    textarea.focus();
  });

  document.addEventListener('keydown', (e) => {
    const pressed = keyboard.querySelector(`.${e.code}`);
    if (!pressed) return;
    pressed.classList.add('pressed');

    let symbol = '';
    const currentCursorPos = textarea.selectionStart;
    const beforeCursor = textarea.value.substring(0, currentCursorPos);
    const afterCursor = textarea.value.substring(textarea.selectionEnd);

    if ((e.code === 'AltLeft' && e.ctrlKey) || (e.code === 'AltRight' && e.ctrlKey)) {
      keys.forEach((key) => {
        key.querySelector(`.${lang}`).classList.remove('active');
        key.querySelector(`.${lang}`).classList.add('hidden');
      });

      if (lang === 'ru') lang = 'en';
      else lang = 'ru';
      localStorage.setItem('lang', lang);

      keys.forEach((key) => {
        key.querySelector(`.${lang}`).classList.add('active');
        key.querySelector(`.${lang}`).classList.remove('hidden');
      });
    }
    if (e.shiftKey) {
      changeKeysCase(keys, !isCapsLocked, lang);
    }
    if (e.code === 'CapsLock') {
      isCapsLocked = !isCapsLocked;
      changeKeysCase(keys, isCapsLocked, lang);
    }
    if (e.code === 'Tab') {
      e.preventDefault();
      symbol = '    ';
    }

    textarea.focus();
    textarea.value = beforeCursor + symbol + afterCursor;
  });

  document.addEventListener('keyup', (e) => {
    keys.forEach((key) => key.classList.remove('pressed'));
    if (e.key === 'Shift') changeKeysCase(keys, isCapsLocked, lang);
  });
});
