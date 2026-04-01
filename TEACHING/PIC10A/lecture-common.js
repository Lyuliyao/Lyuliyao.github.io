Reveal.initialize({
  center: true,
  controls: true,
  hash: true,
  progress: true,
  slideNumber: true,
  transition: 'fade',
  plugins: [RevealHighlight]
});

document.addEventListener('DOMContentLoaded', () => {
  const copyToClipboard = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        successful ? resolve() : reject(new Error('Copy failed'));
      } catch (err) {
        document.body.removeChild(textarea);
        reject(err);
      }
    });
  };

  const getCleanCode = (codeBlock) => {
    const normalized = codeBlock.innerText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lines = normalized.split('\n').map((line) => line.replace(/\s+$/, ''));
    const cleaned = [];

    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      const isEmpty = line.trim() === '';

      if (isEmpty) {
        const prevHasText = i > 0 && lines[i - 1].trim() !== '';
        const nextHasText = i < lines.length - 1 && lines[i + 1].trim() !== '';
        if (prevHasText && nextHasText) {
          continue;
        }
      }

      cleaned.push(line);
    }

    return cleaned.join('\n').trim();
  };

  const addFragments = (selector) => {
    document.querySelectorAll(selector).forEach((element) => {
      if (!element.classList.contains('fragment')) {
        element.classList.add('fragment', 'fade-in');
      }
    });
  };

  document.querySelectorAll('section').forEach((section) => {
    let fragmentIndex = 1;
    section.querySelectorAll('.qa-list').forEach((list) => {
      Array.from(list.children).forEach((item) => {
        item.classList.add('fragment', 'fade-in');
        item.dataset.fragmentIndex = String(fragmentIndex);
        fragmentIndex += 1;
      });
    });
  });

  addFragments('section ul li');
  addFragments('section .stat-grid > *');
  addFragments('section .memory-row > *');
  addFragments('section .equation-strip > *');
  addFragments('section .check-grid > *');
  addFragments('section .grid-2 > .mini-card');

  document.querySelectorAll('pre > code').forEach((codeBlock) => {
    const pre = codeBlock.parentElement;
    pre.classList.add('copy-code-block');

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-code-button';
    button.setAttribute('aria-label', 'Copy code to clipboard');
    button.textContent = 'Copy';

    button.addEventListener('click', async () => {
      const text = getCleanCode(codeBlock);
      try {
        await copyToClipboard(text);
        button.textContent = 'Copied!';
        setTimeout(() => {
          button.textContent = 'Copy';
        }, 1500);
      } catch (err) {
        button.textContent = 'Retry';
        setTimeout(() => {
          button.textContent = 'Copy';
        }, 1500);
      }
    });

    pre.appendChild(button);
  });
});
