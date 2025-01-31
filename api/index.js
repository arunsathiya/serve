import { join, extname } from 'path';
import fs from 'fs/promises';

export const config = {
  api: {
    responseLimit: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    if (req.url === '/') {
      const imagesDir = join(process.cwd(), 'public/images');
      const files = await fs.readdir(imagesDir);
      const imageFiles = files.filter(file => 
        ['.jpg', '.jpeg', '.png', '.gif'].includes(extname(file).toLowerCase())
      );

      res.setHeader('Content-Type', 'text/html');
      res.send(`
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
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}