import * as grpc from '@grpc/grpc-js';
import {
	check,
	checkService,
	relationTuples,
	write,
	writeService
} from '@ory/keto-grpc-client/ory/keto/relation_tuples/v1alpha2';
import { provideSingleton } from '@/utils/singleton';

const KETO_URL = process.env.KETO_URL;
@provideSingleton(PermissionService)
export class PermissionService {
	client: checkService.CheckServiceClient;
	writer: writeService.WriteServiceClient;
	constructor() {
		this.writer = new writeService.WriteServiceClient(
			KETO_URL,
			grpc.credentials.createInsecure()
		);
		this.client = new checkService.CheckServiceClient(
			KETO_URL,
			grpc.credentials.createInsecure()
		);
	}

	async checkCanRead(filePath: string, username: string) {
		const checkRequest = new check.CheckRequest();
		checkRequest.setNamespace('files');
		checkRequest.setObject(filePath);
		checkRequest.setRelation('read');

		const sub = new relationTuples.Subject();
		sub.setId(username);
		checkRequest.setSubject(sub);

		return new Promise<boolean>((resolve, reject) => {
			this.client.check(checkRequest, (error, resp) => {
				if (error) {
					reject(error);
				} else {
					resolve(resp.getAllowed());
				}
			});
		});
	}

	async addOwner(filePath: string, username: string) {
		const sub = new relationTuples.Subject();
		sub.setId(username);

		// user is the owner of the file
		const tuple = new relationTuples.RelationTuple();
		tuple.setNamespace('videos');
		tuple.setSubject(sub);
		tuple.setRelation('owner');
		tuple.setObject(filePath);

		//Add the new tuples
		const writeRequest = new write.TransactRelationTuplesRequest();
		const tupleDelta = new write.RelationTupleDelta();
		tupleDelta.setAction(write.RelationTupleDelta.Action.ACTION_INSERT);
		tupleDelta.setRelationTuple(tuple);
		writeRequest.addRelationTupleDeltas(tupleDelta);

		return new Promise<void>((resolve, reject) => {
			this.writer.transactRelationTuples(writeRequest, error => {
				if (error) {
					reject(error);
				} else {
					resolve();
				}
			});
		});
	}
}
