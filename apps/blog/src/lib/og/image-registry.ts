import { fileTypeFromBuffer } from "file-type";

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

  async getBase64(name: string): Promise<string> {
    const data = this.#registry[name];

    if (!data) {
      throw new Error(`Image "${name}" not found`);
    }

    const dataTypedArray = new Uint8Array(data);

    const { mime } = (await fileTypeFromBuffer(dataTypedArray)) ?? {};

    const base64String = btoa(
      new Uint8Array(dataTypedArray).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        "",
      ),
    );

    return `data:${mime};base64,${base64String}`;
  }
}
