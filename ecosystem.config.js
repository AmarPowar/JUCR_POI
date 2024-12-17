module.exports = {
  apps: [
    {
      name: "my-app",
      script: "src/index.ts",
      instances: 1,
      autorestart: true,
      watch: true,
      exec_mode: "fork",
      interpreter: "ts-node",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
