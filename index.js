
var express=require('express');
var app=express();
app.use(express.static(__dirname));
var bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
var fs=require('fs');
//multer
var multer=require('multer');
var upload=multer({
    storage: multer.diskStorage({
        destination: function(req,file,cb){
            cb(null,upath)
        },
        filename: function(req,file,cb){
            cb(null,file.originalname)
        }
    })
}).single("myfile");

//socket.io block
var http=require("http");
var server=http.createServer(app);
var socketIo=require("socket.io");
const { Script } = require('vm');
var io=socketIo(server);

// Incorrect email or password alert
var incorrectAlert = '<script>alert("Incorrect email or password!"); window.location.href="/";</script>';

// Successful file upload alert
// var uploadSuccessAlert = '<script>alert("File uploaded successfully!");</script>';

// Successful new user registration alert
var newUserAlert = '<script>alert("New user registered successfully!"); window.location.href="/";</script>';

app.get('/',(req,res)=>{
    res.sendFile("index.html",{root: __dirname});
});

app.post("/check",(req,res)=>{
    //sql block
    var mysql=require('mysql');
    var passArray = [];
    var con=mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"kapish123",
        database:"ab"
    });
    var sql="select pass from astral where email='"+req.body.email+"'";

    con.connect(function(err){
        if(err) throw err;
        console.log("connected");
        con.query(sql,function(err,result){
            if(err) throw err;
            for (var i = 0; i < result.length; i++) {
                passArray.push(result[i].pass);
            }
            if(req.body.password==passArray){
                res.sendFile("upload.html",{root: __dirname});
                var mail=req.body.email;
                global.upath="./uploads/"+mail;
            } else {
                // Send incorrect email or password alert
                res.send(incorrectAlert);
            }   
        });
    });
});

//reading
app.post('/read',(req,res)=>{
	res.sendFile("readfiles.html",{root:__dirname});
	fs.readdir(global.upath,(err,files)=>{
		io.on("connection",(socket)=>{
		console.log("A user Connected");
		socket.emit("tosendfilenames",files);
		socket.on("todownloadfile",function(filename){
			global.filenam=filename;
			console.log(filename);
		});
	});
});
});

//file downloading
app.post('/download',(req,res)=>{
	var finalpath=global.upath;
	var filename=global.filenam;
	var finalfile=finalpath+"/"+filename;
	res.download(finalfile,(err)=>{
		if(err) res.send("<h1>File not found</h1>");
	});
	
});
//filehandling
app.post("/upload",upload,(req,res)=>{
    // Send successful file upload alert
    res.send("<script>alert('File Uploaded Successfully');</script>")
});

app.post('/check2',(req,res)=>{
    if(req.body.adminpin==319041){
        //sql block
        var mysql=require('mysql');
        var con=mysql.createConnection({
            host:"localhost",
            user:"root",
            password:"kapish123",
            database:"ab"
        });
        con.connect(function(err){
            if(err) throw err;
            var smail=req.body.email;
            var spass=req.body.password;
            var path='./uploads/'+smail;
            var sql1="select * from astral where email='"+req.body.email+"'";
            var sql2 = "insert into astral(email,pass) values('" + smail + "','" + spass + "')";
            con.query(sql1,function(err,result){
                if(err) console.log(err);
                if(result.length==0)
                {
                    con.query(sql2,function(err,result){
                        if(err) console.log(err);
                        // Send successful new user registration alert
                        res.send(newUserAlert);
                        fs.mkdir(path,(err)=>{
                            if(err) res.send(err);
                        });
                    });
                } else {
                    // Send user already exists alert
                    res.send('<h1>User already exists</h1><script>alert("User already exists!"); window.location.href="/";</script>');
                }
            });
        });
    } else {
        // Send wrong Adminpin alert
        res.send('<h1>Wrong Adminpin</h1><script>alert("Wrong Adminpin!"); window.location.href="/";</script>');
    }
});

server.listen(8081,()=>{
    console.log("server is running on port 8081");
});

