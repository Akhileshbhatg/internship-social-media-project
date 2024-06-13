const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.connect(process.env.MONGO_URI, 
        // { useNewUrlParser: true, useUnifiedTopology: true }
        {dbName: "socialmedia"}
    )
    .then(() => {
        console.log("Mongoose Connected");
    }).catch((error) => {
        console.log("Database Error",error);
    });
}

module.exports = connectDatabase;