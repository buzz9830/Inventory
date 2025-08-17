// Simple Inventory Web App – offline-first, localStorage persistence
const FINISHES = ["Finitura 01", "Finitura 02", "Finitura 03", "Finitura 04", "Finitura 05", "Finitura 06", "Finitura 07", "Finitura 08", "Finitura 09", "Finitura 10", "Finitura 11", "Finitura 12", "Finitura 13", "Finitura 14", "Finitura 15", "Finitura 16", "Finitura 17", "Finitura 18", "Finitura 19", "Finitura 20", "Finitura 21", "Finitura 22", "Finitura 23", "Finitura 24", "Finitura 25", "Finitura 26", "Finitura 27", "Finitura 28", "Finitura 29", "Finitura 30", "Finitura 31", "Finitura 32", "Finitura 33", "Finitura 34", "Finitura 35", "Finitura 36", "Finitura 37", "Finitura 38", "Finitura 39", "Finitura 40"];

const DB_KEY = 'inventory.v1';
let data = { items: [] }; // items: {id, code, desc, finish, qty, status, note, createdAt, updatedAt}

const els = {
  search: document.getElementById('search'),
  filterFinish: document.getElementById('filterFinish'),
  filterStatus: document.getElementById('filterStatus'),
  btnAdd: document.getElementById('btnAdd'),
  btnExport: document.getElementById('btnExport'),
  fileImport: document.getElementById('fileImport'),
  formSection: document.getElementById('formSection'),
  form: document.getElementById('itemForm'),
  formTitle: document.getElementById('formTitle'),
  code: document.getElementById('code'),
  desc: document.getElementById('desc'),
  finish: document.getElementById('finish'),
  qty: document.getElementById('qty'),
  status: document.getElementById('status'),
  note: document.getElementById('note'),
  editId: document.getElementById('editId'),
  saveBtn: document.getElementById('saveBtn'),
  cancelBtn: document.getElementById('cancelBtn'),
  deleteBtn: document.getElementById('deleteBtn'),
  listTerzisti: document.getElementById('listTerzisti'),
  countTerzisti: document.getElementById('countTerzisti'),
};

// Load & Save
function load() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) data = JSON.parse(raw);
    if (!data.items) data.items = [];
  } catch (e) {
    console.error('Load failed', e);
  }
}
function save() {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
}

// Helpers
function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }
function normalizeCode(s) { return (s||'').trim(); }

function resetForm() {
  els.form.reset();
  els.editId.value = '';
  els.deleteBtn.classList.add('hidden');
  els.formTitle.textContent = 'Nuovo articolo';
  els.qty.value = 0;
}

function openForm(item) {
  els.formSection.classList.remove('hidden');
  if (item) {
    els.formTitle.textContent = 'Modifica articolo';
    els.editId.value = item.id;
    els.code.value = item.code;
    els.desc.value = item.desc || '';
    els.finish.value = item.finish;
    els.qty.value = item.qty;
    els.status.value = item.status;
    els.note.value = item.note || '';
    els.deleteBtn.classList.remove('hidden');
  } else {
    resetForm();
  }
  els.code.focus();
}

function closeForm() { els.formSection.classList.add('hidden'); }

function validateUniqueCode(code, exceptId=null) {
  const c = normalizeCode(code);
  return !data.items.some(it => it.code.toLowerCase() === c.toLowerCase() && it.id !== exceptId);
}

