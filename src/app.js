const rows = [...document.querySelectorAll('.case-row')];
const panels = [...document.querySelectorAll('.case-detail')];
const controls = document.querySelector('.scale-controls');
const max = Math.max(...rows.map(row=>Number(row.dataset.value)));
document.documentElement.classList.add('js');
controls.hidden = false;
function selectCase(id) {
  rows.forEach(row=>{
    const selected = row.dataset.id === id;
    row.classList.toggle('selected', selected);
    row.querySelector('button').setAttribute('aria-pressed',String(selected));
  });
  panels.forEach(panel=>{ panel.hidden = panel.id !== `detail-${id}`; });
}
rows.forEach(row=>row.querySelector('button').addEventListener('click',()=>{
  selectCase(row.dataset.id);
  if (window.matchMedia('(max-width: 850px)').matches) {
    const panel = document.querySelector(`#detail-${row.dataset.id}`);
    panel.focus({preventScroll:true});
    panel.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  }
}));
controls.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{
  const log = button.dataset.scale === 'log';
  controls.querySelectorAll('button').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  rows.forEach(row=>{
    const value = Number(row.dataset.value);
    const width = log ? (Math.log10(value)-6)/(Math.log10(max)-6)*100 : value/max*100;
    row.querySelector('.bar').style.width = `${Math.max(0,width)}%`;
  });
  document.querySelector('#scale-label').textContent = log ? 'Escala logarítmica · cada passo multiplica por dez' : 'Escala linear · comprimento proporcional ao valor';
  document.querySelector('#axis-start').textContent = log ? 'R$ 1 mi' : 'R$ 0';
  document.querySelector('#axis-middle').textContent = log ? '≈ R$ 110 mi' : 'R$ 6 bi';
  document.querySelector('#chart-note').textContent = log ? 'Escala logarítmica para visualizar valores menores. Os comprimentos não mostram proporções diretas. Selecione um caso para ler seu contexto.' : 'As barras partem de zero. Valores menores podem ficar quase invisíveis. Selecione um caso para ler o recorte e as fontes.';
}));
selectCase('master');

const rppsFilters = document.querySelector('.rpps-filters');
const rppsRows = [...document.querySelectorAll('.rpps-row')];
const partySummary = document.querySelector('.party-totals');
let rppsType = 'all';
function filterRpps() {
  let count = 0;
  let unconfirmed = 0;
  const parties = new Map();
  rppsRows.forEach(row=>{
    const visible = rppsType === 'all' || row.dataset.type === rppsType;
    row.hidden = !visible;
    if (visible) {
      count++;
      const party = row.dataset.countParty;
      if (party) parties.set(party,(parties.get(party)||0)+1);
      else unconfirmed++;
    }
  });
  document.querySelector('.rpps-count').textContent = `${count} de ${rppsRows.length} regimes exibidos.`;
  document.querySelector('.rpps-empty').hidden = count !== 0;
  const totals = [...parties].sort((a,b)=>b[1]-a[1] || a[0].localeCompare(b[0],'pt-BR'));
  if (unconfirmed) totals.push(['Não confirmado',unconfirmed]);
  partySummary.replaceChildren(...totals.map(([party,total])=>{
    const item = document.createElement('li');
    item.className = `party-tally${party === 'Não confirmado' ? ' party-tally-uncertain' : ''}`;
    const label = document.createElement('span');
    label.textContent = party;
    const value = document.createElement('strong');
    value.textContent = String(total);
    item.append(label,value);
    return item;
  }));
}
rppsFilters.hidden = false;
rppsFilters.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{
  rppsType = button.dataset.type;
  rppsFilters.querySelectorAll('button').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  filterRpps();
}));

const electionFilters = document.querySelector('.election-filters');
const electionRows = [...document.querySelectorAll('.election-row')];
electionFilters.hidden = false;
electionFilters.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{
  let visibleCount = 0;
  electionFilters.querySelectorAll('button').forEach(item=>item.setAttribute('aria-pressed',String(item === button)));
  electionRows.forEach(row=>{
    const visible = button.dataset.result === 'all' || row.dataset.result === button.dataset.result;
    row.hidden = !visible;
    if (visible) visibleCount++;
  });
  document.querySelector('.election-count').textContent = `${visibleCount} de ${electionRows.length} nomes exibidos.`;
}));
