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
    '--remote-debugging-port=9229',
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

  const list = await get('http://127.0.0.1:9229/json/list');
  const target = list.find(t => t.type === 'page') || list[0];
  const cdp = new CDP(target.webSocketDebuggerUrl);
  await cdp.open();

  await cdp.send('Page.enable');

  const filePath = 'file:///' + path.resolve(__dirname, '..', 'pricing.html').replace(/\\/g, '/');
  await cdp.send('Page.navigate', { url: filePath });
  await new Promise(r => setTimeout(r, 1500));

  const testWidths = [1440, 1280, 1024, 768, 425, 375, 320];

  for (const w of testWidths) {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: w,
      height: 900,
      deviceScaleFactor: 1,
      mobile: w < 768
    });
    await new Promise(r => setTimeout(r, 250));

    const res = await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const sec = document.querySelector('.membership-society-section');
          const cols = sec.querySelectorAll('.row.g-4 > div');
          const lCol = cols[0];
          const rCol = cols[1];
          const bCard = rCol.querySelector('.society-black-card');
          const lWrap = lCol.querySelector('.society-privileges-col');
          const strip = lCol.querySelector('.society-assurance-strip');

          const lRect = lCol.getBoundingClientRect();
          const rRect = rCol.getBoundingClientRect();
          const bRect = bCard.getBoundingClientRect();
          const sRect = strip ? strip.getBoundingClientRect() : null;

          return {
            viewportWidth: window.innerWidth,
            isDesktop: window.innerWidth >= 992,
            leftColWidth: Math.round(lRect.width),
            rightColWidth: Math.round(rRect.width),
            widthEqual: Math.round(lRect.width) === Math.round(rRect.width),
            leftColHeight: Math.round(lRect.height),
            rightColHeight: Math.round(rRect.height),
            blackCardHeight: Math.round(bRect.height),
            heightEqual: Math.abs(lRect.height - rRect.height) < 2,
            bottomDiff: sRect ? Math.round(bRect.bottom - sRect.bottom) : null
          };
        })()
      `,
      returnByValue: true
    });

    console.log(`\n=== Viewport ${w}px ===`);
    console.log(JSON.stringify(res.result.value, null, 2));
  }

  cdp.close();
  chrome.kill();
}

run().catch(console.error);
