import hardhatAbiExporter from "@solidstate/hardhat-abi-exporter";
import hardhatToolboxMochaEthers from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { defineConfig } from "hardhat/config";

export default defineConfig({
  plugins: [hardhatToolboxMochaEthers, hardhatAbiExporter],
  abiExporter: {
    path: "./abi",
    runOnCompile: true,
    clear: true,
    flat: true,
  },
  solidity: {
    profiles: {
      default: {
        version: "0.8.38",
      },
    },
  },
  paths: {
    sources: "./src",
    artifacts: "./build",
    tests: "./src/tests",
  },
});
