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
