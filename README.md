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

## Desenvolvimento

Requer Node.js moderno. Não há dependências npm para instalar.

```sh
npm run build
npm run preview
```

Abra `http://127.0.0.1:4173`. O build gera `dist/`, que fica fora do Git.

- `src/`: estrutura, estilos e interações da página.
- `data/cases.json`: valores, recortes, fontes e parâmetros cambiais.
- `scripts/build.mjs`: gera a página estática a partir dos dados.
- `.openai/hosting.json`: identificação e configuração de hospedagem do Sites.

Fontes consultadas em 10/10/2026. O recorte é histórico e não pretende reunir todos os valores ou todas as decisões posteriores dos processos.

## Fonte inicial

- [Banco Central: liquidação extrajudicial do Banco Master — 18/11/2025](https://www.bcb.gov.br/detalhenoticia/20936/nota/undefined)

A fonte acima é um ponto de partida para a cobertura do caso. As fontes específicas da comparação estão nos dados e na própria página.

## Estado do projeto

Primeira seção implementada em HTML, CSS e JavaScript, com layout responsivo, fontes consultáveis e dados exportáveis. As demais seções propostas ainda serão desenvolvidas.
