import * as core from '@actions/core';
import { getImagesToPush } from './images';
import { loginToEcr, run } from './utils';

const AWS_ACCESS_KEY_ID = core.getInput('access-key-id', { required: true });
const AWS_SECRET_ACCESS_KEY = core.getInput('secret-access-key', { required: true });
const image = core.getInput('image', { required: true });
const localImage = core.getInput('local-image') || image;
const awsRegion = core.getInput('region') || process.env.AWS_DEFAULT_REGION || 'us-east-1';
const direction = core.getInput('direction') || 'push';
const isSemver = !!core.getInput('is-semver');

const { awsAccountId } = loginToEcr(awsRegion, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY);

let imageUrl;
if (localImage.includes(',')) {
    if (!core.getInput('local-image')) {
        throw new Error('local-image must be specified if image is a list.');
    } else {
        throw new Error('local-image may not be a list of images.');
    }
}

if (direction === 'push') {
    const imagesToPush = getImagesToPush(localImage, image, isSemver);
    for (const imageToPush of imagesToPush) {
        const uri = `${awsAccountId}.dkr.ecr.${awsRegion}.amazonaws.com/${imageToPush.remoteImage}`;
        console.log(`Pushing local image ${imageToPush.localImage} to ${uri}`);
        run(`docker tag ${imageToPush.localImage} ${uri}`);
        run(`docker push ${uri}`);
        imageUrl = uri;
    }
} else if (direction == 'pull') {
    if (image.includes(',')) {
        throw new Error('image may not be a list of images when pulling');
    }
    const uri = `${awsAccountId}.dkr.ecr.${awsRegion}.amazonaws.com/${image}`;
    console.log(`Pulling ${uri} to ${localImage}`);
    run(`docker pull ${uri}`);
    run(`docker tag ${uri} ${localImage} `);
    imageUrl = uri;
} else {
    throw new Error(`Unknown direction ${direction}`);
}

core.setOutput('imageUrl', imageUrl);
