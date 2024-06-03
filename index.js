const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors'); 
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieSession = require('cookie-session');
const cookieParser = require("cookie-parser");
const JWT = require('./paymentJWT');
const axios = require('axios');
const app = express();
const port = 80; 
 

// // create application/json parser
var jsonParser = bodyParser.json()
app.use(cors({origin:true,credentials: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());


app.use(function(request,result,next){
result.setHeader("Access-Control-Allow-Origin","*");
result.header("Access-Control-Allow-Origin","*");
result.header("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS");
result.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
next();
});


app.use(cookieSession({
    name: 'session',
    keys: ['alpha1', 'alpha2'],
    maxAge: 30 * 24 * 60 * 60 * 1000,
}));






// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));
app.use('/public', express.static(__dirname + '/public'));


const checkSession = (req, res, next) => {
if (req.session.isLoggedin) {
next();
} else {
res.redirect('/portal/login');
}
}



// ROUTES
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/thankyou', (req, res) => {
  res.render('thankyou');
});

app.get('/portal/login', (req, res) => {
  res.render('login');
});


app.get('/subscribers-form', (req, res) => {
  res.render('subscribers-form');
});


app.get('/portal/admin',checkSession, (req, res) => {
  res.render('admin');
});

app.get('/logout/user', (req, res) => {
req.session = undefined;
res.redirect('/portal/login');
});


app.get('/:page', (req, res) => {
  res.render(req.params.page);
});


// APIS

