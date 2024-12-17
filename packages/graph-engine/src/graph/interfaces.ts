export interface ILogger {
	log: (message: any) => void;
	error: (message: any) => void;
	warn: (message: any) => void;
}

export const baseLogger: ILogger = {
	log: () => {},
	error: () => {},
	warn: () => {}
};
