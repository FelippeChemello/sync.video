import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import * as socketio from 'socket.io';

const port: number = parseInt(process.env.PORT || '3001', 10);
const app: express.Express = express();
const server: http.Server = http.createServer(app);
const io: socketio.Server = new socketio.Server();
io.attach(server, { cors: { origin: '*' } });
app.use(cors());

app.get('/party', async (_: express.Request, res: express.Response) => {
    res.send('Hello World');
});

io.on('connection', (socket: socketio.Socket) => {
    console.log('connection', socket.id);
    socket.emit('status', 'Hello from Socket.io');

    socket.on('disconnect', () => {
        console.log('client disconnected', socket.id);
    });
});

server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
});
