import { fileTypeFromBuffer } from "file-type";
import sharp from "sharp";

export interface ImageResources {
  [key: string]: ArrayBuffer;
}

const SATORI_SUPPORTED_MIMES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/svg+xml",
]);

export class ImageRegistry {
  readonly #registry: ImageResources;
  readonly #base64Cache = new Map<string, string>();

  constructor(initialRegistry: ImageResources = {}) {
    this.#registry = initialRegistry;
  }

  has(name: string): boolean {
    return name in this.#registry;
  }

  async getBase64(name: string): Promise<string> {
    const cached = this.#base64Cache.get(name);
    if (cached) return cached;

    const data = this.#registry[name];

    if (!data) {
      throw new Error(`Image "${name}" not found`);
    }

    let dataTypedArray = new Uint8Array(data);
    const fileTypeResult = await fileTypeFromBuffer(dataTypedArray);

    let mime = fileTypeResult?.mime ?? "image/png";

    if (mime && !SATORI_SUPPORTED_MIMES.has(mime)) {
      dataTypedArray = new Uint8Array(
        await sharp(dataTypedArray).png().toBuffer(),
      );

      mime = "image/png";
    }

    const base64String = Buffer.from(dataTypedArray).toString("base64");

    const result = `data:${mime};base64,${base64String}`;
    this.#base64Cache.set(name, result);

    return result;
  }
}
