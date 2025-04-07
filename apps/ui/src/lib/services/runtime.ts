import type { Messenger } from './messenger';
import type { Router } from './router';

export interface Runtime {
  readonly messenger: Messenger;
  readonly router: Router;
}
