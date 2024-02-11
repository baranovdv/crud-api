import { createServer } from 'http';

const PORT = 3000;

export const server = createServer((_, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('Hello wrld');
});

server.listen(PORT, () => {
  console.log('server started');
});


