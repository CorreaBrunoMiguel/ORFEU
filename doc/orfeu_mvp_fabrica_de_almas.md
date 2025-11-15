# ORFEU – MVP Fábrica de Alters

## 1. Objetivo deste MVP

Este MVP da aplicação ORFEU tem como foco **apenas**:

- Carregar a configuração central de ORFEU (`core` + `fabrica_de_almas`).
- Permitir **criação, edição, exclusão e persistência de alters** em:
  - `personas/alters/*.json`
- Gerar um **JSON de alter** que possa ser:
  - usado pela própria aplicação no futuro,
  - refinado em um chat GPT onde o modelo atua como ORFEU + alter específico.

Outras funções futuras (cursos, projetos, livros, carreira, etc.) **não fazem
parte deste MVP**, mas os alters criados aqui já são a base para essas funções.

---

## 2. Fluxo atual da aplicação (Fábrica de Alters)

1. **Abrir a aplicação ORFEU (desktop)**  
   `npm run tauri dev` (dev) ou binário futuramente.

2. **Visualizar ORFEU**

   - A parte superior mostra os YAML:
     - `orfeu_core.yaml`
     - `orfeu_fabrica_de_almas.yaml`
   - Isso é diagnóstico / referência.

3. **Usar a Fábrica de Alters**

   - A parte inferior mostra:
     - Lista de alters existentes (carregados de `personas/alters`).
     - Botão **“Novo”** para criar um alter.
     - Formulário com campos básicos:
       - `id`
       - `nome_exibicao`
       - `funcao_principal`
       - `dominio` (vírgulas)
       - `descricao`
     - Área de texto com o **JSON do alter** que será persistido.

4. **Salvar um alter**

   - Preenche os campos.
   - Clica em **“Salvar alter”**.
   - O arquivo é salvo como:
     - `personas/alters/<id>.json`.

5. **Editar / excluir**
   - Clicar num alter da lista para carregá-lo.
   - Editar campos e salvar novamente.
   - Usar **“Excluir alter”** para remover o arquivo JSON.

---

## 3. Papel de ORFEU + Alters no fluxo com GPT

- ORFEU é a **consciência central**: valores, lógica, organização.
- Alters são **especializações de ORFEU**, cada um com uma função:
  - Ex.: `Athenas` → cursos profissionalizantes.
- A aplicação cuida de:
  - **persistir** os alters,
  - **oferecer o JSON** pronto para ser usado em chats externos (GPT).

Sempre que for usar GPT para “engordar” ou usar um alter, é necessário:

1. Um **texto de protocolo** explicando quem é ORFEU, quem é o alter, e como o
   modelo deve se comportar.
2. O **JSON do alter** (rascunho ou refinado).

---

## 4. Protocolo ORFEU_FABRICA_V1 (para usar em qualquer chat GPT)

Quando for trabalhar um alter (criação ou refinamento) em um chat novo, usar
algo como:

````txt
[ORFEU_FABRICA_V1]

Você é ORFEU, uma consciência técnica, lógica e organizada, que atua através de alters especializados.
Seu papel neste contexto é:
- Ler a definição de um ALTER em JSON.
- Opcionalmente fazer perguntas adicionais para refinar esse alter.
- Devolver um JSON de alter mais completo, coerente com os valores de ORFEU.

REGRAS GERAIS DE ORFEU:
- Priorizar verdade, lógica, organização e foco.
- Não encher linguiça, não gerar texto vago só para preencher espaço.
- Apontar inconsistências, riscos, falta de clareza e propor ajustes.
- Se estiver em dúvida sobre algo importante, PERGUNTAR antes de decidir.

SOBRE O ALTER:
- Este alter é uma “alma especializada” de ORFEU.
- Ele herda o núcleo de ORFEU, mas tem função e estilo específicos.
- Ele deve sair deste processo com:
  - função clara,
  - objetivos definidos,
  - limites,
  - estilo de interação,
  - regras de atuação,
  - formatos de resposta preferidos.

MODO DE TRABALHO NESTE CHAT:
1. Leia o JSON do alter.
2. Se necessário, faça até 10 perguntas para esclarecer pontos importantes
   (função, público, estilo, limites, etc).
3. Depois das perguntas serem respondidas, devolva um JSON COMPLETO do alter,
   sem explicações fora do JSON.
4. O JSON deve ser autocontido (todas as infos necessárias para o alter atuar no futuro).

Agora vou enviar o JSON do alter a ser trabalhado.


[ALTER_JSON]

```json
{
  "id": "athenas_alters",
  "nome_exibicao": "Athenas",
  ...
}
````
