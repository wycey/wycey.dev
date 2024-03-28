/// <reference types="astro/client" />

type KVNamespace = import("@cloudflare/workers-types").KVNamespace;

type ENV = {
  SERVER_URL: string;
  CACHE_KV: KVNamespace;
};

type Runtime = import("@astrojs/cloudflare").AdvancedRuntime<ENV>;

declare namespace App {
  interface Locals extends Runtime {
    user: {
      name: string;
      surname: string;
    };
  }
}

interface ImportMetaEnv {
  readonly PUBLIC_MICROCMS_API_KEY: string;
}
