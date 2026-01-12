/**
 * Test MongoDB Connection Script
 * This script tests which MongoDB instance you're connected to
 */

require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('🔌 Testing MongoDB connection...\n');
    console.log('Connection string (hidden password):');
    const uri = process.env.MONGO_URI;
    if (uri) {
      // Hide password in output
      const hiddenUri = uri.replace(/:\w+@/, ':****@');
      console.log(hiddenUri);
    } else {
      console.log('❌ MONGO_URI not found in .env file');
      process.exit(1);
    }
    
    console.log('\n⏳ Connecting...');
    await mongoose.connect(process.env.MONGO_URI);
    
    const connection = mongoose.connection;
    const dbName = connection.db.databaseName;
    const host = connection.host;
    
    console.log('\n✅ Connected successfully!');
    console.log(`📊 Database name: ${dbName}`);
    console.log(`🌐 Host: ${host}`);
    
    // Check if it's Atlas or local
    if (host.includes('mongodb.net') || host.includes('atlas')) {
      console.log('📍 Connection type: MongoDB Atlas (Cloud)');
    } else {
      console.log('📍 Connection type: Local MongoDB');
    }
    
    // List collections
    const collections = await connection.db.listCollections().toArray();
    console.log(`\n📁 Collections in database (${collections.length}):`);
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    // Count documents
    if (collections.length > 0) {
      console.log('\n📊 Document counts:');
      for (const col of collections) {
        const count = await connection.db.collection(col.name).countDocuments();
        console.log(`   - ${col.name}: ${count} documents`);
      }
    }
    
    await mongoose.disconnect();
    console.log('\n✅ Connection test completed!');
    
  } catch (error) {
    console.error('\n❌ Connection error:', error.message);
    process.exit(1);
  }
}

testConnection();


