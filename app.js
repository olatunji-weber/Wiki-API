const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs")
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

const uri = "mongodb+srv://yinkuze:lSdRhgNlq8pivp7a@cluster0.eqdclwy.mongodb.net/wikiDB";
// mongoose.connect(uri, {userNewUrlParser: true});
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(uri, {useNewUrlParser: true});
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

// This is a chained Route for the "get, post and delete methods...."
/////////////////////////////////////////////Requests Targeting All Articles//////////////////////
app.route("/articles")
.get(function(req, res){
    Article.find(function(err, foundArticles){
        if(!err){
            res.send(foundArticles);
        }else{
            res.send(err)
        }
    })
})
.post(function(req, res){
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added new article....");
        }else{
            res.send(err);
        }
    });
})
.delete(function(req, res){ 
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all Articles....");
        }else{
            res.send(err);
        }
    });
});

/////////////////////////////////////////////Requests Targeting All Articles//////////////////////
app.route("/articles/:articleTitle")
.get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
            if(foundArticle){
                res.send(foundArticle);
            }else{
                res.send("No Articles matching that title was found....");
            }
        }
    );
})
.put(function(req, res){
    console.log(req.params.articleTitle);
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if(!err){
                res.send("Successfully updated Article.....");
            }
        }
    );
})
.patch(function(req, res){
    console.log(req.params.articleTitle);   
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Successfully updated Article....");
            }else{
                res.send(err);
            }
        }
    );
})
.delete(function(req, res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Successfully deleted Article....");
            }else{
                res.send(err);
            }
        }
    );
});

app.get("/", function(req, res){
    res.sendFile(__dirname+"/index.html");
});

app.listen(3000, function(req, res){
    console.log("Server is Started on port 3000....");
});