// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'AI-Assisted Coding',
  tagline: 'Practical guides for coding with AI tools',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://anoopkcn.github.io',
  baseUrl: '/ai-assisted-coding/',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: ['./plugins/model-pricing'],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'AI-Assisted Coding',
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Docs',
          },
{
            href: 'https://github.com/anoopkcn/ai-assisted-coding',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting Started',
                to: '/',
              },
              {
                label: 'Tools & Workflows',
                to: '/category/tools--workflows',
              },
            ],
          },
          {
            title: 'Topics',
            items: [
              {
                label: 'Prompt Engineering',
                to: '/category/prompt-engineering',
              },
              {
                label: 'Best Practices',
                to: '/category/best-practices',
              },
              {
                label: 'Exercises',
                to: '/category/exercises',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} AI-Assisted Coding`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['bash', 'python', 'json'],
      },
    }),
};

export default config;
