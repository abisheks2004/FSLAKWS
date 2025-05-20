require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser:    true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected!');
  process.exit(0);
})
.catch(err => {
  console.error(err);
  process.exit(1);
});
