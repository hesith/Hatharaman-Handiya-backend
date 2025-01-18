express = require('express');
cors = require('cors');

app = express();

const port = process.env.PORT || 3000;

app.use(cors());

app.get("/", (req, res) => {
  console.log(req);
  res.send("Hello World");
});
 
app.listen(port, () => console.log(`Server running on port ${port} 🔥`)); 