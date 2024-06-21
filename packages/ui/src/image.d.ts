//Not sure why the link is breaking in the next.js package, but this is a workaround to fix it
declare module 'next/image.js' {
  interface ImageProps {
    src: unknown;
    alt?: string;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export = (props: ImageProps) => JSX.Element;
}
