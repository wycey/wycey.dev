export class CfRuntimeService {
  constructor(private rt: Runtime["runtime"]) {}

  get caches() {
    return this.rt.caches;
  }

  get cf() {
    return this.rt.cf;
  }

  get env() {
    return this.rt.env;
  }

  get cacheKv() {
    return this.env.CACHE_KV;
  }

  waitUntil<T>(promise: Promise<T>) {
    this.rt.waitUntil(promise);
  }
}
