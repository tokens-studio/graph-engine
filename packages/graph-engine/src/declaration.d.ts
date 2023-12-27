declare module "json-schema-defaults" {
  export default (schema: any) => any;
}

declare module "*.json" {
  const value: any;
  export default value;
}
