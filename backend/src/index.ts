import { config } from 'dotenv';
import app from './app'
import mongoose from 'mongoose';

// Env variables
config({path: '.env'});


// Mongoose Connection
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database_name';

async function connectMongo() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB using Mongoose');
      } catch (error) {
        console.error('Error connecting to MongoDB using Mongoose:', error);
        throw error;
      }
}

// connectMongo()


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});