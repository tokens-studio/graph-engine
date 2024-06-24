import { Container, decorate, injectable } from 'inversify';
import { Controller } from '@tsoa/runtime';
import { PrismaClient } from '@prisma/client';
import { buildProviderModule } from 'inversify-binding-decorators';
import { logger } from '@/utils/logging';
import { prisma } from '@/db';
import winston from 'winston';

// Create a new container tsoa can use
const iocContainer = new Container();

decorate(injectable(), Controller); // Makes tsoa's Controller injectable

// make inversify aware of inversify-binding-decorators
iocContainer.load(buildProviderModule());
iocContainer.bind<winston.Logger>(winston.Logger).toConstantValue(logger);
iocContainer.bind<PrismaClient>(PrismaClient).toConstantValue(prisma);

// export according to convention
export { iocContainer };
