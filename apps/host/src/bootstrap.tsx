import { createRoot } from 'react-dom/client';
import { AppWithProviders } from './app';
import { setRemoteDefinitions, type RawRemoteDefinition } from './shared/lib/module-federation';

const bootstrap = async (): Promise<void> => {
  try {
    const res = await fetch('/assets/module-federation.manifest.json');
    const data = (await res.json()) as RawRemoteDefinition[];
    setRemoteDefinitions(data);
    createRoot(document.getElementById('root')!).render(<AppWithProviders />);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};

bootstrap();
