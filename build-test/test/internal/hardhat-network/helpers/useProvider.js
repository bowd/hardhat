"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useProvider = void 0;
const ethereumjs_util_1 = require("ethereumjs-util");
const default_config_1 = require("../../../../src/internal/core/config/default-config");
const backwards_compatibility_1 = require("../../../../src/internal/core/providers/backwards-compatibility");
const server_1 = require("../../../../src/internal/hardhat-network/jsonrpc/server");
const provider_1 = require("../../../../src/internal/hardhat-network/provider/provider");
const fakeLogger_1 = require("./fakeLogger");
const providers_1 = require("./providers");
function useProvider({ useJsonRpc = providers_1.DEFAULT_USE_JSON_RPC, loggerEnabled = true, forkConfig, mining = providers_1.DEFAULT_MINING_CONFIG, hardfork = providers_1.DEFAULT_HARDFORK, networkName = providers_1.DEFAULT_NETWORK_NAME, chainId = providers_1.DEFAULT_CHAIN_ID, networkId = providers_1.DEFAULT_NETWORK_ID, blockGasLimit = providers_1.DEFAULT_BLOCK_GAS_LIMIT, accounts = providers_1.DEFAULT_ACCOUNTS, allowUnlimitedContractSize = providers_1.DEFAULT_ALLOW_UNLIMITED_CONTRACT_SIZE, initialBaseFeePerGas, mempool = providers_1.DEFAULT_MEMPOOL_CONFIG, coinbase, chains = default_config_1.defaultHardhatNetworkParams.chains, } = {}) {
    beforeEach("Initialize provider", async function () {
        this.logger = new fakeLogger_1.FakeModulesLogger(loggerEnabled);
        this.hardhatNetworkProvider = new provider_1.HardhatNetworkProvider(hardfork, networkName, chainId, networkId, blockGasLimit, initialBaseFeePerGas, new ethereumjs_util_1.BN(0), // minGasPrice
        true, true, mining.auto, mining.interval, mempool.order, chains, this.logger, accounts, undefined, allowUnlimitedContractSize, undefined, undefined, forkConfig, coinbase);
        this.provider = new backwards_compatibility_1.BackwardsCompatibilityProviderAdapter(this.hardhatNetworkProvider);
        if (useJsonRpc) {
            this.server = new server_1.JsonRpcServer({
                port: 0,
                hostname: "localhost",
                provider: this.provider,
            });
            this.serverInfo = await this.server.listen();
            this.provider = new backwards_compatibility_1.BackwardsCompatibilityProviderAdapter(this.server.getProvider());
        }
    });
    afterEach("Remove provider", async function () {
        // These two deletes are unsafe, but we use this properties
        // in very locally and are ok with the risk.
        // To make this safe the properties should be optional, which
        // would be really uncomfortable for testing.
        delete this.provider;
        delete this.hardhatNetworkProvider;
        if (this.server !== undefined) {
            await this.server.close();
            delete this.server;
            delete this.serverInfo;
        }
    });
}
exports.useProvider = useProvider;
//# sourceMappingURL=useProvider.js.map