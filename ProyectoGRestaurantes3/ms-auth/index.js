import dotenv from 'dotenv';
dotenv.config();

import app from './configs/app.js';
import { connectDB } from './configs/db.js';

const PORT = process.env.PORT || 3001;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`ms-auth corriendo en puerto ${PORT}`);
    });
});