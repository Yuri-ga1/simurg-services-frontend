import { createRoot } from 'react-dom/client';
import { App } from './app';
import { type RemoteModule, setRemoteModules } from './shared/lib/module-federation';

fetch('/module-federation.manifest.json')
  .then(async (res) => res.json())
  .then((manifest) => setRemoteModules(manifest.remotes as RemoteModule[]))
  .then(() => createRoot(document.getElementById('root')!).render(<App />))
  // eslint-disable-next-line no-console
  .catch((err) => console.error(err));
