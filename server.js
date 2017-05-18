const express = require("express");
const hbs = require("hbs");
const fs = require("fs");

const port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + "/views/partials");
app.set("view engine", "hbs");

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now},${req.method},${req.originalUrl}`;
    console.log(log);
    fs.appendFile("server.log", log + "\n", (err) => {
        if (err) {
            console.log("Unable to append!");
        }
    });
    next();
});


app.use((req, res, next) => {
    res.render("maintenance.hbs", {
        pageHeading: "You have reached the end of the internet!",
        description: "Just kidding! We are doing maintenance here."
    });
});

app.use(express.static(__dirname + "/public"));

// for general stuff like logging to console or creating files, we can use app.use() but for creating extensions (also called routes), we must use app.get()

// handlebars --> a way to write html so we can use variables and dynamic properties whose values can be changed/updated automatically.
// eg --> replacing <h1>Hello World</h1> To <h1>{{Message}}</h1>

// the "message" property written above, is then created in app.get() by using res.render like so:
// app.get("/whatever", (req, res) => {
//     res.render("some-file.hbs", {
//         property: value,
//         message: "Hello World"
//     })
// });

// registerHelper --> creates functions ---> to be used in the partials or the handlebars pages --> or in any file with a .hbs extension --> which are then sent to the browser as html.

//  partials are parts of the code from hbs files. Because some code gets repeated, it can be sent to partials which are files containing repetitve code.

//  like footer shouldn't be repeated on every page, it can be put inside a partial file and can be applied to every hbs file inside the "Views Folder" like so:

//lets say there was a partial file named - header.hbs, now to reference it in a hbs file in "views folder", we just have to write {{> header}}.

hbs.registerHelper("getYear", () => {
    return new Date().getFullYear();
});

hbs.registerHelper("screamIt", (text) => {
    return text.toUpperCase();
});

// app.get takes the first argument as the page extension (called route) to port 3000, meaning --> "/" indicates home, "/about" indicates localhost:3000/about.
// This has nothing to do with what file will be rendered, that is decided by app.render().

// If we request app.get(), we need to ensure that we write the route after the localhost like so ---> localhost:3000/extension, to be able to display the error page linked to the route, app.get("/some-extension").

// This isn't ideal because if an error like 404 occurs, we want the error page to display automatically and not keep typing extensions or routes like localhost:3000/error.

// So, its best to use a middle ware so we can create the function that renders the error page automatically.
// res.render() is a function that can be used both in app.use() and app.get(). Its is the same thing.

app.get("/", (req, res) => {
    res.render("home.hbs", {
        pageHeading: "Welcome to My Site Home Page!",
        languages: ["Spanish", " Hindi & English"],
        year: new Date().getFullYear()
    });
});


app.get("/about", (req, res) => {
    res.render("about.hbs", {
        pageHeading: "Welcome to About Page",
        year: new Date().getFullYear()
    });
});


app.get("/bad", (req, res) => {
    res.send({
        errorMessage: "Unable to Connect to Shit!"
    });
});


app.listen(port, () => {
    console.log(`Server is up and running on ${port}`);
});
