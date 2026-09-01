import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  getRoot(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/html');
    return res.send(HTML);
  }

  @Get('health')
  health() {
    return { status: 'ok', time: new Date().toISOString() };
  }
}

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Fillout Integration POC</title>
<style>
  :root { --bg:#f8fafc; --card:#fff; --border:#e2e8f0; --text:#0f172a; --muted:#64748b; --primary:#3b82f6; --primary-dark:#2563eb; --success:#10b981; --danger:#ef4444; --warn:#f59e0b; }
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family: ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial; background:var(--bg); color:var(--text); line-height:1.5}
  header{position:sticky;top:0;background:#fff;border-bottom:1px solid var(--border);padding:14px 24px;display:flex;align-items:center;justify-content:space-between;z-index:10}
  header h1{font-size:18px;font-weight:700;display:flex;gap:10px;align-items:center}
  header h1 span.logo{background:var(--primary);color:#fff;width:28px;height:28px;display:grid;place-items:center;border-radius:8px;font-size:14px}
  .header-right{display:flex;gap:12px;align-items:center;font-size:13px}
  .badge{padding:4px 8px;border-radius:999px;font-size:12px;font-weight:600;border:1px solid var(--border);background:#f1f5f9}
  .badge.success{background:#ecfdf5;color:#065f46;border-color:#a7f3d0}
  .badge.warn{background:#fffbeb;color:#92400e;border-color:#fde68a}
  .container{max-width:1100px;margin:0 auto;padding:24px}
  .card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px;box-shadow:0 1px 2px rgba(0,0,0,0.04)}
  .empty{padding:48px;text-align:center}
  .input{width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:8px;font-size:14px;outline:none}
  .input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(59,130,246,0.15)}
  .btn{padding:9px 16px;border-radius:8px;border:1px solid transparent;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s}
  .btn-primary{background:var(--primary);color:#fff;border-color:var(--primary)}
  .btn-primary:hover{background:var(--primary-dark)}
  .btn-ghost{background:#fff;border-color:var(--border);color:var(--text)}
  .btn-ghost:hover{background:#f8fafc}
  .btn-success{background:var(--success);color:#fff}
  .btn-danger{background:var(--danger);color:#fff}
  .btn-sm{padding:6px 12px;font-size:12px}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;margin-top:16px}
  .form-card{padding:16px;display:flex;flex-direction:column;gap:12px}
  .form-card h3{font-size:15px;font-weight:600}
  .form-meta{font-size:12px;color:var(--muted);word-break:break-all}
  .form-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
  .status-dot{width:8px;height:8px;border-radius:50%;display:inline-block}
  .status-dot.subscribed{background:var(--success)}
  .status-dot.not{background:var(--muted)}
  .toolbar{display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin-bottom:16px}
  .toolbar-left{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  .info-box{background:#fff;border:1px dashed var(--border);border-radius:8px;padding:10px 12px;font-size:12px;color:var(--muted);display:flex;gap:16px;flex-wrap:wrap}
  .info-box strong{color:var(--text)}
  .modal-overlay{position:fixed;inset:0;background:rgba(15,23,42,0.45);display:grid;place-items:center;z-index:50;padding:20px}
  .modal{width:100%;max-width:460px;background:#fff;border-radius:16px;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,0.2)}
  .modal h2{font-size:18px;margin-bottom:8px}
  .modal p{font-size:13px;color:var(--muted);margin-bottom:16px}
  .hidden{display:none !important}
  .detail{margin-top:24px}
  .detail h2{font-size:16px;margin-bottom:12px;display:flex;align-items:center;gap:8px}
  .calls{display:flex;flex-direction:column;gap:12px}
  .call{background:#fff;border:1px solid var(--border);border-radius:10px;overflow:hidden}
  .call-header{padding:12px 14px;background:#f8fafc;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}
  .call-header .time{font-size:12px;color:var(--muted)}
  .call-body{padding:12px 14px}
  .call-body pre{white-space:pre-wrap;word-break:break-all;background:#0f172a;color:#e2e8f0;padding:12px;border-radius:8px;font-size:12px;max-height:320px;overflow:auto}
  .empty-calls{padding:24px;text-align:center;color:var(--muted);font-size:13px}
  .loading{color:var(--muted);font-size:13px;padding:12px}
  .error{background:#fef2f2;border:1px solid #fecaca;color:#991b1b;padding:10px 12px;border-radius:8px;font-size:13px;margin-bottom:12px}
  .success-box{background:#ecfdf5;border:1px solid #a7f3d0;color:#065f46;padding:10px 12px;border-radius:8px;font-size:13px;margin-bottom:12px}
  a.link{color:var(--primary);text-decoration:none}
  a.link:hover{text-decoration:underline}
</style>
</head>
<body>
<header>
  <h1><span class="logo">F</span> Fillout Integration POC</h1>
  <div class="header-right">
    <span id="appUrlBadge" class="badge">app: -</span>
    <span id="filloutUrlBadge" class="badge">fillout: -</span>
    <button id="clearKeyBtn" class="btn btn-ghost btn-sm">Change API Key</button>
  </div>
</header>

<div id="keyModal" class="modal-overlay hidden">
  <div class="modal">
    <h2>Enter Fillout API Key</h2>
    <p>Your API key is stored only in <strong>localStorage</strong> in your browser. Get it from <a class="link" href="https://build.fillout.com/home/settings/developer" target="_blank">Fillout Developer Settings</a>. Bearer token will be sent via headers.</p>
    <div id="modalError" class="error hidden"></div>
    <label style="font-size:13px;font-weight:600;margin-bottom:6px;display:block">API Key</label>
    <input id="apiKeyInput" class="input" type="password" placeholder="sk_... or api_..." />
    <div style="display:flex;gap:8px;margin-top:16px">
      <button id="saveKeyBtn" class="btn btn-primary" style="flex:1">Save & Continue</button>
    </div>
    <p style="margin-top:12px;font-size:11px;color:var(--muted)">Stored as <code>fillout_api_key</code> in localStorage. No DB.</p>
  </div>
</div>

<div class="container">
  <div id="globalError" class="error hidden"></div>
  <div id="globalSuccess" class="success-box hidden"></div>

  <div class="toolbar">
    <div class="toolbar-left">
      <h2 style="font-size:16px">Your Forms</h2>
      <span id="formsCount" class="badge">0 forms</span>
    </div>
    <div style="display:flex;gap:8px">
      <button id="refreshBtn" class="btn btn-ghost btn-sm">↻ Refresh</button>
      <button id="copyWebhookBtn" class="btn btn-ghost btn-sm">Copy Webhook URL</button>
    </div>
  </div>

  <div class="info-box">
    <div>Webhook URL: <strong id="webhookUrlDisplay">-</strong></div>
    <div>App Base URL: <strong id="appBaseDisplay">-</strong></div>
    <div>Fillout Base URL: <strong id="filloutBaseDisplay">-</strong></div>
  </div>

  <div id="loading" class="loading">Loading forms...</div>
  <div id="formsGrid" class="grid"></div>
  <div id="emptyState" class="card empty hidden">
    <h3 style="font-size:15px;margin-bottom:6px">No forms found</h3>
    <p style="font-size:13px;color:var(--muted)">Create a form in Fillout or check your API key.</p>
  </div>

  <div id="detailSection" class="detail hidden">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
      <h2>Webhook Calls for <span id="detailFormName" style="color:var(--primary)"></span> <span id="detailFormId" class="badge"></span></h2>
      <div style="display:flex;gap:8px">
        <button id="refreshCallsBtn" class="btn btn-ghost btn-sm">↻ Refresh calls</button>
        <button id="closeDetailBtn" class="btn btn-ghost btn-sm">Close</button>
      </div>
    </div>
    <div id="callsList" class="calls" style="margin-top:12px"></div>
  </div>
</div>

<script>
const LS_KEY = 'fillout_api_key';
let appConfig = { appBaseUrl: location.origin, filloutBaseUrl: 'https://api.fillout.com/v1/api' };
let formsCache = [];
let selectedFormId = null;

const els = {
  modal: document.getElementById('keyModal'),
  apiKeyInput: document.getElementById('apiKeyInput'),
  saveKeyBtn: document.getElementById('saveKeyBtn'),
  modalError: document.getElementById('modalError'),
  clearKeyBtn: document.getElementById('clearKeyBtn'),
  webhookUrlDisplay: document.getElementById('webhookUrlDisplay'),
  appBaseDisplay: document.getElementById('appBaseDisplay'),
  filloutBaseDisplay: document.getElementById('filloutBaseDisplay'),
  appUrlBadge: document.getElementById('appUrlBadge'),
  filloutUrlBadge: document.getElementById('filloutUrlBadge'),
  formsGrid: document.getElementById('formsGrid'),
  formsCount: document.getElementById('formsCount'),
  loading: document.getElementById('loading'),
  emptyState: document.getElementById('emptyState'),
  globalError: document.getElementById('globalError'),
  globalSuccess: document.getElementById('globalSuccess'),
  refreshBtn: document.getElementById('refreshBtn'),
  copyWebhookBtn: document.getElementById('copyWebhookBtn'),
  detailSection: document.getElementById('detailSection'),
  detailFormName: document.getElementById('detailFormName'),
  detailFormId: document.getElementById('detailFormId'),
  callsList: document.getElementById('callsList'),
  refreshCallsBtn: document.getElementById('refreshCallsBtn'),
  closeDetailBtn: document.getElementById('closeDetailBtn'),
};

function getApiKey() { return localStorage.getItem(LS_KEY); }
function setApiKey(k) { localStorage.setItem(LS_KEY, k); }
function clearApiKey() { localStorage.removeItem(LS_KEY); }

function showModal(msg) {
  els.modal.classList.remove('hidden');
  if (msg) { els.modalError.textContent = msg; els.modalError.classList.remove('hidden'); } else { els.modalError.classList.add('hidden'); }
}
function hideModal() { els.modal.classList.add('hidden'); }
function showError(msg) { els.globalError.textContent = msg; els.globalError.classList.remove('hidden'); setTimeout(()=>els.globalError.classList.add('hidden'), 5000); }
function showSuccess(msg) { els.globalSuccess.textContent = msg; els.globalSuccess.classList.remove('hidden'); setTimeout(()=>els.globalSuccess.classList.add('hidden'), 3000); }

async function fetchConfig() {
  try {
    const r = await fetch('/api/config');
    const j = await r.json();
    appConfig = j;
  } catch(e) { console.warn('config fetch failed', e); }
  els.appBaseDisplay.textContent = appConfig.appBaseUrl;
  els.filloutBaseDisplay.textContent = appConfig.filloutBaseUrl;
  els.appUrlBadge.textContent = 'app: ' + appConfig.appBaseUrl;
  els.filloutUrlBadge.textContent = 'fillout: ' + appConfig.filloutBaseUrl;
  els.webhookUrlDisplay.textContent = appConfig.appBaseUrl + '/webhooks/{formId}';
}

async function fetchForms() {
  const key = getApiKey();
  if (!key) { showModal(); return; }
  hideModal();
  els.loading.classList.remove('hidden');
  els.formsGrid.innerHTML = '';
  els.emptyState.classList.add('hidden');
  els.globalError.classList.add('hidden');
  try {
    const r = await fetch('/api/forms', { headers: { 'Authorization': 'Bearer ' + key } });
    if (!r.ok) {
      const err = await r.json().catch(()=>({message:r.statusText}));
      throw new Error(err.message || err.data || 'Failed to fetch forms (' + r.status + ')');
    }
    const data = await r.json();
    formsCache = Array.isArray(data) ? data : (data.forms || []);
    renderForms();
  } catch(e) {
    showError(e.message);
    if (e.message.includes('401') || e.message.toLowerCase().includes('api key') || e.message.toLowerCase().includes('unauthorized')) {
      showModal(e.message);
    }
  } finally {
    els.loading.classList.add('hidden');
  }
}

function renderForms() {
  els.formsCount.textContent = formsCache.length + ' forms';
  if (formsCache.length === 0) {
    els.emptyState.classList.remove('hidden');
    return;
  }
  els.formsGrid.innerHTML = formsCache.map(f => {
    const id = f.formId;
    const name = f.name || f.title || f.formName || id;
    const subscribed = !!f.webhookSubscribed;
    const statusText = subscribed ? 'Webhook subscribed' : 'Not subscribed';
    const dotClass = subscribed ? 'subscribed' : 'not';
    const badgeClass = subscribed ? 'success' : 'warn';
    const desc = f.description ? '<div class="form-meta">'+escapeHtml(f.description.slice(0,80))+'</div>' : '';
    const formUrl = 'https://forms.fillout.com/t/' + id;
    return \`
      <div class="card form-card" data-form-id="\${escapeHtml(id)}">
        <div style="display:flex;justify-content:space-between;align-items:start;gap:8px">
          <h3>\${escapeHtml(name)}</h3>
          <span class="badge \${badgeClass}" style="display:flex;align-items:center;gap:6px"><span class="status-dot \${dotClass}"></span>\${statusText}</span>
        </div>
        <div class="form-meta">ID: \${escapeHtml(id)}</div>
        \${desc}
        <div class="form-meta">Form URL: <a href="\${escapeHtml(formUrl)}" target="_blank" class="link">\${escapeHtml(formUrl)}</a></div>
        <div class="form-actions">
          <a href="\${escapeHtml(formUrl)}" target="_blank" class="btn btn-ghost btn-sm">Open Form ↗</a>
          \${subscribed ? \`<button class="btn btn-ghost btn-sm" onclick="unsubscribe('\${escapeHtml(id)}')">Unsubscribe</button>\` : \`<button class="btn btn-success btn-sm" onclick="subscribe('\${escapeHtml(id)}')">Subscribe webhook</button>\`}
          <button class="btn btn-primary btn-sm" onclick="openDetail('\${escapeHtml(id)}','\${escapeHtml(name).replace(/'/g, "\\\\'")}')">View webhook data</button>
        </div>
        <div class="form-meta" style="margin-top:4px">Webhook URL: <code>\${escapeHtml(appConfig.appBaseUrl + '/webhooks/' + id)}</code> \${f.webhookUrl ? '<span style="color:var(--muted)">(subscribed: '+escapeHtml(f.webhookUrl)+')</span>' : ''}</div>
      </div>
    \`;
  }).join('');
}

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m])); }

async function subscribe(formId){
  const key=getApiKey();
  try{
    const r=await fetch('/api/webhooks/'+encodeURIComponent(formId)+'/subscribe', { method:'POST', headers:{'Authorization':'Bearer '+key }});
    const j=await r.json();
    if(!r.ok) throw new Error(j.message || JSON.stringify(j));
    showSuccess('Subscribed webhook for '+formId+' id='+j.webhookId);
    await fetchForms();
    if(selectedFormId===formId) openDetail(formId, '');
  }catch(e){ showError('Subscribe failed: '+e.message); }
}

async function unsubscribe(formId){
  const key=getApiKey();
  try{
    const r=await fetch('/api/webhooks/'+encodeURIComponent(formId), { method:'DELETE', headers:{'Authorization':'Bearer '+key }});
    const j=await r.json();
    if(!r.ok) throw new Error(j.message || JSON.stringify(j));
    showSuccess('Unsubscribed webhook for '+formId);
    await fetchForms();
    if(selectedFormId===formId) openDetail(formId,'');
  }catch(e){ showError('Unsubscribe failed: '+e.message); }
}

async function openDetail(formId, name){
  selectedFormId=formId;
  const f=formsCache.find(x=> x.formId===formId);
  els.detailFormName.textContent= name || f?.name || formId;
  els.detailFormId.textContent=formId;
  els.detailSection.classList.remove('hidden');
  els.detailSection.scrollIntoView({behavior:'smooth'});
  await loadCalls(formId);
}

async function loadCalls(formId){
  els.callsList.innerHTML='<div class="loading">Loading webhook calls...</div>';
  try{
    const r=await fetch('/api/webhooks/'+encodeURIComponent(formId));
    const j=await r.json();
    const calls=j.calls || j || [];
    if(calls.length===0){
      try {
        const ru = await fetch('/api/webhooks/unknown');
        const ju = await ru.json();
        if(ju.calls && ju.calls.length>0){
          els.callsList.innerHTML='<div class="error">No calls for '+escapeHtml(formId)+' but found '+ju.calls.length+' call(s) under <code>unknown</code> (payload missing formId, likely created with old generic webhook). Re-subscribe this form after fix to use per-form URL <code>'+escapeHtml(appConfig.appBaseUrl+'/webhooks/'+formId)+'</code> and submit again. <br>Unknown payload preview: <pre>'+escapeHtml(JSON.stringify(ju.calls[0].body,null,2).slice(0,1200))+'</pre></div>';
          return;
        }
      } catch(e){}
      els.callsList.innerHTML='<div class="card empty-calls">No webhook calls yet for this form.<br><span style="font-size:12px">Submit a Fillout response and it will POST to <code>'+escapeHtml(appConfig.appBaseUrl+'/webhooks/'+formId)+'</code> and appear here. Check ngrok inspector <code>http://127.0.0.1:4040</code> and server logs <code>[Webhook per-form]</code>. Ensure you re-subscribed AFTER setting <code>APP_BASE_URL</code> to ngrok URL and submitted a <b>new</b> response.</span><br><br><button class="btn btn-ghost btn-sm" onclick="fetch(\\'/api/webhooks\\').then(r=>r.json()).then(j=>alert(JSON.stringify(j,null,2)))">Debug: GET /api/webhooks</button></div>';
      return;
    }
    els.callsList.innerHTML=calls.map(c=>\`
      <div class="call">
        <div class="call-header">
          <strong style="font-size:13px">\${escapeHtml(c.formId)}</strong>
          <span class="time">\${new Date(c.timestamp).toLocaleString()} • id \${escapeHtml(c.id)}</span>
        </div>
        <div class="call-body">
          <div style="font-size:12px;color:var(--muted);margin-bottom:6px">Body:</div>
          <pre>\${escapeHtml(JSON.stringify(c.body, null, 2))}</pre>
          <div style="font-size:12px;color:var(--muted);margin:10px 0 6px">Headers (truncated):</div>
          <pre style="max-height:120px">\${escapeHtml(JSON.stringify(c.headers, null, 2))}</pre>
          \${c.query && Object.keys(c.query).length ? '<div style="font-size:12px;color:var(--muted);margin:10px 0 6px">Query:</div><pre>'+escapeHtml(JSON.stringify(c.query,null,2))+'</pre>' : ''}
        </div>
      </div>
    \`).join('');
  }catch(e){ els.callsList.innerHTML='<div class="error">'+escapeHtml(e.message)+'</div>'; }
}

// events
els.saveKeyBtn.addEventListener('click', ()=>{
  const v=els.apiKeyInput.value.trim();
  if(!v){ els.modalError.textContent='Please enter API key'; els.modalError.classList.remove('hidden'); return; }
  setApiKey(v);
  hideModal();
  els.apiKeyInput.value='';
  showSuccess('API key saved in localStorage');
  fetchForms();
});
els.apiKeyInput.addEventListener('keydown', e=>{ if(e.key==='Enter') els.saveKeyBtn.click(); });
els.clearKeyBtn.addEventListener('click', ()=>{
  const cur=getApiKey();
  if(cur) { if(confirm('Clear stored API key and enter new one?')){ clearApiKey(); showModal(); } }
  else showModal();
});
els.refreshBtn.addEventListener('click', fetchForms);
els.copyWebhookBtn.addEventListener('click', ()=>{
  const url=appConfig.appBaseUrl+'/webhooks/{formId}';
  navigator.clipboard.writeText(url).then(()=>showSuccess('Pattern copied: '+url+' - per-form URL e.g. '+appConfig.appBaseUrl+'/webhooks/abc123')).catch(()=>showError('Copy failed'));
});
els.closeDetailBtn.addEventListener('click', ()=>{ els.detailSection.classList.add('hidden'); selectedFormId=null; });
els.refreshCallsBtn.addEventListener('click', ()=>{ if(selectedFormId) loadCalls(selectedFormId); });

// init
(async ()=>{
  await fetchConfig();
  const key=getApiKey();
  if(!key) showModal();
  else fetchForms();
})();
</script>
</body>
</html>
`;
