import type { UserConfig } from 'vite';
import pkg from './package.json';
import dayjs from 'dayjs';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import legacy from '@vitejs/plugin-legacy';
import image from '@rollup/plugin-image';
import * as path from 'path';

const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
};
const vendorLibs = [
  {
    match: ['ant-design-vue'],
    output: 'antdv',
  },
];

export default (): UserConfig => {
  return {
    base: '/admin/',
    resolve: {
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
        },
        { find: '@', replacement: path.resolve(__dirname, './src') },
      ],
    },
    server: {
      host: true,
      port: 8000,
    },
    build: {
      target: 'es2015',
      cssTarget: 'chrome80',
      chunkSizeWarningLimit: 4000,
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (/[\\/]node_modules[\\/]/.test(id)) {
              const matchItem = vendorLibs.find((item: { match: string[]; output: string }) => {
                const reg = new RegExp(
                  `[\\/]node_modules[\\/]_?(${item.match.join('|')})(.*)`,
                  'ig',
                );
                return reg.test(id);
              });
              return matchItem ? matchItem.output : null;
            }
          },
        },
      },
    },
    define: {
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              },
            },
          },
        ],
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      {
        ...image(),
        enforce: 'pre',
      },
      legacy({
        targets: ['defaults', 'not IE 11'],
      }),
    ],
    optimizeDeps: {
      include: ['vue-router', 'vue'],
    },
  };
};
