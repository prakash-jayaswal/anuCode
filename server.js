const express = require("express");
const path = require("path")
const passport = require("passport");
const ejs = require("ejs");
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const methodOverride= require('method-override');
const Company = require('./models/company')
const Employee = require('./models/employee')
const dotenv = require('dotenv')

const companyRouter = require('./routes/companies');
const employeeRouter = require('./routes/employees')
//initialization
const app = express();

//passport config
require('./config/passport')(passport)
dotenv.config();
//database config
// const db = require('./config/db').mongoURI;
require('./config/db')
//connect to mongoDB 
// mongoose
// .connect(
//     db, {useNewUrlParser:true}
// )
// .then(()=> console.log('mongodb connected'))
// .catch(err => console.log(err));


//template engine setting
app.use(expressLayouts);
app.set('view engine','ejs');

//express body-parser
app.use(express.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, 'public')));

//express session
app.use(
    session({
        secret:'secret',
        resave:true,
        saveUninitialized:true
    })
);

//passport middlewares
app.use(passport.initialize());
app.use(passport.session());

//connect-flash
app.use(flash());

//global variables
app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next();
})

//companies
app.use(methodOverride('_method'))


app.get('/companies', async(req,res)=>{
  
const companies = await Company.find().sort({createdAt:'desc'})


  res.render('./companies/company',{companies:companies})
})

//employees

app.get('/employee', async(req,res)=>{
  
    const employees = await Employee.find().sort({createdAt:'desc'})
    
    
      res.render('./employees/indexEmployee',{employees:employees})
    })

app.use('/companies',companyRouter)
app.use('/employees',employeeRouter)


//routes
app.use('/',require('./routes/index.js'))
app.use('/users',require('./routes/users.js'))



//port
const PORT = process.env.PORT || 8000
app.listen(PORT,function(){
    console.log(`server is running on port no : ${PORT}`)
})
