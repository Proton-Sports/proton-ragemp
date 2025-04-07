/// <reference types="vite/client" />
/// <reference types="@altv/types-webview" />

declare interface Alt {
  isBrowser?: boolean;
}

declare namespace React {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}
