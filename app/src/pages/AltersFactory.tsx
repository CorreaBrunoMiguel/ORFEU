import { useEffect, useState } from 'react';
import {
  listAlters,
  getAlter,
  saveAlter,
  deleteAlter,
} from '../services/alters';

type AlterForm = {
  id: string;
  nome_exibicao: string;
  funcao_principal: string;
  dominio: string; // string com vírgulas na UI, depois viramos array
  descricao: string;
};

export function AltersFactory() {
  const [alters, setAlters] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<AlterForm>({
    id: '',
    nome_exibicao: '',
    funcao_principal: '',
    dominio: '',
    descricao: '',
  });
  const [currentAlterJson, setCurrentAlterJson] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingList, setLoadingList] = useState(false);

  async function refreshAlters() {
    setLoadingList(true);
    setError(null);
    try {
      const data = await listAlters();
      setAlters(data);
    } catch (e: any) {
      setError(String(e));
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    refreshAlters();
  }, []);

  function newAlter() {
    setSelectedId(null);
    const empty: AlterForm = {
      id: '',
      nome_exibicao: '',
      funcao_principal: '',
      dominio: '',
      descricao: '',
    };
    setForm(empty);
    setCurrentAlterJson(JSON.stringify(buildAlterJson(empty), null, 2));
  }

  function onFormChange<K extends keyof AlterForm>(
    key: K,
    value: AlterForm[K]
  ) {
    const updated = { ...form, [key]: value };
    setForm(updated);
    setCurrentAlterJson(JSON.stringify(buildAlterJson(updated), null, 2));
  }

  function buildAlterJson(f: AlterForm) {
    const dominioArray =
      f.dominio.trim().length > 0
        ? f.dominio.split(',').map((d) => d.trim())
        : [];

    return {
      id: f.id,
      nome_exibicao: f.nome_exibicao,
      funcao_principal: f.funcao_principal,
      dominio: dominioArray,
      descricao: f.descricao,
      // campos extras opcionais, já deixando espaço pra evoluir
      metadados: {
        versao: 1,
      },
    };
  }

  async function loadAlter(id: string) {
    setError(null);
    try {
      const alter = await getAlter(id);
      setSelectedId(id);

      const dominioStr = Array.isArray(alter.dominio)
        ? (alter.dominio as any[])
            .map((d) => (typeof d === 'string' ? d : String(d)))
            .join(', ')
        : '';

      const f: AlterForm = {
        id: alter.id ?? '',
        nome_exibicao: alter.nome_exibicao ?? '',
        funcao_principal: alter.funcao_principal ?? '',
        dominio: dominioStr,
        descricao: alter.descricao ?? '',
      };

      setForm(f);
      setCurrentAlterJson(JSON.stringify(alter, null, 2));
    } catch (e: any) {
      setError(String(e));
    }
  }

  async function onSave() {
    setError(null);

    if (!form.id.trim()) {
      setError("O campo 'id' é obrigatório.");
      return;
    }

    setSaving(true);
    try {
      const json = buildAlterJson(form);
      await saveAlter(json);
      setCurrentAlterJson(JSON.stringify(json, null, 2));
      await refreshAlters();
      setSelectedId(form.id);
    } catch (e: any) {
      setError(String(e));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!selectedId) {
      setError('Nenhum alter selecionado para deletar.');
      return;
    }

    setError(null);
    try {
      await deleteAlter(selectedId);
      await refreshAlters();
      setSelectedId(null);
      newAlter();
    } catch (e: any) {
      setError(String(e));
    }
  }

  return (
    <div style={{ padding: '16px', fontFamily: 'sans-serif' }}>
      <h1>Fábrica de Alters</h1>

      {error && (
        <div style={{ color: 'red', marginBottom: '12px' }}>Erro: {error}</div>
      )}

      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        {/* Lista de alters */}
        <div
          style={{
            width: '30%',
            borderRight: '1px solid #333',
            paddingRight: '12px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <h2 style={{ margin: 0 }}>Alters</h2>
            <button onClick={newAlter}>Novo</button>
          </div>

          {loadingList ? (
            <div>Carregando lista...</div>
          ) : alters.length === 0 ? (
            <div>Nenhum alter encontrado.</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {alters.map((alter: any) => (
                <li
                  key={alter.id}
                  style={{
                    padding: '6px 4px',
                    marginBottom: '4px',
                    cursor: 'pointer',
                    background:
                      selectedId === alter.id ? '#222' : 'transparent',
                    borderRadius: '4px',
                  }}
                  onClick={() => loadAlter(alter.id)}
                >
                  <strong>{alter.nome_exibicao ?? alter.id}</strong>
                  <div style={{ fontSize: '11px', opacity: 0.7 }}>
                    {alter.funcao_principal}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Formulário */}
        <div style={{ width: '35%' }}>
          <h2>Editor de Alter</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label>
              <div>ID (usado como nome do arquivo)</div>
              <input
                type="text"
                value={form.id}
                onChange={(e) => onFormChange('id', e.target.value)}
                style={{ width: '100%' }}
              />
            </label>

            <label>
              <div>Nome de exibição</div>
              <input
                type="text"
                value={form.nome_exibicao}
                onChange={(e) => onFormChange('nome_exibicao', e.target.value)}
                style={{ width: '100%' }}
              />
            </label>

            <label>
              <div>Função principal</div>
              <input
                type="text"
                value={form.funcao_principal}
                onChange={(e) =>
                  onFormChange('funcao_principal', e.target.value)
                }
                style={{ width: '100%' }}
              />
            </label>

            <label>
              <div>Domínio(s) (separar por vírgula)</div>
              <input
                type="text"
                value={form.dominio}
                onChange={(e) => onFormChange('dominio', e.target.value)}
                style={{ width: '100%' }}
              />
            </label>

            <label>
              <div>Descrição</div>
              <textarea
                value={form.descricao}
                onChange={(e) => onFormChange('descricao', e.target.value)}
                rows={4}
                style={{ width: '100%' }}
              />
            </label>

            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button onClick={onSave} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar alter'}
              </button>
              <button onClick={onDelete} disabled={!selectedId}>
                Excluir alter
              </button>
            </div>
          </div>
        </div>

        {/* JSON do alter atual (pra copiar pro GPT) */}
        <div style={{ width: '35%' }}>
          <h2>JSON do Alter (para GPT/Orfeu)</h2>
          <p style={{ fontSize: '12px', opacity: 0.8 }}>
            Este é o JSON que será persistido e que você pode copiar para trazer
            ao GPT/Orfeu na fase de refinamento.
          </p>
          <textarea
            readOnly
            value={currentAlterJson}
            style={{
              width: '100%',
              height: '360px',
              fontFamily: 'monospace',
              fontSize: '11px',
              background: '#111',
              color: '#0f0',
            }}
          />
        </div>
      </div>
    </div>
  );
}
