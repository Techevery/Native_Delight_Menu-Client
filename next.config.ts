/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [ "res.cloudinary.com", "i.im.ge"],
  },
};

module.exports = nextConfig;