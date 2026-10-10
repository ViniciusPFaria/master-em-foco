# Master em Foco

Site independente para explicar o caso do Banco Master à população brasileira, com linguagem acessível, fontes consultáveis e contexto.

## Objetivo

Organizar acontecimentos, documentos e explicações para ajudar o público a entender o caso e seus desdobramentos.

## Estrutura inicial proposta

- **Entenda o caso:** introdução e resumo dos principais acontecimentos.
- **Linha do tempo:** eventos com data, contexto e fonte.
- **Documentos e fontes:** acesso ao material usado nas publicações.
- **Perguntas frequentes:** explicações de termos e dúvidas recorrentes.
- **Sobre o projeto:** metodologia, autoria e canal para correções.

## Critérios editoriais

- Vincular afirmações factuais às fontes que as sustentam.
- Distinguir fatos documentados, alegações, investigações e análises.
- Informar a data do acontecimento e a data da última revisão do conteúdo.
- Atribuir declarações a seus autores e explicar incertezas relevantes.
- Registrar correções e priorizar linguagem compreensível.
- Identificar o projeto como independente, sem vínculo institucional com o Banco Master.

## Primeira seção: os valores em perspectiva

A página inicial compara quatro recortes históricos, com fontes e contexto próprios:

| Caso | Referência exibida | Natureza do valor |
| --- | --- | --- |
| Banco Master | ≈ R$ 12 bilhões | Operações Master–BRB sob investigação, conforme referências de 2025–2026 |
| Odebrecht no Brasil | US$ 349 milhões / ≈ R$ 1,16 bilhão | Propinas no Brasil descritas no caso americano; exclui Braskem e outros países |
| Mensalão | ≈ R$ 55 milhões | Recursos citados pelo relator no julgamento da AP 470 |
| Tríplex do Guarujá | > R$ 2,4 milhões | Benefícios alegados na denúncia de 2016; decisões do processo anuladas |

Valores nominais, sem ajuste pela inflação. Odebrecht convertida pela cotação de venda de R$ 3,3297 por dólar em 21/12/2016, série SGS 1 do Banco Central. Esse câmbio de referência não reconstrói o câmbio de cada pagamento. A comparação não mede perdas homogêneas nem permite classificar a gravidade dos casos pelo tamanho das cifras.

O gráfico oferece escala proporcional e logarítmica, com explicação visível da diferença. Cada caso abre seu contexto e as fontes. O conteúdo e as fontes também ficam disponíveis sem JavaScript.

## Segunda seção: quem foi afetado

Explica os limites e as exclusões da garantia ordinária do FGC, sem presumir que todo pequeno investidor tenha cobertura integral. Destaca BRB, Rioprevidência e Amprev com métricas e datas próprias: provisão para possíveis perdas, perdas apontadas em ações e aplicações nominais. As cifras não são somadas.

A tabela lista os 21 RPPS do levantamento do Ministério da Previdência Social reproduzido pela Câmara (RIC 8052/2025), com filtros estadual/municipal. A fonte não informa a data-base das posições; a data de consulta não é a data de atualização contábil. A lista não abrange todos os credores nem toda a exposição indireta ao grupo. Os dados e as fontes podem ser baixados em JSON e a tabela permanece legível sem JavaScript.

Cada linha também identifica o governador ou prefeito no período documentado das aplicações ou da aprovação, com cargo, partido, referência temporal e fontes. As filiações sem confirmação na data do aporte são sinalizadas. O cargo não comprova participação na decisão de investir. Em Imbituva, são identificados o prefeito em exercício em março de 2024 e o titular. No celular, as linhas são apresentadas em blocos com rótulos de coluna.

Ao lado dos filtros, a contagem por partido acompanha os regimes exibidos. Cada RPPS entra uma única vez: um partido é contado quando todos os chefes do Executivo registrados têm filiação confirmada no período e a mesma legenda; os demais regimes entram em “Não confirmado”. O resumo inicial é gerado no build e fica disponível sem JavaScript. O campo de busca foi removido.

As notas de recuperação distinguem o resgate integral declarado pela prefeitura de Angélica da proteção judicial com liberação ainda pendente informada pela prefeitura de Campo Grande em março de 2026.

## Desenvolvimento local

Requer Node.js moderno. Não há dependências npm para instalar.

```sh
npm run build
npm run preview
```

Abra `http://127.0.0.1:4173`. O build gera `dist/`, que fica fora do Git.

- `src/`: estrutura, estilos e interações da página.
- `data/cases.json`: valores, recortes, fontes e parâmetros cambiais.
- `data/affected.json`: cobertura do FGC, recortes de instituições e 21 RPPS com fontes.
- `data/rpps-politics.json`: chefes do Executivo no período dos aportes, partidos, referências temporais e fontes. O build combina esses dados ao download de afetados.
- `scripts/build.mjs`: gera a página estática a partir dos dados.
- `.openai/hosting.json`: identificação e configuração de hospedagem do Sites.

Fontes consultadas em 10/10/2026. O recorte é histórico e não pretende reunir todos os valores ou todas as decisões posteriores dos processos.

## Fonte inicial

- [Banco Central: liquidação extrajudicial do Banco Master — 18/11/2025](https://www.bcb.gov.br/detalhenoticia/20936/nota/undefined)

A fonte acima é um ponto de partida para a cobertura do caso. As fontes específicas da comparação estão nos dados e na própria página.

## Estado do projeto

Comparação de valores e seção de afetados implementadas em HTML, CSS e JavaScript, com layout responsivo, fontes consultáveis e dados exportáveis. As demais seções propostas ainda serão desenvolvidas.
