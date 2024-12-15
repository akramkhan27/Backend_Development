import express from "express";

const app = express();
const port = process.env.PORT || 3000;

// cors problem sol 1
// instal cors from npm
// and whitelist your origin
// refer to cors npm document

// cores problem sol 2 (which is worst)
// add dist folder in backend (dist folder is frontend folder build by vite) compile frontend
// and use middleware (static- which server static files) to serve it
// app.use(express.static(dist))

// cores problem sol 3
// add proxy in vite.config.js
// everyone has different method to write proxy
// like create react app have different and vite has diffrent approach
// as we disscussed


app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/jokes", (req, res) => {
  const jokes = [
    { id: 1, title: "Why the Chicken?", content: "To get to the other side!" },
    { id: 2, title: "Math Humor", content: "It had too many problems." },
    { id: 3, title: "Programming Fun", content: "Light attracts bugs!" },
    { id: 4, title: "Ghostly Giggles", content: "It dampens their spirits!" },
    {
      id: 5,
      title: "Breakfast Blunder",
      content: "He was outstanding in his field!",
    },
  ];

  res.send(jokes);
});

app.listen(port, () => {
  console.log(`The Project is running at PORT : ${port}`);
});
