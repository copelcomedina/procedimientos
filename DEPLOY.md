# Deploy - Procedimientos COPELCO

## 1. Copiar archivos al servidor
```bash
mkdir -p /var/www/rrhh.copelco.com.ar/apps/procedimientos
tar -xzf procedimientos.tar.gz -C /var/www/rrhh.copelco.com.ar/apps/procedimientos
cd /var/www/rrhh.copelco.com.ar/apps/procedimientos
mkdir -p data uploads
```

## 2. Copiar archivos estáticos para Next.js standalone
```bash
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public 2>/dev/null || true
```

## 3. Iniciar con pm2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 4. Configurar Apache (proxy)
Editar: /etc/apache2/sites-enabled/rrhh.copelco.com.ar.conf
Agregar el contenido de apache-proxy.conf dentro del <VirtualHost>

Luego:
```bash
sudo a2enmod proxy proxy_http
sudo systemctl reload apache2
```

## 5. Acceso
URL: http://rrhh.copelco.com.ar/procedimientos
Usuario inicial: admin@copelco.com.ar
Contraseña: password

⚠️  CAMBIÁ LA CONTRASEÑA Y EL JWT_SECRET EN ecosystem.config.js
