import React from 'react';
import whyDidYouRender from '@welldone-software/why-did-you-render';

if (process.env.NODE_ENV !== 'production') {
  //@ts-ignore
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackHooks: true,
  });
}
