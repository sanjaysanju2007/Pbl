const mongoose = require('mongoose');

let retryTimer = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/chittukurumbakam';

  // Do not hang for 10s if disconnected
  mongoose.set('bufferCommands', false);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
    if (retryTimer) {
      clearInterval(retryTimer);
      retryTimer = null;
    }
  } catch (error) {
    console.warn(`⚠️  MongoDB Connection Notice: ${error.message}`);
    console.warn(`   Target URI: ${uri}`);
    console.warn(`   Tip: To enable MongoDB locally, start the mongod service, or set MONGO_URI in server/.env to a free MongoDB Atlas connection string.`);
    console.warn(`   The server will remain online and automatically attempt reconnection every 15 seconds.\n`);

    if (!retryTimer) {
      retryTimer = setInterval(() => {
        console.log(`🔄 Attempting MongoDB reconnection...`);
        connectDB();
      }, 15000);
    }
  }
};

module.exports = connectDB;
