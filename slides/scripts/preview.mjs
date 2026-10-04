import { fileURLToPath } from 'node:url';
import { createPreviewServer } from './preview-server.mjs';
createPreviewServer(fileURLToPath(new URL('../dist/', import.meta.url)))
  .listen(Number(process.env.PORT || 4173), '127.0.0.1', () => console.log(`Preview: http://127.0.0.1:${process.env.PORT || 4173}/slides/`));
