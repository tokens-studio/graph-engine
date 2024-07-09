import 'swagger-ui-react/swagger-ui.css';
import { openApiDocument } from '@/api/index.ts';
import SwaggerUI from 'swagger-ui-react';

const ApiDoc = () => {
	return <SwaggerUI spec={openApiDocument} />;
};

export default ApiDoc;
