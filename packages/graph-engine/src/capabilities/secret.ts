import { CapabilityFactory, Graph } from "../graph";


export type SecretConfig = {
    secret: string;
    key: string;
}

export interface SecretCapability {
    getSecret(config: SecretConfig): Promise<string>;
}

/**
 * This is a dummy factory that shows how to suport the secret capability
 * @returns 
 */
export const SecretCapability: CapabilityFactory = {
    name: "secret",
    register: (graph: Graph) => {
        const ctx = {
            getSecret: async (config: SecretConfig) => {
                return '';
            }
        } as SecretCapability;

        return ctx;
    }
}