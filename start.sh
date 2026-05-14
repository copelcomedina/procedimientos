#!/bin/bash
export PORT=3001
export NODE_ENV=production
export DB_PATH=/var/www/rrhh.copelco.com.ar/public_html/procedimientos/data/procedimientos.sqlite
export UPLOAD_DIR=/var/www/rrhh.copelco.com.ar/public_html/procedimientos/uploads
export JWT_SECRET=copelco-cambia-esta-clave-2026

node .next/standalone/server.js
