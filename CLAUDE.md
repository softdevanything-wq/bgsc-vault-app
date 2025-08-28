# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BGSC Vault App - A DeFi vault application on Binance Smart Chain (BSC) that manages user deposits and yields through 28-day investment rounds.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm start

# Build for production (without sourcemaps)
npm run build        # Windows
npm run build:linux  # Linux/Mac

# Run tests (no test files currently exist)
npm test

# Lint code (ESLint with react-app rules)
npm run lint
```

## Architecture & Key Components

### Web3 Integration
- **RPC Strategy**: Uses dRPC Premium as primary provider with multiple fallback BSC endpoints
- **Wallet Connection**: RainbowKit + Wagmi v2 for wallet management
- **Contract Interaction**: Ethers v6 with multicall provider for batch operations
- **Chain**: BSC Mainnet (Chain ID: 56)

### Application Flow
1. `src/index.js` - Initializes Web3 providers, validates environment variables, sets up error boundaries
2. `src/App.js` - Routes users based on wallet connection and whitelist status:
   - Not connected → LandingPage
   - Connected + Whitelisted → MainPage
   - Connected + Not Whitelisted → AccessDenied

### Key Files Structure
- `src/constants.js` - All contract addresses, ABIs, RPC configs, round timing logic
- `src/hooks.js` - Custom hooks including `useVaultData` for fetching vault state
- `src/utils.js` - Utility functions for formatting, calculations
- `src/abi/` - Contract ABI files
- `.env` - Environment variables (contract addresses, API keys, feature flags)

### Vault Contract Features
- Deposit/Withdraw operations (including BNB deposits)
- 28-day investment rounds starting Fridays
- Share token management
- Whitelist/merkle proof access control
- Queue system for withdrawals

### Development Patterns
- Uses React Query for server state with 15s stale time
- Styled Components for styling
- Toast notifications for user feedback
- Debug utilities exposed to window object in development
- Error messages in Korean for user-facing errors

### Important Configuration
- RPC timeout: 10 seconds
- Batch size: 50 calls per multicall
- Gas configuration: Dynamic pricing with speed tiers
- Round duration: 28 days (2,419,200 seconds)

### Security Features
- Content Security Policy (CSP) headers configured
- XSS protection enabled
- Developer tools detection in production
- HTTPS enforcement for non-localhost environments
- Environment variables validation on startup

## Environment Variables

Required environment variables (see `.env.example` or `.env` for reference):
- `REACT_APP_WALLET_CONNECT_PROJECT_ID` - WalletConnect project ID
- `REACT_APP_VAULT_ADDRESS` - Main vault contract address
- `REACT_APP_BGSC_TOKEN_ADDRESS` - BGSC token contract address
- `REACT_APP_WBNB_ADDRESS` - Wrapped BNB token address
- `REACT_APP_dRPC_URLS` - Comma-separated list of dRPC endpoints
- Various feature flags and UI configuration options

## Testing & Quality

Currently no test files exist in the project. ESLint configuration extends "react-app" and "react-app/jest" as defined in package.json.

## Common Development Tasks

### Running a Single Component
Since this is a Create React App project without isolated component development setup, components are tested by running the full app with `npm start` and navigating to the appropriate route.

### Debugging Contract Interactions
In development mode, the following utilities are exposed on the window object:
- `window.debugUtils` - Contains contract instances and utility functions
- Check browser console for detailed contract interaction logs

### Working with Multicall
The app uses multicall provider for efficient batch operations. When adding new contract calls:
1. Use the multicall provider from `src/constants.js`
2. Batch related calls together (max 50 per batch)
3. Handle timeout scenarios (10-second timeout configured)