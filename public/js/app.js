var app = angular.module('app', []);

app.controller('MainController', function($scope, $http,$timeout,$window,$location,$document,$anchorScroll) {

const currentRootURL = window.location.protocol + '//' + window.location.host;

$scope.setValue = (variable,value) =>{
$scope[variable] = value;
};
$scope.cart = [];
$scope.services = [];
$scope.coupons = [];



const generateRandomString = (length) => {
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let result = '';
for (let i = 0; i < length; i++) {
const randomIndex = Math.floor(Math.random() * characters.length);
result += characters.charAt(randomIndex);
}
return result;
}



$scope.removeFromCart = function(item) {
var index = $scope.cart.findIndex(function(cartItem) {
return cartItem.id === item.id;
});
if (index !== -1) {
$scope.cart.splice(index, 1);
}
};


$scope.isInCart = function(itemId) {
return $scope.cart.some(function(item) {
return item.id === itemId;
});
};


// Function to add an item to cart
$scope.addToCart = function(addons,express_service,service) {
var item = {};
if ($scope.isInCart(service.name)) {
showPopup('info','Service already added on your cart');
return;
}
var id = $scope.cart.length + 1;
item.id = id;
var service_obj = JSON.parse(service);
item.addons = addons?addons:'';
item.type = express_service? 'express' : 'standard';
item.name = service_obj.name;
var typeObj = service_obj.type.find(x=>x.name === item.type);
item.priceUSD = typeObj.priceUSD;
item.priceXOF = typeObj.priceXOF;
item.livraisonJour = typeObj.livraisonJour;
$scope.cart.push(item);
// reset service & express_service
$scope.service = undefined;
$scope.express_service = false;
$scope.addons = undefined;
};


const calculateTotal = function(items, field) {
return items.reduce(function(sum, item) {
return sum + parseFloat(item[field]);
}, 0);
};
	


$scope.getCountries = () =>{
$http.get('/api/fetch/countries').then(function(response) {
if(response.status === 200){
const countries = response.data.response;
$scope.countries = countries;
$scope.selectedCountry = countries.find(item=>item.phoneCode === "+225");
}
}, function(error) {
console.error('Error fetching data:', error);
});
};


$scope.getServices = () =>{
$http.get('/api/fetch/services').then(function(response) {
if(response.status === 200){
$scope.services = response.data.response;
}
}, function(error) {
console.error('Error fetching data:', error);
});
};



$scope.getCoupons = () =>{
$http.get('/api/fetch/coupons').then(function(response) {
if(response.status === 200){
$scope.coupons = response.data.response;
}
}, function(error) {
console.error('Error fetching data:', error);
});
};






const applyCoupon = (couponCode, totalAmount) => {
const coupon = $scope.coupons.find(c => c.code === couponCode);
if (!coupon) {
return 0;
}

let reduction;
if (coupon.type === 'amount') {
reduction = coupon.value;
} else if (coupon.type === 'percentage') {
reduction = (totalAmount * coupon.value) / 100;
}
return reduction;
}



$scope.totalCart = () =>{
var totalamount = calculateTotal($scope.cart,'priceUSD');
if($scope.coupon === undefined){
return totalamount;
}else{
var reduction = applyCoupon($scope.coupon, totalamount);
var total = totalamount - reduction;
return total;
}
}



$scope.placeOrder = async(total)=>{
addLoaderToBody();
try{
const {cart,email,phone,names,coupon} = $scope;
var data ={cart,email,phone,names,coupon:coupon?coupon:'',dateCreated:new Date(),total};
const value = await fetch(`/api/create/order`,{
method:'POST',
credentials: 'include',
headers:{
'Accept':'application/json',
'Content-Type':'application/json'
},
body:JSON.stringify(data)
});
const response = await value.json();
if(value.status === 200){
toggleQuote();
$scope.cart = [];
$scope.email = undefined;
$scope.phone = undefined;
$scope.names = undefined;
$scope.coupon = undefined;
$scope.$apply();
var orderId = response.id;

removeLoaderFromBody();
showPopup('success','Your order was received successfully, Our operatio team will contact you soon.');

// $scope.redirectToPayment('Package AlphaCreative',amount,'Service - Alphacreative',email,orderId);

}else{
removeLoaderFromBody();
showPopup('error', "An error occured, while processing your order, please refresh and retry");
}
}catch(error){
removeLoaderFromBody();
console.log(error)
showPopup('error', "An error occured on your browser please refresh and retry");
}

};






$scope.createSubscriber = async() =>{
addLoaderToBody();
try{
const {names,selectedCountry,phone_number,email,bizname,package,industry,primMarketingObj,obstacles,presenceDigital,tailleEntreprise} = $scope;
var meta = {names,email,phone:selectedCountry.phoneCode+''+phone_number};
var data ={meta,bizname,package,industry,primMarketingObj,obstacles,presenceDigital,tailleEntreprise,dateCreated:new Date()};
const value = await fetch(`/api/create/subscriber`,{
method:'POST',
credentials: 'include',
headers:{
'Accept':'application/json',
'Content-Type':'application/json'
},
body:JSON.stringify(data)
});
const response = await value.json();
if(value.status === 200){
removeLoaderFromBody();

showPopup('success','Your order was received successfully! Our operation will contact you soon.');

// $scope.redirectToPayment('Subscriber AlphaCreative',amount,'Service - Alphacreative',email,orderId);

// window.location.href='/thankyou?ref='+email+'&status=success';

}else{
removeLoaderFromBody();
showPopup('error', "An error occured, while processing your order, please refresh and retry");
}
}catch(error){
removeLoaderFromBody();
console.log(error)
showPopup('error', "An error occured on your browser please refresh and retry");
}
}


const generateUUID = () => {
return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
const r = (Math.random() * 16) | 0;
const v = c === 'x' ? r : (r & 0x3 | 0x8);
return v.toString(16);
});
}



