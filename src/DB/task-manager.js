var mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(res => {
    console.log("connected to mongo");
  })
  .catch(err => {
    console.log("db connection err");
  });
