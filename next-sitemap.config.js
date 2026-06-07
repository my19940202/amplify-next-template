/** @type {import('next-sitemap').IConfig} */
// postbuild 在 Node 中执行 sitemap，使用 process.env 即可
module.exports = {
  siteUrl: process.env.SITE_URL || 'http://localhost:3000',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: [
    '/404',
    '/500',
    '/login',
    '/register',
    '/dashboard',
  ],

  additionalPaths: async () => {
    const staticSlugs = ['', 'map', 'privacy', 'terms', 'contact'];
    return staticSlugs.map((slug) => ({
      loc: slug ? `/${slug}` : '/',
      changefreq: slug === '' ? 'daily' : slug === 'map' ? 'weekly' : 'monthly',
      priority: slug === '' ? 1.0 : slug === 'map' ? 0.9 : 0.6,
      lastmod: new Date().toISOString(),
    }));
  },

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
};
