//Not sure why the link is breaking in the next.js package, but this is a workaround to fix it
declare module 'next/link.js' {
  import React from 'react';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export = (props: { href: string; children: React.ReactNode }) => JSX.Element;
}
