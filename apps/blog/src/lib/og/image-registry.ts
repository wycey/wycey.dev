export interface ImageResources {
  [key: string]: ArrayBuffer;
}

export class ImageRegistry {
  readonly #registry: ImageResources;

  constructor(initialRegistry: ImageResources = {}) {
    this.#registry = initialRegistry;
  }

  has(name: string): boolean {
    return name in this.#registry;
  }

  getBase64(name: string): string {
    const data = this.#registry[name];

    if (!data) {
      throw new Error(`Image "${name}" not found`);
    }

    const base64String = btoa(
      new Uint8Array(data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        "",
      ),
    );

    return `data:image/png;base64,${base64String}`;
  }
}
