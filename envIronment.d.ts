declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DB_URL: string;
            SECRET: string;
        }
    }
}

export {}