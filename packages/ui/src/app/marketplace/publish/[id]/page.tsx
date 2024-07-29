import Inner from './clientPage.tsx';

const Page = ({ params }) => {
	return <Inner id={params.id} />;
};

export default Page;
