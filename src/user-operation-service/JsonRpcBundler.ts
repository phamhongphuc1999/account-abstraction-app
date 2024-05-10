/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiQuery from 'src/services/api-query';
import { buildRequest } from '.';
import { ReputationEntry, UserOpMethodId, UserOperation } from './type';

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

  async dumpMempool() {
    return await this.rpcMethod('debug_bundler_dumpMempool', []);
  }

  async clearMempool() {
    return await this.rpcMethod('debug_bundler_clearMempool', []);
  }

  async setReputation(reputations: Array<ReputationEntry>) {
    return await this.rpcMethod('debug_bundler_setReputation', [reputations]);
  }

  async dumpReputation() {
    return await this.rpcMethod('debug_bundler_dumpReputation', []);
  }

  async clearReputation() {
    return await this.rpcMethod('debug_bundler_clearReputation', []);
  }

  async setBundlingMode(mode: 'manual' | 'auto') {
    return await this.rpcMethod('debug_bundler_setBundlingMode', [mode]);
  }

  async setBundleInterval(interval: number | 'manual' | 'auto', maxPoolSize?: number) {
    return await this.rpcMethod('debug_bundler_setBundleInterval', [interval, maxPoolSize]);
  }

  async sendBundleNow() {
    return await this.rpcMethod('debug_bundler_sendBundleNow', []);
  }

  async getStakeStatus(address: string, entryPoint: string) {
    return await this.rpcMethod('debug_bundler_getStakeStatus', [address, entryPoint]);
  }
}
