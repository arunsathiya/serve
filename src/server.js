import http from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import path from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const server = http.createServer(async (request, response) => {
  if (request.url === '/') {
    try {
      const imagesDir = join(__dirname, '../public/images');
      const files = await fs.readdir(imagesDir);
      const imageFiles = files.filter(file => 
        ['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(file).toLowerCase())
      );

      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Index of /images</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
                margin: 0;
                padding: 40px;
                background: white;
                color: #000;
              }
              h1 {
                font-size: 18px;
                font-weight: 500;
                margin-bottom: 30px;
                padding-left: 10px;
              }
              .gallery {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 30px;
                padding: 10px;
              }
              .image-container {
                background: white;
                border-radius: 4px;
                overflow: hidden;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                border: 1px solid #eaeaea;
              }
              .image-container:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              }
              .image-container img {
                width: 100%;
                height: 200px;
                object-fit: cover;
                display: block;
              }
              .image-name {
                padding: 12px;
                font-size: 14px;
                color: #0076FF;
                text-decoration: none;
                word-break: break-all;
                background: #fafafa;
                border-top: 1px solid #eaeaea;
              }
              .image-name:hover {
                text-decoration: underline;
              }
              a {
                text-decoration: none;
                color: inherit;
              }
            </style>
          </head>
          <body>
            <h1>Index of /images</h1>
            <div class="gallery">
              ${imageFiles.map(file => `
                <div class="image-container">
                  <a href="/images/${file}">
                    <img src="/images/${file}" alt="${file}" />
                    <div class="image-name">${file}</div>
                  </a>
                </div>
              `).join('')}
            </div>
          </body>
        </html>
      `);
      response.end();
      return;
    } catch (error) {
      console.error('Error reading directory:', error);
      response.writeHead(500);
      response.end('Server Error');
      return;
    }
  }

  // Serve static files
  if (request.url.startsWith('/images/')) {
    const filePath = join(__dirname, '../public', request.url);
    try {
      const data = await fs.readFile(filePath);
      const ext = path.extname(filePath).toLowerCase();
      const contentType = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif'
      }[ext] || 'application/octet-stream';

      response.writeHead(200, { 'Content-Type': contentType });
      response.end(data);
    } catch (error) {
      response.writeHead(404);
      response.end('File not found');
    }
    return;
  }

  response.writeHead(404);
  response.end('Not found');
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Running at http://localhost:${port}`);
});