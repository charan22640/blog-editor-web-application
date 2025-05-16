import mongoose from 'mongoose';

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/blog-editor', {
      serverSelectionTimeoutMS: 5000, // 5 seconds
    });
    console.log('Successfully connected to MongoDB.');
    
    // Test creating a collection
    const testCollection = mongoose.connection.collection('test');
    await testCollection.insertOne({ test: true });
    console.log('Successfully wrote to database.');
    
    await testCollection.deleteOne({ test: true });
    console.log('Successfully cleaned up test data.');
    
    await mongoose.connection.close();
    console.log('Connection closed.');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (error.name === 'MongoServerSelectionError') {
      console.error('Could not connect to MongoDB server. Make sure it is running.');
    }
  }
}

testConnection();
