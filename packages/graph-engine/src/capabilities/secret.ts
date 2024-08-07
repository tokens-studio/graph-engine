import { CapabilityFactory } from './interface.js';

export type SecretConfig = {
	secret: string;
	key: string;
};

export interface SecretCapability {
	getSecret(config: SecretConfig): Promise<string>;
}

/**
 * This is a dummy factory that shows how to suport the secret capability
 * @returns
 */
export const SecretCapability: CapabilityFactory = {
	name: 'secret',
	register: () => {
		const ctx = {
			getSecret: async () => {
				return '';
			}
		} as SecretCapability;

		return ctx;
	}
};
