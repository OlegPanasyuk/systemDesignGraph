import { Application, Color, Container, Graphics, Text } from 'pixi.js';

type SystemGraphScene = {
  app: Application;
  resizeObserver: ResizeObserver;
};

const NODES = [
  { label: 'Client', x: 120, y: 120, color: 0xf97316 },
  { label: 'API', x: 350, y: 210, color: 0x0f766e },
  { label: 'Workers', x: 580, y: 120, color: 0x2563eb },
  { label: 'Storage', x: 580, y: 320, color: 0x7c3aed },
];

export function createSystemGraphScene(host: HTMLDivElement): SystemGraphScene {
  const app = new Application();
  const resizeObserver = new ResizeObserver(() => {
    resizeScene(app, host);
  });

  void app.init({
    antialias: true,
    background: new Color('#09111f'),
    resolution: window.devicePixelRatio || 1,
    resizeTo: host,
  }).then(() => {
    host.replaceChildren(app.canvas);
    renderScene(app);
    resizeScene(app, host);
    resizeObserver.observe(host);
  });

  return { app, resizeObserver };
}

export async function destroySystemGraphScene(scene: SystemGraphScene): Promise<void> {
  scene.resizeObserver.disconnect();
  await scene.app.destroy(true, { children: true, texture: true });
}

function renderScene(app: Application): void {
  const stage = app.stage;
  stage.removeChildren();

  const edgeLayer = new Graphics();
  edgeLayer
    .moveTo(NODES[0].x, NODES[0].y)
    .bezierCurveTo(210, 120, 260, 210, NODES[1].x, NODES[1].y)
    .moveTo(NODES[1].x, NODES[1].y)
    .bezierCurveTo(430, 240, 500, 170, NODES[2].x, NODES[2].y)
    .moveTo(NODES[1].x, NODES[1].y)
    .bezierCurveTo(440, 210, 500, 290, NODES[3].x, NODES[3].y)
    .stroke({ width: 3, color: 0x7dd3fc, alpha: 0.55 });

  stage.addChild(edgeLayer);

  for (const node of NODES) {
    stage.addChild(createNode(node.label, node.x, node.y, node.color));
  }
}

function createNode(label: string, x: number, y: number, color: number): Container {
  const container = new Container();
  const shadow = new Graphics().roundRect(-68, -38, 136, 76, 22).fill({ color: 0x020617, alpha: 0.45 });
  shadow.position.set(6, 10);

  const body = new Graphics();
  body.roundRect(-68, -38, 136, 76, 22).fill({ color: 0x111827, alpha: 0.95 });
  body.roundRect(-68, -38, 136, 76, 22).stroke({ width: 2, color, alpha: 0.95 });

  const accent = new Graphics().circle(0, 0, 7).fill({ color });
  accent.position.set(-42, -8);

  const title = new Text({
    text: label,
    style: {
      fill: 0xf8fafc,
      fontFamily: 'Segoe UI',
      fontSize: 18,
      fontWeight: '700',
    },
  });
  title.anchor.set(0.5);
  title.position.set(8, -8);

  const subtitle = new Text({
    text: 'Graph node',
    style: {
      fill: 0x94a3b8,
      fontFamily: 'Segoe UI',
      fontSize: 12,
    },
  });
  subtitle.anchor.set(0.5);
  subtitle.position.set(8, 16);

  container.position.set(x, y);
  container.addChild(shadow, body, accent, title, subtitle);

  return container;
}

function resizeScene(app: Application, host: HTMLDivElement): void {
  const width = host.clientWidth;
  const height = host.clientHeight;

  if (!width || !height) {
    return;
  }

  app.renderer.resize(width, height);
}