const nextConfig = {
  images: {
    domains: ["firebasestorage.googleapis.com", "nokofio-bucket.s3.amazonaws.com", "ik.imagekit.io"],
  },
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true
  },
  staticPageGenerationTimeout: 1000,
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
