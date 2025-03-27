const express=require("express")
const app=express()
const path=require("path")
const hbs=require("hbs")
const collection=require("./mongodb")
const tamplatePath=path.join(__dirname,'../templates')
app.use(express.json())
app.set("view engine","hbs")
app.set("views",tamplatePath)

app.get('/',(req,res)=>{
    res.render("login")
})
app.get('/signup',(req,res)=>{
    res.render("signup")
})

app.post("/signup",async (req,res)=>{
    const data={
        name:req.body.name,
        password:req.body.password

    }

    await collection.insertMany([data])
    res.render("D:\\CODING\\Git\\CS-PROJECT\\public\\interfaceeee.html")
})

app.listen(3000,()=>{
    console.log("port connected");
})