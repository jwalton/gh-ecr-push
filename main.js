const { execSync } = require('child_process');
const core = require('@actions/core');
const { getImagesToPush } = require('./images.js');

const AWS_ACCESS_KEY_ID = core.getInput('access-key-id', { required: true });
const AWS_SECRET_ACCESS_KEY = core.getInput('secret-access-key', { required: true });
const image = core.getInput('image', { required: true });
const localImage = core.getInput('local-image') || image;
const awsRegion = core.getInput('region') || process.env.AWS_DEFAULT_REGION || 'us-east-1';
const direction = core.getInput('direction') || 'push';
const isSemver = core.getInput('is-semver');

function run(cmd, options = {}) {
    if (!options.hide) {
        console.log(`$ ${cmd}`);
    }
    return execSync(cmd, {
        shell: '/bin/bash',
        encoding: 'utf-8',
        env: {
            ...process.env,
            AWS_PAGER: '', // Disable the pager.
            AWS_ACCESS_KEY_ID,
            AWS_SECRET_ACCESS_KEY,
        },
    });
}

const accountLoginPassword = `aws ecr get-login-password --region ${awsRegion}`;
const accountData = run(`aws sts get-caller-identity --output json --region ${awsRegion}`);
const awsAccountId = JSON.parse(accountData).Account;

let imageUrl;

run(
    `${accountLoginPassword} | docker login --username AWS --password-stdin ${awsAccountId}.dkr.ecr.${awsRegion}.amazonaws.com`
);

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