// Render
function render() {
  // Clear all lists
  els.listTerzisti.innerHTML = '';
  els.countTerzisti.textContent = '0';
  FINISHES.forEach(f => {
    const key = f.replace(/\s+/g,'-');
    const ul = document.getElementById('list-'+key);
    const badge = document.getElementById('badge-'+key);
    if (ul) ul.innerHTML='';
    if (badge) badge.textContent='0';
  });

  const q = (els.search.value||'').trim().toLowerCase();
  const ff = els.filterFinish.value;
  const fs = els.filterStatus.value;

  let items = [...data.items];
  if (q) items = items.filter(i => i.code.toLowerCase().includes(q));
  if (ff) items = items.filter(i => i.finish === ff);
  if (fs) items = items.filter(i => i.status === fs);

  let terzistiCount = 0;

  const tmpl = document.getElementById('itemTemplate');
  items.sort((a,b)=> a.code.localeCompare(b.code, 'it'));

  for (const it of items) {
    const node = tmpl.content.firstElementChild.cloneNode(true);
    node.querySelector('.code').textContent = it.code;
    node.querySelector('.desc').textContent = it.desc || '';
    node.querySelector('.finish').textContent = it.finish;
    node.querySelector('.qty').textContent = 'Qtà: ' + it.qty;
    node.querySelector('.status').textContent = it.status==='terzista' ? 'Fuori dai terzisti' : 'In magazzino';
    node.querySelector('.edit').addEventListener('click', () => openForm(it));

    if (it.status === 'terzista') {
      els.listTerzisti.appendChild(node);
      terzistiCount++;
    } else {
      const key = it.finish.replace(/\s+/g,'-');
      const ul = document.getElementById('list-'+key);
      const badge = document.getElementById('badge-'+key);
      if (ul) ul.appendChild(node);
      if (badge) badge.textContent = String(Number(badge.textContent) + 1);
    }
  }
  els.countTerzisti.textContent = String(terzistiCount);
}

// Events
els.btnAdd.addEventListener('click', () => openForm());
els.cancelBtn.addEventListener('click', closeForm);
els.search.addEventListener('input', render);
els.filterFinish.addEventListener('change', render);
els.filterStatus.addEventListener('change', render);
els.fileImport.addEventListener('change', handleImport);
els.btnExport.addEventListener('click', handleExport);
els.deleteBtn.addEventListener('click', () => {
  const id = els.editId.value;
  if (!id) return;
  data.items = data.items.filter(i => i.id !== id);
  save(); closeForm(); render();
});

els.form.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = els.editId.value || uid();
  const code = normalizeCode(els.code.value);
  if (!code) return alert('Codice richiesto');
  if (!validateUniqueCode(code, els.editId.value||null)) return alert('Codice già presente');

  const item = {
    id,
    code,
    desc: els.desc.value.trim(),
    finish: els.finish.value,
    qty: Number(els.qty.value||0),
    status: els.status.value,
    note: els.note.value.trim(),
    updatedAt: new Date().toISOString(),
  };
  if (!els.editId.value) item.createdAt = new Date().toISOString();

  const idx = data.items.findIndex(i => i.id === id);
  if (idx >= 0) data.items[idx] = { ...data.items[idx], ...item };
  else data.items.push(item);

  save(); closeForm(); render();
});

// Import/Export
function handleExport() {
  const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'inventario.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

async function handleImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  const text = await file.text();
  let imported = null;
  try {
    if (file.name.endsWith('.csv')) {
      imported = csvToData(text);
    } else {
      imported = JSON.parse(text);
    }
  } catch (err) {
    alert('File non valido'); return;
  }
  if (!imported || !Array.isArray(imported.items||imported)) {
    alert('Struttura non valida'); return;
  }
  const items = Array.isArray(imported) ? imported : imported.items;
  // Merge by code: update if existing, else add
  for (const it of items) {
    if (!it.code) continue;
    const code = normalizeCode(it.code);
    const existing = data.items.find(x => x.code.toLowerCase() === code.toLowerCase());
    const safe = {
      id: existing?.id || uid(),
      code,
      desc: (it.desc||'').toString(),
      finish: FINISHES.includes(it.finish) ? it.finish : FINISHES[0],
      qty: Number(it.qty||0),
      status: it.status==='terzista' ? 'terzista' : 'magazzino',
      note: (it.note||'').toString(),
      updatedAt: new Date().toISOString(),
      createdAt: existing?.createdAt || new Date().toISOString(),
    };
    if (existing) Object.assign(existing, safe);
    else data.items.push(safe);
  }
  save(); render();
  e.target.value = '';
}

function csvToData(text) {
  // Simple CSV (header expected): code,desc,finish,qty,status,note
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (!lines.length) return {items:[]};
  const header = lines.shift().split(',').map(h=>h.trim().toLowerCase());
  const idx = (name) => header.indexOf(name);
  const items = lines.map(line => {
    const cells = line.split(',').map(c=>c.trim());
    return {
      code: cells[idx('code')] || '',
      desc: cells[idx('desc')] || '',
      finish: cells[idx('finish')] || '',
      qty: cells[idx('qty')] || '0',
      status: cells[idx('status')] || 'magazzino',
      note: cells[idx('note')] || '',
    }
  });
  return {items};
}

load();
render();
