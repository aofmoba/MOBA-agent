import { mergeConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import baseConig from './vite.config.base';

export default mergeConfig(
  {
    mode: 'development',
    server: {
      open: true,
      fs: {
        strict: true,
      },
      host: '0.0.0.0',
      proxy: {
        '/api': {
          // target: 'https://invitecode.cyberpop.online/',
          target: 'https://weblogin.aof.games/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/nftapi': {
          target: 'https://nftapi.cyberpop.online/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/nftapi/, ''),
        },
      },
    },
    plugins: [
      eslint({
        cache: false,
        include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
        exclude: ['node_modules'],
      }),
    ],
  },
  baseConig
);
