import { execSync } from 'child_process';

export function run(cmd: string, options: { env?: Record<string, string>; hide?: boolean } = {}) {
    if (!options.hide) {
        console.log(`$ ${cmd}`);
    }
    return execSync(cmd, {
        shell: '/bin/bash',
        encoding: 'utf-8',
        env: {
            ...process.env,
            ...options.env,
        },
    });
}

export function loginToEcr(awsRegion: string, awsAccessKeyId: string, awsSecretAccessKey: string) {
    const env = {
        AWS_PAGER: '', // Disable the pager.
        AWS_ACCESS_KEY_ID: awsAccessKeyId,
        AWS_SECRET_ACCESS_KEY: awsSecretAccessKey,
    };

    const accountData = run(`aws sts get-caller-identity --output json --region ${awsRegion}`, {
        env,
    });
    const awsAccountId = JSON.parse(accountData).Account;

    const accountLoginPasswordCmd = `aws ecr get-login-password --region ${awsRegion}`;
    run(
        `${accountLoginPasswordCmd} | docker login --username AWS --password-stdin ${awsAccountId}.dkr.ecr.${awsRegion}.amazonaws.com`,
        { env },
    );

    return { awsAccountId };
}
