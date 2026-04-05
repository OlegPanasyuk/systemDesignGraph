import { useEffect, useRef } from 'react';
import { createSystemGraphScene, destroySystemGraphScene } from './pixi/SystemGraphScene';

const features = [
  'React 19 + TypeScript entry point',
  'PixiJS rendering surface ready for graph interactions',
  'Vite development workflow with fast rebuilds',
];

function App() {
  const canvasHostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = canvasHostRef.current;

    if (!host) {
      return;
    }

    const scene = createSystemGraphScene(host);

    return () => {
      void destroySystemGraphScene(scene);
    };
  }, []);

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">System Design Graph</p>
        <h1>React, TypeScript, and PixiJS starter for interactive architecture maps.</h1>
        <p className="lede">
          This boilerplate gives you a typed React shell and a Pixi scene you can extend into node-link editing,
          topology views, or real-time system diagrams.
        </p>
        <ul className="feature-list">
          {features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </section>

      <section className="canvas-panel">
        <div className="panel-header">
          <div>
            <p className="panel-label">Live Scene</p>
            <h2>PixiJS viewport</h2>
          </div>
          <span className="panel-chip">Starter Graph</span>
        </div>
        <div className="canvas-host" ref={canvasHostRef} />
      </section>
    </main>
  );
}

export default App;