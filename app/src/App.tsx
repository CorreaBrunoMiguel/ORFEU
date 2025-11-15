import { OrfeuViewer } from './pages/OrfeuViewer';
import { AltersFactory } from './pages/AltersFactory';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ borderBottom: '1px solid #333', padding: '8px' }}>
        <OrfeuViewer />
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <AltersFactory />
      </div>
    </div>
  );
}

export default App;
