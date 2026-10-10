import { readFileSync, mkdirSync, writeFileSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const data = JSON.parse(readFileSync(path.join(root, 'data/cases.json'), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const brl = item => item.amount * (item.currency === 'USD' ? data.exchange.rate : 1);
const max = Math.max(...data.cases.map(brl));
const rows = data.cases.map((item, i) => `
  <li class="case-row ${i === 0 ? 'selected' : ''}" data-id="${item.id}" data-value="${brl(item)}">
    <button class="case-select" aria-pressed="${i === 0}" aria-controls="detail-${item.id}">
      <span class="row-top"><span class="case-name">${escape(item.name)}</span><strong>${escape(item.display)}</strong></span>
      <span class="row-meta">${escape(item.metric)}${item.original ? ` · ${escape(item.original)}` : ''}</span>
      <span class="track" aria-hidden="true"><span class="bar" style="width:${brl(item)/max*100}%"></span></span>
      <span class="row-foot"><span>${escape(item.period)}</span><span class="row-link">Ver contexto <span aria-hidden="true">↗</span></span></span>
    </button>
  </li>`).join('');
const details = data.cases.map((item, i) => `
  <article class="case-detail" id="detail-${item.id}" aria-labelledby="title-${item.id}" tabindex="-1">
    <span class="detail-index">RECORTE ${String(i+1).padStart(2,'0')} / 04</span>
    <h3 id="title-${item.id}">${escape(item.name)}</h3>
    <span class="status">${escape(item.status)}</span>
    <p>${escape(item.description)}</p>
    <div class="context"><h4>Como ler esse valor</h4><p>${escape(item.context)}</p></div>
    ${item.original ? `<div class="conversion"><strong>Conversão de referência</strong><p>US$ 349 milhões × R$ 3,3297 = R$ ${(brl(item)).toLocaleString('pt-BR')}. Dólar de venda em 21/12/2016 (BCB, série SGS 1). Sem correção pela inflação.</p></div>` : ''}
    <h4 class="sources-title">CONSULTE AS FONTES</h4>
    <ul class="source-links">${item.sources.map(s=>`<li><a href="${escape(s.url)}" target="_blank" rel="noopener noreferrer">${escape(s.title)} <span aria-hidden="true">↗</span></a><span>${escape(s.date)}</span></li>`).join('')}</ul>
  </article>`).join('');
const template = readFileSync(path.join(root, 'src/index.html'), 'utf8');
mkdirSync(path.join(root, 'dist'), { recursive: true });
writeFileSync(path.join(root, 'dist/index.html'), template.replace('{{ROWS}}', rows).replace('{{DETAILS}}', details).replace('{{EXCHANGE_URL}}', escape(data.exchange.url)));
for (const name of ['style.css','app.js']) copyFileSync(path.join(root, 'src',name), path.join(root,'dist',name));
copyFileSync(path.join(root,'data/cases.json'), path.join(root,'dist/cases.json'));
console.log('Site gerado em dist/. Quatro recortes, fontes e metodologia incluídos.');
