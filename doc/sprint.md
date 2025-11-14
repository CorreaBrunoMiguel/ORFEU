# 📅 Cronograma de Sprints – Orfeu App (Fase Fábrica de Almas)

## 🧱 Sprint 0 – Fundamentos & Setup

**Objetivo:** Preparar o ambiente e a estrutura mínima do projeto.

**Entregas principais:**

- Stack escolhida (ex.: Tauri + React + TypeScript).
- Repositório criado com estrutura básica de pastas:

  - `config/orfeu/`
  - `personas/alters/`
  - `src/backend/`
  - `src/frontend/`

- Arquivos de configuração copiados:

  - `config/orfeu/orfeu_core.yaml`
  - `config/orfeu/orfeu_fabrica_de_almas.yaml`

- Scripts básicos funcionando:

  - `dev` (rodar app em modo desenvolvimento)
  - `build` (gerar app desktop)

---

## 🧠 Sprint 1 – Carregamento do Orfeu (Backend)

**Objetivo:** Permitir que o backend leia e entenda Orfeu como dados
estruturados.

**Entregas principais:**

- Módulo de config que:

  - lê `orfeu_core.yaml`
  - lê `orfeu_fabrica_de_almas.yaml`

- Funções internas:

  - `getOrfeuCore()`
  - `getOrfeuModule("fabrica_de_almas")`

- API/bridge interna expondo:

  - `GET /orfeu/core`
  - `GET /orfeu/modulos/fabrica_de_almas`

---

## 🧬 Sprint 2 – Modelo de Alters & Persistência

**Objetivo:** Criar o “banco de almas” local.

**Entregas principais:**

- Definição do schema de alter (conforme modelo da Fábrica de Almas).
- Implementação das operações:

  - `listAlters()`
  - `getAlter(id)`
  - `saveAlter(alter)`
  - `deleteAlter(id)`

- Salvando alters em:

  - `personas/alters/<id>.json`

---

## 🎛️ Sprint 3 – UI Minimalista: Fábrica de Almas

**Objetivo:** Criar a interface para gerenciar alters.

**Entregas principais:**

- Tela principal:

  - Mostrar status de Orfeu (nome, versão, etc.).
  - Listar alters existentes.
  - Botões:

    - `[Criar novo alter]`
    - `[Editar alter]`
    - `[Excluir alter]`

- Tela de criação/edição de alter:

  - Formulário com campos básicos:

    - `id`
    - `nome exibição`
    - `função principal`
    - `domínio`
    - `descrição inicial`

  - Ao salvar:

    - gerar JSON rascunho
    - salvar como `<id>_draft.json`
    - exibir JSON numa área de texto para copiar (para usar com GPT/Orfeu)

---

## 🧪 Sprint 4 – Ciclo Completo com Orfeu (via ChatGPT)

**Objetivo:** Fechar o loop: app → GPT/Orfeu → app.

**Entregas principais:**

- Função/tela para:

  - [Importar JSON refinado do alter] (colado por você após passar por mim).

- Fluxo completo:

  1. Criar alter (draft) pela UI.
  2. Copiar JSON de rascunho.
  3. Trazer para GPT/Orfeu (questionário + refinamento).
  4. Colar JSON final na aplicação.
  5. Aplicação:

     - valida
     - salva como `<id>.json` definitivo
     - marca `versao`, `criado_em`, `ultima_atualizacao`.

---

## 🧩 Sprint 5 – Acesso Modular ao Orfeu

**Objetivo:** Permitir que a aplicação use apenas pedaços de Orfeu conforme o
contexto.

**Entregas principais:**

- Backend capaz de retornar partes específicas de Orfeu:

  - valores centrais
  - estilo de interação
  - módulo `fabrica_de_almas`

- Endpoints internos (exemplo):

  - `GET /orfeu/valores`
  - `GET /orfeu/estilo`
  - `GET /orfeu/modulos/:id`

- Documentação simples (um `.md`) explicando:

  - qual parte de Orfeu é usada em qual fluxo (ex.: criação de alter, revisão,
    etc.)

---

## 🚀 Sprint 6 – Preparação para Integração com Domínios (Futuro)

**Objetivo:** Deixar o terreno pronto para os próximos módulos (cursos,
projetos, escrita, carreira).

**Entregas principais:**

- Definir como um alter será consumido:

  - como fonte de regras para prompts
  - como schema de saída

- UI para:

  - marcar alters como “ativos”
  - associar alters a domínios futuros (ex.: `athenas_cursos` → módulo Cursos)

---
