/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
}

module.exports = { exportTrailingSlash: true, nextConfig, images: { loader: "custom" } }
