'use strict';
// ms-restaurante/configs/socket.js

import { Server } from 'socket.io';

let io = null;

export const initSocket = (httpServer, corsOptions) => {
    io = new Server(httpServer, {
        cors: {
            origin: corsOptions.origin || '*',
            methods: ['GET', 'POST'],
            credentials: true,
        }
    });

    io.on('connection', (socket) => {
        // El cliente se une a su sala personal usando su userId
        socket.on('join', (userId) => {
            socket.join(userId);
            console.log(`🔌 Socket conectado: ${userId}`);
        });

        // Admins se unen a la sala 'admin'
        socket.on('join-admin', () => {
            socket.join('admin');
            console.log('🔌 Admin conectado al socket');
        });

        socket.on('disconnect', () => {
            console.log('🔌 Socket desconectado:', socket.id);
        });
    });

    return io;
};

// Devuelve la instancia de io para usarla en los controllers
export const getIO = () => {
    if (!io) throw new Error('Socket.io no ha sido inicializado');
    return io;
};