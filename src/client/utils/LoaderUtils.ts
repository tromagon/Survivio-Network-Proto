import * as Assets from '../assets';

export class LoaderUtils {
    public static loadAllAssets(loader:PIXI.loaders.Loader, onComplete?: Function, onCompleteContext?:any) {
        this.loadImages(loader);
        loader.onComplete.add(onComplete, onCompleteContext);
        loader.load();
    }

    private static loadImages(loader:PIXI.loaders.Loader) {
        for (let image in Assets.Images) {
            for (let option of Object.getOwnPropertyNames(Assets.Images[image])) {
                if (option !== 'getName' && option.includes('get')) {
                    loader.add(Assets.Images[image].getName(), Assets.Images[image][option]());
                }
            }
        }
    }
}