$scope.redirectToPayment = (statementDescription,amount,reason,email,id) =>{
const returnUrl =`${$scope.currentRootURL}/thankyou`;
var depositId = generateUUID();
const data = {depositId,statementDescription,amount,reason,returnUrl,email,dateCreated:new Date(),id};
$http.post('/payment/deposit',data).then(function(response) {
if(response.status === 200){
removeLoaderFromBody();
window.location.href = response.data.redirectUrl;
}else{
removeLoaderFromBody();
showPopup('error',"Oups ! Une erreur s'est produite: "+response.data.message);
}
}, function(error) {
console.error('Error fetching data:', error);
removeLoaderFromBody();
showPopup('error',"Oups ! Une erreur s'est produite sur notre serveur, veuillez réessayer plus tard");
});

};





// fetch the packages
$scope.alpha_packages = [];

$scope.getAlphaPackage = () =>{
$http.get('/api/fetch/alpha_packages').then(function(response) {
if(response.status === 200){
$scope.alpha_packages = response.data.response;
}
}, function(error) {
console.error('Error fetching data:', error);
});
};


// presence digital
$scope.presence_digital = [];
$scope.getPresenceDigital = () =>{
$http.get('/api/fetch/presence_digital').then(function(response) {
if(response.status === 200){
$scope.presence_digital = response.data.response;
}
}, function(error) {
console.error('Error fetching data:', error);
});
};


// taille de l'entreprise
$scope.TailleEntreprise = [];
$scope.getTailleEntreprise = () =>{
$http.get('/api/fetch/TailleEntreprise').then(function(response) {
if(response.status === 200){
$scope.TailleEntreprise = response.data.response;
}
}, function(error) {
console.error('Error fetching data:', error);
});
};



$scope.secteurActivity = [];
$scope.getsecteurActivity = () =>{
$http.get('/api/fetch/secteurActivity').then(function(response) {
if(response.status === 200){
$scope.secteurActivity = response.data.response;
}
}, function(error) {
console.error('Error fetching data:', error);
});
};



$scope.obstacleBusiness = [];
$scope.getobstacleBusiness = () =>{
$http.get('/api/fetch/obstacleBusiness').then(function(response) {
if(response.status === 200){
$scope.obstacleBusiness = response.data.response;
}
}, function(error) {
console.error('Error fetching data:', error);
});
};


$scope.objectifBusiness = [];
$scope.getobjectifBusiness = () =>{
$http.get('/api/fetch/objectifBusiness').then(function(response) {
if(response.status === 200){
$scope.objectifBusiness = response.data.response;
}
}, function(error) {
console.error('Error fetching data:', error);
});
};



$scope.addToServiceWanted = () =>{
	
}







});