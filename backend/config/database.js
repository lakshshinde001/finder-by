const mongoose = require('mongoose')

const connectDb = async () =>{
    try {
        const {connection } = await mongoose.connect(process.env.DB_URL);
        if(connection){
            console.log(`Successfully Connected To ${connection.host}`);
        }
    } catch (e) {
        console.log(e);
    }
}
module.exports = connectDb;