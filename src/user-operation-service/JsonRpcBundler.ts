/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiQuery from 'src/services/api-query';
import { buildRequest } from '.';
import { UserOpMethodId, UserOperation } from './type';

export default class JsonRpcBundler {
  public bundlerUrl: string;
  protected query: ApiQuery;

  constructor(bundlerUrl: string) {
    this.bundlerUrl = bundlerUrl;
    this.query = new ApiQuery(bundlerUrl);
  }

  async rpcMethod(method: UserOpMethodId, params: Array<any>) {
    const body = buildRequest(method, params);
    return await this.query.post('/rpc', body);
  }

  async chainId() {
    return await this.rpcMethod('eth_chainId', []);
  }

  async supportedEntryPoints() {
    return await this.rpcMethod('eth_supportedEntryPoints', []);
  }

  async sendUserOperation(userOp: UserOperation, entryPointAddress: string) {
    return await this.rpcMethod('eth_sendUserOperation', [userOp, entryPointAddress]);
  }

  async estimateUserOperationGas(userOp: Partial<UserOperation>, entryPointAddress: string) {
    return await this.rpcMethod('eth_estimateUserOperationGas', [userOp, entryPointAddress]);
  }

  async getUserOperationReceipt(userOpHash: string) {
    return await this.rpcMethod('eth_getUserOperationReceipt', [userOpHash]);
  }

  async getUserOperationByHash(userOpHash: string) {
    return await this.rpcMethod('eth_getUserOperationByHash', [userOpHash]);
  }

  async clientVersion() {
    return await this.rpcMethod('web3_clientVersion', []);
  }

  async clearState() {
    return await this.rpcMethod('debug_bundler_clearState', []);
  }
}
