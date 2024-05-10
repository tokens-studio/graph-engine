
//Not sure why the link is breaking in the next.js package, but this is a workaround to fix it
declare module 'next/image.js' {
  import React from 'react';
  interface ImageProps {
    src: any;
    alt?: string;
  }
  export = (props: ImageProps) => JSX.Element;
}


