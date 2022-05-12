export function renderApp() {
  const markup = `
    <div class="container">
      <h1 class="title">Virtual Keyboard</h1>
      <textarea class="textarea"></textarea>
      <div class="keyboard"></div>
      <p class="info">For the language switch use the following key combination: Ctrl+ Alt</p>
    </div>
  `;
  document.body.insertAdjacentHTML('afterbegin', markup);
}

export function renderKeyboardRows(data, container) {
  const markup = data
    .map(() => '<div class="keyboard__row"></div>')
    .join('');
  container.insertAdjacentHTML('beforeend', markup);
}

function createKeyMarkup(data) {
  return data.map((key) => {
    if (key.caps) {
      return `
        <button class="${key.classes.join(' ')} ${key.code}">
          <span class="en lower-case active">${key.key.en}</span>
          <span class="ru lower-case hidden">${key.key.ru}</span>
          <span class="en upper-case hidden">${key.caps.en}</span>
          <span class="ru upper-case hidden">${key.caps.ru}</span>
        </button>
      `;
    }
    return `
      <button class="${key.classes.join(' ')} ${key.code}">
        <span class="en active">${key.key.en}</span>
        <span class="ru hidden">${key.key.ru}</span>
      </button>
    `;
  }).join('');
}

export function renderKeyboardKeys(data) {
  const rows = [...document.querySelectorAll('.keyboard__row')];
  for (let i = 0; i < data.length; i += 1) {
    const key = createKeyMarkup(data[i]);
    rows[i].insertAdjacentHTML('beforeend', key);
  }
}

export function changeKeysCase(keys, isCapsLocked, lang) {
  keys.forEach((key) => {
    if (key.classList.contains('char')) {
      if (isCapsLocked) {
        key.querySelectorAll('span').forEach((span) => {
          if (span.classList.contains(lang) && span.classList.contains('upper-case')) {
            span.classList.add('active');
            span.classList.remove('hidden');
          } else {
            span.classList.remove('active');
            span.classList.add('hidden');
          }
        });
      } else {
        key.querySelectorAll('span').forEach((span) => {
          if (span.classList.contains(lang) && span.classList.contains('lower-case')) {
            span.classList.add('active');
            span.classList.remove('hidden');
          } else {
            span.classList.remove('active');
            span.classList.add('hidden');
          }
        });
      }
    }
  });
}
