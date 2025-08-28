const WebpackObfuscator = require('webpack-obfuscator');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Only apply obfuscation in production mode
      if (env === 'production') {
        // Add the obfuscator plugin with minimal settings for better compatibility
        webpackConfig.plugins.push(
          new WebpackObfuscator({
            rotateStringArray: false,
            shuffleStringArray: false,
            stringArray: false,
            stringArrayThreshold: 0,
            compact: true,
            controlFlowFlattening: false,
            deadCodeInjection: false,
            debugProtection: false,
            disableConsoleOutput: false,
            identifierNamesGenerator: 'mangled',
            log: false,
            numbersToExpressions: false,
            renameGlobals: false,
            selfDefending: false,
            simplify: true,
            splitStrings: false,
            unicodeEscapeSequence: false,
            // Extensive exclusion list to prevent functionality issues
            exclude: [
              '**/node_modules/**',
              // 라이브러리 제외
              '**/connectkit*',
              '**/@reown/appkit*',
              '**/@reown/walletkit*',
              '**/@rainbow-me/rainbowkit*',
              '**/wagmi*',
              '**/viem*',
              '**/ethers*',
              '**/walletconnect*',
              '**/@tanstack/react-query*',
              '**/react*',
              '**/react-dom*',
              '**/styled-components*',
              // 지갑 관련 컴포넌트 제외
              '**/src/components/WalletInfoCard*',
              '**/src/components/RegisterWalletButton*',
              '**/src/components/ConnectButton*',
              '**/src/components/WalletConnect*',
              '**/src/components/Wallet*',
              '**/src/hooks/useWallet*',
              '**/src/hooks/useAuth*',
              '**/src/providers/WalletProvider*',
              '**/src/App*',
              // 불필요한 난독화로 성능 이슈 발생하는 파일들 제외
              '**/src/utils/web3*',
              '**/src/utils/wallet*',
              '**/src/utils/ethereum*',
              '**/src/context*'
            ]
          })
        );

        // Enhance the existing minimizer (Terser) 
        webpackConfig.optimization.minimizer = webpackConfig.optimization.minimizer.map(minimizer => {
          if (minimizer instanceof TerserPlugin || minimizer.constructor.name === 'TerserPlugin') {
            return new TerserPlugin({
              terserOptions: {
                compress: {
                  drop_console: true,
                  drop_debugger: true,
                  pure_funcs: ['console.log', 'console.info', 'console.debug']
                },
                mangle: {
                  safari10: true,
                },
                output: {
                  comments: false,
                },
              },
              extractComments: false,
            });
          }
          return minimizer;
        });
      }
      return webpackConfig;
    },
  },
};
