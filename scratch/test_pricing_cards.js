const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

class CDP {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 0;
    this.callbacks = new Map();
    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
  }
  open() { return new Promise(resolve => this.ws.onopen = resolve); }
  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.id;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  close() { this.ws.close(); }
}

async function run() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9224',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  function get(url) {
    return new Promise((resolve, reject) => {
      http.get(url, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });
  }

  const list = await get('http://127.0.0.1:9224/json/list');
  const target = list.find(t => t.type === 'page') || list[0];
  const cdp = new CDP(target.webSocketDebuggerUrl);
  await cdp.open();

  await cdp.send('Page.enable');

  const filePath = 'file:///' + path.resolve(__dirname, '..', 'pricing.html').replace(/\\/g, '/');
  await cdp.send('Page.navigate', { url: filePath });
  await new Promise(r => setTimeout(r, 1500));

  const modes = ['light', 'dark'];
  const testWidths = [320, 375, 425, 768, 1024, 1280, 1440];

  for (const mode of modes) {
    console.log(`\n=================== TESTING THEME: ${mode.toUpperCase()} ===================`);
    await cdp.send('Runtime.evaluate', {
      expression: `document.documentElement.setAttribute('data-theme', '${mode}');`
    });

    for (const w of testWidths) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: w,
        height: 900,
        deviceScaleFactor: 1,
        mobile: w < 768
      });
      await new Promise(r => setTimeout(r, 200));

      const res = await cdp.send('Runtime.evaluate', {
        expression: `
          (() => {
            const boxes = Array.from(document.querySelectorAll('.pricing-guarantee-box'));
            return boxes.map((box, idx) => {
              const bRect = box.getBoundingClientRect();
              const h4 = box.querySelector('h4');
              const h4Rect = h4.getBoundingClientRect();
              const badge = box.querySelector('.badge');
              const badgeRect = badge.getBoundingClientRect();
              const p = box.querySelector('p');
              const pRect = p.getBoundingClientRect();

              const h4Style = window.getComputedStyle(h4);
              const badgeStyle = window.getComputedStyle(badge);
              const pStyle = window.getComputedStyle(p);

              // Check containment
              const h4Contained = h4Rect.left >= bRect.left - 1 && h4Rect.right <= bRect.right + 1;
              const badgeContained = badgeRect.left >= bRect.left - 1 && badgeRect.right <= bRect.right + 1;
              const pContained = pRect.left >= bRect.left - 1 && pRect.right <= bRect.right + 1;

              return {
                card: idx + 1,
                boxWidth: Math.round(bRect.width),
                h4Text: h4.innerText,
                h4Color: h4Style.color,
                h4Contained,
                badgeText: badge.innerText.trim(),
                badgeColor: badgeStyle.color,
                badgeBg: badgeStyle.backgroundColor,
                badgeContained,
                pTextPreview: p.innerText.substring(0, 30) + '...',
                pColor: pStyle.color,
                pContained
              };
            });
          })()
        `,
        returnByValue: true
      });

      console.log(`--- Width ${w}px ---`);
      for (const card of res.result.value) {
        console.log(`  Card ${card.card}: [H4: "${card.h4Text}" (${card.h4Color}, Contained:${card.h4Contained})] [Badge: "${card.badgeText}" (${card.badgeColor} on ${card.badgeBg}, Contained:${card.badgeContained})] [P: (${card.pColor}, Contained:${card.pContained})]`);
      }
    }
  }

  cdp.close();
  chrome.kill();
  console.log('\nAll checks completed successfully!');
}

run().catch(console.error);
