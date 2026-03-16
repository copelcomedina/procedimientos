module.exports = {
  apps: [{
    name: 'procedimientos',
    script: '.next/standalone/server.js',
    cwd: '/var/www/rrhh.copelco.com.ar/apps/procedimientos',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
      DB_PATH: '/var/www/rrhh.copelco.com.ar/apps/procedimientos/data/procedimientos.sqlite',
      UPLOAD_DIR: '/var/www/rrhh.copelco.com.ar/apps/procedimientos/uploads',
      JWT_SECRET: 'copelco-cambia-esta-clave-2026',
      HOSTNAME: '0.0.0.0',
    }
  }]
};