app.get('/api/fetch/countries', (req, res) => {
const filePath = './public/data/countries.json'; 
let data = [];
if (fs.existsSync(filePath)) {
data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

res.status(200).json({message:'success',response:data});
});

app.get('/api/fetch/services', (req, res) => {
const filePath = './public/data/services.json'; 
let data = [];
if (fs.existsSync(filePath)) {
data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

res.status(200).json({message:'success',response:data});
});


app.get('/api/fetch/coupons', (req, res) => {
const filePath = './public/data/coupons.json'; 
let data = [];
if (fs.existsSync(filePath)) {
data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

res.status(200).json({message:'success',response:data});
});


app.get('/api/fetch/orders', (req, res) => {
const filePath = './public/data/orders.json'; 
let data = [];
if (fs.existsSync(filePath)) {
data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
}
res.status(200).json({message:'success',response:data});
});


app.get('/api/fetch/subscribers', (req, res) => {
const filePath = './public/data/subscribers.json'; 
let data = [];
if (fs.existsSync(filePath)) {
data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
}
res.status(200).json({message:'success',response:data});
});




app.get('/api/fetch/alpha_packages', (req, res) => {
const filePath = './public/data/alphapackages.json'; 
let data = [];
if (fs.existsSync(filePath)) {
data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
}
res.status(200).json({message:'success',response:data});
});


app.get('/api/fetch/presence_digital', (req, res) => {
const filePath = './public/data/presence_digital.json'; 
let data = [];
if (fs.existsSync(filePath)) {
data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
}
res.status(200).json({message:'success',response:data});
});


app.get('/api/fetch/TailleEntreprise', (req, res) => {
const filePath = './public/data/TailleEntreprise.json'; 
let data = [];
if (fs.existsSync(filePath)) {
data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
}
res.status(200).json({message:'success',response:data});
});



app.get('/api/fetch/secteurActivity', (req, res) => {
const filePath = './public/data/secteurActivity.json'; 
let data = [];
if (fs.existsSync(filePath)) {
data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
}
res.status(200).json({message:'success',response:data});
});



app.get('/api/fetch/objectifBusiness', (req, res) => {
const filePath = './public/data/objectifBusiness.json'; 
let data = [];
if (fs.existsSync(filePath)) {
data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

console.log(data)
res.status(200).json({message:'success',response:data});
});



app.get('/api/fetch/obstacleBusiness', (req, res) => {
const filePath = './public/data/obstacleBusiness.json'; 
let data = [];
if (fs.existsSync(filePath)) {
data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

console.log(data)
res.status(200).json({message:'success',response:data});
});














app.post('/api/authenticate/user', (req, res) => {
const username = 'admin@123';
const password = '@123456';
if(req.body.username === username && req.body.password === password ){
req.session.isLoggedin = true;
 res.status(200).json({message:'success'}); 
}else{
res.status(400).json({message:'unauthorized'});
}
});





app.post('/api/create/order', (req, res) => {
// console.log(req.body);
let newData = req.body;
const filePath = './public/data/orders.json'; 
let existingData = [];
if (fs.existsSync(filePath)) {
existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

var id = existingData.length + 1;
if(existingData.length === 0 ){
existingData.push({...newData,id});
}else{
 existingData.unshift({...newData,id})   
}
fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

res.status(200).json({message:'success',id});
});




app.post('/api/create/subscriber', (req, res) => {
// console.log(req.body);
let newData = req.body;
const filePath = './public/data/subscribers.json'; 
let existingData = [];
if (fs.existsSync(filePath)) {
existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

var id = existingData.length + 1;
if(existingData.length === 0 ){
existingData.push({...newData,id});
}else{
 existingData.unshift({...newData,id})   
}
fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

res.status(200).json({message:'success',id});
});



app.post('/api/create/coupon', (req, res) => {
// console.log(req.body);
let newData = req.body;
const filePath = './public/data/coupons.json'; 
let existingData = [];
if (fs.existsSync(filePath)) {
existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

var id = existingData.length + 1;
if(existingData.length === 0 ){
existingData.push({...newData,id});
}else{
 existingData.unshift({...newData,id})   
}
fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

res.status(200).json({message:'success',id});
});


app.post('/api/delete/coupon', (req, res) => {
console.log(req.body);
let deleteData = req.body;
const filePath = './public/data/coupons.json'; 
let existingData = [];
if (fs.existsSync(filePath)) {
existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

existingData = existingData.filter(function(item) {
    return parseInt(item.id) !== parseInt(deleteData.id);
});
fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
res.status(200).json({message:'success'});
});






app.post('/api/create/service', (req, res) => {
console.log(req.body);
let newData = req.body;
const filePath = './public/data/services.json'; 
let existingData = [];
if (fs.existsSync(filePath)) {
existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

var id = existingData.length + 1;
if(existingData.length === 0 ){
existingData.push({...newData,id});
}else{
 existingData.unshift({...newData,id})   
}
fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

res.status(200).json({message:'success',id});
});


app.post('/api/delete/service', (req, res) => {
console.log(req.body);
let deleteData = req.body;
const filePath = './public/data/services.json'; 
let existingData = [];
if (fs.existsSync(filePath)) {
existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

existingData = existingData.filter(function(item) {
    return parseInt(item.id) !== parseInt(deleteData.id);
});
fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
res.status(200).json({message:'success'});
});





// PAYMENT

app.post('/payment/deposit', async (req, res) => {
const {depositId,statementDescription,amount,reason,returnUrl,email,dateCreated,id} = req.body;

var data = JSON.stringify({
depositId,
returnUrl,
statementDescription,
amount,
reason
});

var config = {
method: 'post',
url: 'https://api.pawapay.cloud/v1/widget/sessions',
headers: {
'Content-Type': 'application/json',
'Authorization': `Bearer ${JWT.token}`
},
data
};

try {
const response = await axios(config);

if (response.status === 201) {

// save the transaction
const filePath = './public/data/orders.json'; 
let existingData = [];
if (fs.existsSync(filePath)) {
existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

if(existingData.length > 0 ){

for(var order of existingData){
if(order.id === id){
order.paymentStatus = "processing";
order.transaction_id = depositId;
}
}
}

fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));



res.status(200).json({ message: 'success', redirectUrl: response.data.redirectUrl });
} else {
res.status(response.status).json({ message: response.statusText });
}
} catch (error) {
console.log(error);
res.status(400).json({ message: 'an error occurred on the server' });
}
});




// Start the server
app.listen(port, () => {
console.log(`Server is running on http://localhost:${port}`);
});
