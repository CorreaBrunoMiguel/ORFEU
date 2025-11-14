import { useEffect, useState } from 'react';
import { getOrfeuCore, getOrfeuFabrica } from '../services/orfeu';

export function OrfeuViewer() {
  const [core, setCore] = useState<any>(null);
  const [fabrica, setFabrica] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [coreData, fabricaData] = await Promise.all([
          getOrfeuCore(),
          getOrfeuFabrica(),
        ]);
        setCore(coreData);
        setFabrica(fabricaData);
      } catch (e: any) {
        setError(String(e));
      }
    }

    load();
  }, []);

  return (
    <div style={{ padding: '16px', fontFamily: 'sans-serif' }}>
      <h1>ORFEU · Visualização</h1>

      {error && (
        <div style={{ color: 'red', marginBottom: '16px' }}>
          Erro ao carregar Orfeu: {error}
        </div>
      )}

      <h2>Core</h2>
      <pre
        style={{
          background: '#111',
          color: '#0f0',
          padding: '8px',
          fontSize: '12px',
          maxHeight: '250px',
          overflow: 'auto',
        }}
      >
        {core ? JSON.stringify(core, null, 2) : 'Carregando...'}
      </pre>

      <h2>Fábrica de Almas</h2>
      <pre
        style={{
          background: '#111',
          color: '#0f0',
          padding: '8px',
          fontSize: '12px',
          maxHeight: '250px',
          overflow: 'auto',
        }}
      >
        {fabrica ? JSON.stringify(fabrica, null, 2) : 'Carregando...'}
      </pre>
    </div>
  );
}
