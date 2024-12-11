import mongoose from 'mongoose';

let cachedDb = null;

const connectToDatabase = async () => {
  if (cachedDb) {
    return cachedDb;
  }

  const dbUri = process.env.MONGODB_URI;

  if (!dbUri) {
    throw new Error('MongoDB URI is missing in environment variables');
  }

  try {
    const db = await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    cachedDb = db;
    console.log('MongoDB connected successfully');
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB');
  }
};

export default connectToDatabase;


