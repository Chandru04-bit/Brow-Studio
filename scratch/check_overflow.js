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
    '--remote-debugging-port=9223',
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

  const list = await get('http://127.0.0.1:9223/json/list');
  const target = list.find(t => t.type === 'page') || list[0];
  const cdp = new CDP(target.webSocketDebuggerUrl);
  await cdp.open();

  await cdp.send('Page.enable');

  const filePath = 'file:///' + path.resolve(__dirname, '..', 'pricing.html').replace(/\\/g, '/');
  await cdp.send('Page.navigate', { url: filePath });
  await new Promise(r => setTimeout(r, 1500));

  const widths = [320, 375, 425, 768, 1024, 1280];
  for (const w of widths) {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: w,
      height: 900,
      deviceScaleFactor: 1,
      mobile: w < 768
    });
    await new Promise(r => setTimeout(r, 300));

    const check = await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const docW = document.documentElement.offsetWidth;
          const scrollW = document.documentElement.scrollWidth;
          const overflowEls = [];
          document.querySelectorAll('*').forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.right > docW + 1 || r.left < -1) {
              overflowEls.push({
                tag: el.tagName,
                cls: el.className,
                left: r.left,
                right: r.right,
                width: r.width
              });
            }
          });
          return {
            windowWidth: window.innerWidth,
            docW,
            scrollW,
            hasOverflow: scrollW > docW,
            overflowCount: overflowEls.length,
            overflowSample: overflowEls.slice(0, 8)
          };
        })()
      `,
      returnByValue: true
    });

    console.log(`\n=== Width: ${w} ===`);
    console.log(JSON.stringify(check.result.value, null, 2));
  }

  cdp.close();
  chrome.kill();
}

run().catch(console.error);
