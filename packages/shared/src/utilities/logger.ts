class LoggerService {
    debugMode = false;

    constructor() {
        if (typeof window !== 'undefined' && window) {
            this.debugMode =
                process.env.NODE_ENV === 'development'
                    ? true
                    : JSON.parse(localStorage.getItem('job:debug') ?? 'false');
        } else {
            this.debugMode = true;
        }
    }

    // biome-ignore lint/complexity/noBannedTypes: <explanation>
    public get log(): Function {
        // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
        return this.debugMode ? console.log.bind(console) : (): void => {};
    }
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    public get debug(): any {
        // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
        return this.debugMode ? console.debug.bind(console) : (): void => {};
    }
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    public get info(): any {
        // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
        return this.debugMode ? console.info.bind(console) : (): void => {};
    }
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    public get warn(): any {
        // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
        return this.debugMode ? console.warn.bind(console) : (): void => {};
    }

    // biome-ignore lint/complexity/noBannedTypes: <explanation>
    public get error(): Function {
        // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
        return this.debugMode ? console.error.bind(console) : (): void => {};
    }

    // biome-ignore lint/complexity/noBannedTypes: <explanation>
    public get table(): Function {
        // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
        return this.debugMode ? console.table.bind(console) : (): void => {};
    }
}

const logger = new LoggerService();

export default logger;
