require('dotenv').config();
const express = require("express");
const app = express();
const port = 3000;

const githubData =
{
    "login": "akramkhan27",
    "id": 117516430,
    "node_id": "U_kgDOBwEojg",
    "avatar_url": "https://avatars.githubusercontent.com/u/117516430?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/akramkhan27",
    "html_url": "https://github.com/akramkhan27",
    "followers_url": "https://api.github.com/users/akramkhan27/followers",
    "following_url": "https://api.github.com/users/akramkhan27/following{/other_user}",
    "gists_url": "https://api.github.com/users/akramkhan27/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/akramkhan27/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/akramkhan27/subscriptions",
    "organizations_url": "https://api.github.com/users/akramkhan27/orgs",
    "repos_url": "https://api.github.com/users/akramkhan27/repos",
    "events_url": "https://api.github.com/users/akramkhan27/events{/privacy}",
    "received_events_url": "https://api.github.com/users/akramkhan27/received_events",
    "type": "User",
    "user_view_type": "public",
    "site_admin": false,
    "name": "Akram khan",
    "company": null,
    "blog": "",
    "location": "Mumbai",
    "email": null,
    "hireable": null,
    "bio": null,
    "twitter_username": null,
    "public_repos": 14,
    "public_gists": 0,
    "followers": 1,
    "following": 5,
    "created_at": "2022-11-05T11:01:25Z",
    "updated_at": "2024-10-20T19:14:13Z"
}

// console.log(process.env.PORT);

app.get("/", (req, res) => {
    res.send("Hello World");
})
app.get("/twitter", (req, res) => {
    res.send("akramkhandotcom")
})
app.get("/login", (req, res) => {
    res.send("<h2>Please Login to twitter</h2>");
})
app.get("/register", (req, res) => {
    res.send("<h2>Please Register to twitter</h2>")
})
app.get("/github",(req, res)=>{
    res.json(githubData);
})

// app.listen(port, ()=>{
//     console.log(`Listening to port : ${port}`);
// })

app.listen(process.env.PORT, () => {
    console.log(`Listening to port : ${process.env.PORT}`);
})