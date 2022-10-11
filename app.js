// requited packages
const express = require("express");
const fetch = require("node-fetch");

require("dotenv").config();

const app = express();
//server port
const PORT = process.env.PORT || 3000;

//set temp en
app.set("view engine", "ejs");
app.use(express.static("public"));

//needed to parse html for post req
app.use(express.urlencoded({
    extended: true

}))
app.use(express.json());

app.get("/", (req, res) => {
    res.render("index")
})

app.post("/convert-mp3", async (req, res) => {
    const videoId = req.body.videoID;

    if(
        videoId === undefined ||
        videoId === "" ||
        videoId == null
    ){
        return res.render("index", {success : false, message : "Please enter a video Id"}); 
    } else{
        const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`, {
            "method" : "GET",
            "headers" : {
                "x-rapidapi-key" : process.env.API_KEY,
                "x-rapidapi-host" : process.env.API_HOST
            }
        });

        const fetchResponce = await fetchAPI.json();    

        if(fetchResponce.status === "ok")
            return res.render("index", {success : true, song_title: fetchResponce.title, song_link : 
            fetchResponce.link});
        else
            return res.render("index", {success : false, message : fetchResponce.msg})
    }
})

app.listen(PORT, ()=> {
    console.log('Server started on port',{PORT});
})