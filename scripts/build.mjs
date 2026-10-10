import { readFileSync, mkdirSync, writeFileSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const data = JSON.parse(readFileSync(path.join(root, 'data/cases.json'), 'utf8'));
const affected = JSON.parse(readFileSync(path.join(root, 'data/affected.json'), 'utf8'));
const politics = JSON.parse(readFileSync(path.join(root, 'data/rpps-politics.json'), 'utf8'));
const politicalByLocation = new Map(politics.entries.map(item => [item.location, item]));
if (politicalByLocation.size !== politics.entries.length) throw new Error('Localidade política duplicada.');
const enrichedRpps = affected.rpps.map(item => {
  const politicalContext = politicalByLocation.get(item.location);
  if (!politicalContext?.leaders.length || !politicalContext.sources.length) throw new Error(`Contexto político sem nomes ou fontes: ${item.location}`);
  return {...item, politicalContext};
});
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
const highlights = affected.highlights.map(item => `
  <article class="affected-highlight" aria-labelledby="affected-${escape(item.id)}">
    <p class="eyebrow">${escape(item.category)}</p>
    <h3 id="affected-${escape(item.id)}">${escape(item.name)}</h3>
    <p class="affected-value">${escape(item.display)}</p>
    <p class="affected-metric">${escape(item.metric)}<span>${escape(item.date)}</span></p>
    <p>${escape(item.description)}</p>
    <details class="affected-context"><summary>Recorte e recuperação</summary><p>${escape(item.update)}</p></details>
    <ul class="source-links">${item.sources.map(s=>`<li><a href="${escape(s.url)}" target="_blank" rel="noopener noreferrer">${escape(s.title)} ↗</a><span>${escape(s.date)}</span></li>`).join('')}</ul>
  </article>`).join('');
const rppsRows = enrichedRpps.map(item => {
  const context = item.politicalContext;
  const search = [item.location,item.uf,item.type,...context.leaders.flatMap(leader=>[leader.name,leader.role,...leader.partyCodes])].join(' ');
  const parties = [...new Set(context.leaders.flatMap(leader=>leader.partyCodes))];
  return `
  <tr class="rpps-row" role="row" data-type="${escape(item.type)}" data-search="${escape(search)}" data-parties="${escape(JSON.stringify(parties))}">
    <th scope="row" role="rowheader">${escape(item.location)}${context.recoveryNote ? `<span class="rpps-recovery">${escape(context.recoveryNote)}</span>` : ''}</th>
    <td role="cell" data-label="UF">${escape(item.uf)}</td>
    <td role="cell" data-label="Tipo">${item.type === 'estadual' ? 'Estadual' : 'Municipal'}</td>
    <td role="cell" class="rpps-leadership" data-label="Chefe do Executivo na época">
      ${context.leaders.map(leader=>`<div class="rpps-person"><strong>${escape(leader.name)}</strong><span>${escape(leader.role)}</span></div>`).join('')}
      <p class="rpps-period">${escape(context.applicationPeriod)}</p>
      <details class="rpps-political-sources"><summary>Fontes e datas<span class="sr-only"> · ${escape(item.location)}</span></summary>
        ${context.note ? `<p>${escape(context.note)}</p>` : ''}
        <ul>${context.sources.map(source=>`<li><a href="${escape(source.url)}" target="_blank" rel="noopener noreferrer">${escape(source.title)} ↗</a></li>`).join('')}</ul>
      </details>
    </td>
    <td role="cell" class="rpps-party" data-label="Partido e referência">
      ${context.leaders.map(leader=>`<div class="rpps-party-entry"><strong>${escape(leader.party)}</strong>${context.leaders.length > 1 ? `<span>${escape(leader.name)}</span>` : ''}<span class="${leader.partyConfirmedAtInvestment ? '' : 'rpps-uncertain'}">${escape(leader.partyReference)}</span></div>`).join('')}
    </td>
    <td role="cell" class="rpps-amount" data-label="Valor aplicado">R$ ${(item.amountBRL/1000000).toLocaleString('pt-BR')} ${item.amountBRL < 2000000 ? 'milhão' : 'milhões'}</td>
  </tr>`;
}).join('');
mkdirSync(path.join(root, 'dist'), { recursive: true });
writeFileSync(path.join(root, 'dist/index.html'), template.replace('{{ROWS}}', rows).replace('{{DETAILS}}', details).replace('{{EXCHANGE_URL}}', escape(data.exchange.url)).replace('{{AFFECTED_HIGHLIGHTS}}', highlights).replace('{{RPPS_ROWS}}', rppsRows).replaceAll('{{RPPS_SOURCE_URL}}', escape(affected.rppsSource.url)));
for (const name of ['style.css','app.js']) copyFileSync(path.join(root, 'src',name), path.join(root,'dist',name));
copyFileSync(path.join(root,'data/cases.json'), path.join(root,'dist/cases.json'));
writeFileSync(path.join(root,'dist/affected.json'), JSON.stringify({...affected,politicalMethodology:politics.methodology,rpps:enrichedRpps},null,2)+'\n');
console.log(`Site gerado em dist/. Quatro casos e ${affected.rpps.length} regimes de previdência, com fontes.`);
