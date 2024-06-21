declare module "inversify-binding-decorators" {
  import { interfaces } from "inversify";
  export function buildProviderModule(): interfaces.ContainerModule;
  export function fluentProvide<T>(
    serviceIdentifier: interfaces.ServiceIdentifier<T>,
  );
}
