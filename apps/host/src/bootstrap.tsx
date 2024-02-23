import { createRoot } from 'react-dom/client';
import { AppWithProviders } from './app';
import { type RemoteModule, setRemoteModules } from './shared/lib/module-federation';

const root = createRoot(document.getElementById('root')!);

fetch('/module-federation.manifest.json')
  .then(async (res) => res.json())
  .then((manifest) => setRemoteModules(manifest.remotes as RemoteModule[]))
  .then(() => root.render(<AppWithProviders />))
  // eslint-disable-next-line no-console
  .catch((err) => console.error(err));
