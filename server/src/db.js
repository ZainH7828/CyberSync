const mongoose = require('mongoose');

const connectDB = async () => {
    try {
      // Need to add db here after connecting live mongo server
        await mongoose.connect('mongodb://79942ee4-9b61-1:adc15f5a-0229-1@mongodb-capsule-qfso.codecapsules.co.za:27017/app?authSource=admin&ssl=true&directConnection=true', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;