import {Sound} from "./Sound";

export type AssetType = 'image' | 'audio';

export interface AssetDescriptor {
    name: string;
    path: string;
    type: AssetType;
}

export class Asset {
    private static _cache = {
        images: new Map<string, ImageBitmap>(),
        sounds: new Map<string, AudioBuffer>(),
    }

    /**
     * Preload one or more assets into the cache.
     * @param assets Manifest entry or list of entries
     * @param onProgress Optional progress callback (loaded, total)
     */
    static async load(assets: AssetDescriptor | AssetDescriptor[], onProgress?: (loaded: number, total: number) => void): Promise<void> {
        let loaded = 0;
        const list = Array.isArray(assets) ? assets : [assets];
        await Promise.all(list.map(async (asset) => {
            const response = await fetch(asset.path);
            if (!response.ok) {
                throw new Error(`Failed to load "${asset.name}": ${response.status} ${asset.path}`);
            }
            switch (asset.type) {
                case "image":
                    const imageBitmap = await Asset._loadImage(response);
                    Asset._cache.images.set(asset.name, imageBitmap);
                    break;
                case "audio":
                    const audioBuffer = await Asset._loadSound(response);
                    Asset._cache.sounds.set(asset.name, audioBuffer);
                    break;
                default:
                    throw new Error(`Unknown asset type: ${asset.type}`);
            }
            loaded++;
            onProgress?.(loaded, list.length);
        }));
    }

    static getImage(name: string): ImageBitmap {
        const image = Asset._cache.images.get(name);
        if (!image) throw new Error(`Image asset "${name}" not found...`);
        return image
    }

    static getSound(name: string): AudioBuffer {
        const sound = Asset._cache.sounds.get(name);
        if (!sound) throw new Error(`Sound asset "${name}" not found...`);
        return sound;
    }

    private static async _loadImage(response: Response): Promise<ImageBitmap> {
        try {
            const blob = await response.blob();
            return createImageBitmap(blob);
        } catch (e) {
            console.error(`Unable to load image: ${e}`);
            throw e;
        }
    }

    private static async _loadSound(response: Response): Promise<AudioBuffer> {
        try {
            const buffer = await response.arrayBuffer();
            return Sound.ctx.decodeAudioData(buffer);
        } catch (e) {
            console.error(`Unable to load sound: ${e}`);
            throw e;
        }
    }
}