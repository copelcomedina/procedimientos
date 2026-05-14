module.exports = {
  apps: [{
    name: 'procedimientos',
    script: '.next/standalone/server.js',
    cwd: '/var/www/rrhh.copelco.com.ar/public_html/procedimientos',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
      DB_PATH: '/var/www/rrhh.copelco.com.ar/public_html/procedimientos/data/procedimientos.sqlite',
      UPLOAD_DIR: '/var/www/rrhh.copelco.com.ar/public_html/procedimientos/uploads',
      JWT_SECRET: 'copelco-cambia-esta-clave-2026',
      HOSTNAME: '0.0.0.0',
    }
  }]
};