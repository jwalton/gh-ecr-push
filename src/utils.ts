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
