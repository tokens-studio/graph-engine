import React from 'react';
import dynamic from 'next/dynamic.js';

//This is dynamic as it is is client side only relying on multiple window APIs
const Editor = dynamic(() => import('@/components/editor/index.tsx'), {
	ssr: false
});

const Page = () => {
	return <Editor />;
};

export default Page;
