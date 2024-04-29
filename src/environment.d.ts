declare global {
    namespace NodeJS {
        interface ProcessEnv {
            GITHUB_STATE: string;
            [key: string]: string | undefined;
        }
    }
}

export {};
