const app = require('./app.js')
const dotenv = require('dotenv');

//database connection 
const connectDb = require('./config/database.js');

//dotenv file path
dotenv.config({path:"backend/config/config.env"});


//handling uncaught exceptions

process.on('uncaughtException', (err) => {
    console.log(`Error : ${err.message}`);
    console.log('`Shutting down the server due to uncaught exception');
    process.exit(1);
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    connectDb();
    console.log(`Server is running on http://localhost:${PORT}`);
});




// //Unhandled promise rejection
// process.on("unhandledRejection", err => {
//     console.log(`Error : ${err.message}`);
//     console.log('`Shutting down the server due to unhandled promise rejection');
//     server.close(()=>{
//         process.exit(1);
//     })
// });