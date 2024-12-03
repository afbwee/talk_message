import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";

const app = express();
app.set('view engine', 'ejs');
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let posts=[];

const postsFilePath = path.join(__dirname, 'posts.json');

if (fs.existsSync(postsFilePath)) {
    const fileData = fs.readFileSync(postsFilePath, 'utf-8');
    posts = JSON.parse(fileData); // Parse JSON data into JavaScript array
} else {
    fs.writeFileSync(postsFilePath, JSON.stringify([])); // Create empty file if not exists
}

app.get("/", (req, res) => {
    //Step 1 - Make the get route work and render the index.ejs file.
    res.render("index.ejs" ,{posts});
});

app.get("/post", (req, res) => {
    //Step 1 - Make the get route work and render the index.ejs file.
    res.render("post.ejs");
});

app.post("/submit",(req,res)=>{
    const {label,textareaName}=req.body;

    if(label && textareaName){
        const newPost = { label, textareaName };
        posts.push(newPost);

        fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));

        console.log('New post saved:', newPost);
    }
    res.redirect("/");

});

app.post('/edit-post/:index', (req, res) => {
    const index = parseInt(req.params.index, 10); // Get the post index
    const { textareaName } = req.body; // Get the updated text from the form

    if (index >= 0 && index < posts.length) {
        // Update the post content
        posts[index].textareaName = textareaName;

        // Save the updated posts array to the file
        fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));

        console.log(`Post at index ${index} updated:`, textareaName);
        res.redirect('/'); // Redirect back to the homepage
    } else {
        res.status(400).send('Invalid post index');
    }
});

app.post('/delete-post/:index', (req, res) => {
    const index = parseInt(req.params.index, 10); // Get the post index

    if (index >= 0 && index < posts.length) {
        // Remove the post from the array
        posts.splice(index, 1);

        // Save the updated posts array to the file
        fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));

        console.log(`Post at index ${index} deleted`);
        res.redirect('/'); // Redirect back to the homepage
    } else {
        res.status(400).send('Invalid post index');
    }
});



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});