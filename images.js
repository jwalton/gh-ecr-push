/**
 * Returns an array of images to push.
 *
 * @param {string} localImage - The name of the local image (e.g. my-image:1.2.3).
 * @param {string} remoteImage - The remote image to push, or a comma delimited list of images to push.
 * @param {boolean} isSemver - If true, we'll generate a list of images to push,
 *   based on the semver found in the localImage.  FOr this to work, the localImage
 *   must have a semver style tag.
 * @returns {{localImage: string, remoteImage: string}[]} - An array of images to push.
 */
exports.getImagesToPush = function getImagesToPush(localImage, remoteImage, isSemver) {
    const remoteImages = remoteImage.split(',').map((image) => image.trim());
    const result = [];

    for (const image of remoteImages) {
        if (!isSemver || !localImage.indexOf(':')) {
            result.push({
                localImage,
                remoteImage: image,
            });
        } else {
            const semverArray = localImage.split(':')[1].split('.');
            const versions = semverArray.map((number, index) =>
                semverArray.slice(0, index + 1).join('.')
            );
            const imageWithoutTag = image.split(':')[0];
            versions.forEach((tag) => {
                result.push({
                    localImage,
                    remoteImage: `${imageWithoutTag}:${tag}`,
                });
            });
        }
    }

    return result;
};
