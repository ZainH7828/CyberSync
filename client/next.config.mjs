/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enables static export
  trailingSlash: true, // Ensures correct URL structure for GitHub Pages
  assetPrefix: './', // Adjusts asset paths for GitHub Pages
};

export default nextConfig;
