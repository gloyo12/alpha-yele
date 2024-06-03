var app = angular.module('app', []);

app.controller('MainController', function($scope, $http,$timeout,$window,$location,$document,$anchorScroll) {

const currentRootURL = window.location.protocol + '//' + window.location.host;

$scope.setValue = (variable,value) =>{
$scope[variable] = value;
};
$scope.orders = [];
$scope.services = [];
$scope.coupons = [];
$scope.screen = 'payasyougo';
$scope.TodayOrders = [];
$scope.Subscriptions = [];
$scope.Subscribers = [];
$scope.Payasugo = [];

// Get today's date
const today = new Date();
const todayYear = today.getFullYear();
const todayMonth = today.getMonth();
const todayDate = today.getDate();

$scope.getCurrentMonth = function() {
var day = '2';
var year = (new Date()).getFullYear();
var month = (new Date()).getMonth() + 1;
var date = month+'/'+day+'/'+year;
var currentDate = new Date(date);
return currentDate;
};
$scope.selectedmonth = $scope.getCurrentMonth();


$scope.isInSelectedMonth = function(dateString, selectedMonth) {
const date1 = new Date(dateString);
const providedMonth = date1.getMonth() + 1;
const date2 = new Date(selectedMonth);
const referrenceMonth = date2.getMonth() + 1;
return date1.getFullYear() === date2.getFullYear() && providedMonth === referrenceMonth;
};


$scope.DownloadsByMonth = () => {
return $scope.downloads.filter(item => $scope.isInSelectedMonth(item.dateCreated,$scope.selectedmonth));
};


$scope.selectedYear = (new Date()).getFullYear();



const generateRandomString = (length) => {
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let result = '';
for (let i = 0; i < length; i++) {
const randomIndex = Math.floor(Math.random() * characters.length);
result += characters.charAt(randomIndex);
}
return result;
}



$scope.calculateTotal = function(items, field) {
return items.reduce(function(sum, item) {
return sum + parseFloat(item[field]);
}, 0);
};
	



const getServices = () =>{
$http.get('/api/fetch/services').then(function(response) {
if(response.status === 200){
$scope.services = response.data.response;
}
}, function(error) {
console.error('Error fetching data:', error);
});
};

getServices();



const getSubscribers = () =>{
$http.get('/api/fetch/subscribers').then(function(response) {
if(response.status === 200){
$scope.Subscribers = response.data.response;
}
}, function(error) {
console.error('Error fetching data:', error);
});
};
getSubscribers();



const getOrders = () =>{
$http.get('/api/fetch/orders').then(function(response) {
if(response.status === 200){
var orders = response.data.response;

// all orders
$scope.orders = orders;


// Filter orders for today's date
$scope.TodayOrders = orders.filter(order => {
const orderDate = new Date(order.dateCreated);
return orderDate.getFullYear() === todayYear &&
orderDate.getMonth() === todayMonth &&
orderDate.getDate() === todayDate;
});


// Filter subscriptions
$scope.Subscriptions = orders.filter(order => {
return order.type === 'monthly';
}); 

// subscription breakdown
$scope.packageBreakdown = $scope.Subscriptions.reduce((acc, order) => {
const found = acc.find(item => item.package === order.package);
if (found) {
found.total += 1;
} else {
acc.push({ package: order.package, total: 1 });
}
return acc;
}, []);


// revenu per package
$scope.revenuPackagesBreakdown = $scope.Subscriptions.reduce((acc, order) => {
const found = acc.find(item => item.package === order.package);
if (found) {
found.total += order.total;
} else {
acc.push({ package: order.package, total: order.total });
}
return acc;
}, []);






// Filter payasyougo
$scope.Payasugo = orders.filter(order => {
return order.type === 'payasugo';
}); 


const standardCounts = Array(12).fill(0);
const expressCounts = Array(12).fill(0);

$scope.Payasugo.forEach(order => {
const date = new Date(order.dateCreated);
const month = date.getMonth();
order.cart.forEach(item => {
if (item.type === "standard") {
standardCounts[month] += 1;
} else if (item.type === "express") {
expressCounts[month] += 1;
}
});
});

$scope.standardCounts = standardCounts;
$scope.expressCounts = expressCounts;
$scope.graphDeliverMode();




const summaryRevenuYear = Array(12).fill(0);
orders.forEach(order => {
  const date = new Date(order.dateCreated);
  const month = date.getMonth();
  summaryRevenuYear[month] += order.total;
});
$scope.summaryRevenuYear = summaryRevenuYear;
$scope.graphRevenueYear();

}
}, function(error) {
console.error('Error fetching data:', error);
});
};

getOrders();



const getCoupons = () =>{
$http.get('/api/fetch/coupons').then(function(response) {
if(response.status === 200){
$scope.coupons = response.data.response;
}
}, function(error) {
console.error('Error fetching data:', error);
});
};
getCoupons();






$scope.addCoupon = async()=>{
addLoaderToBody();
try{
const {coupon} = $scope;
var data ={...coupon};
const value = await fetch(`/api/create/coupon`,{
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
toggleModalAddCoupon()
$scope.coupon = undefined;
var id = response.id;
if($scope.coupons.length){
$scope.coupons.unshift({...data,id});
}else{
$scope.coupons.push({...data,id});	
}
$scope.$apply();

removeLoaderFromBody();
showPopup('success','Successfully added');

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




$scope.deleteCoupon = (id) =>{
var data = {id};
$http.post('/api/delete/coupon',data).then(function(response) {
if(response.status === 200){
var coupons = $scope.coupons.filter(item=>item.id !== id);
$scope.coupons = coupons;
showPopup('success','Deleted Successfully')
}
}, function(error) {
console.error('Error fetching data:', error);
showPopup('error','Oops! An error occured')
});
};






$scope.addService = async()=>{
addLoaderToBody();
try{
const {service} = $scope;
var data ={name:service.name,type:[{name:'standard',...service.type[0]},{name:'express',...service.type[1]}]};
const value = await fetch(`/api/create/service`,{
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
toggleModalAddService()
$scope.service = undefined;
var id = response.id;
if($scope.services.length){
$scope.services.unshift({...data,id});
}else{
$scope.services.push({...data,id});	
}
$scope.$apply();

removeLoaderFromBody();
showPopup('success','Successfully added');

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


$scope.deleteService = (id) =>{
var data = {id};
$http.post('/api/delete/service',data).then(function(response) {
if(response.status === 200){
var services = $scope.services.filter(item=>item.id !== id);
$scope.services = services;
showPopup('success',"Deleted Successfully")
}
}, function(error) {
console.error('Error fetching data:', error);
showPopup('error',"Oops! An error occured.")
});
};





$scope.login = async()=>{
addLoaderToBody();
try{
const {username,password} = $scope;
var data ={username,password};
const value = await fetch(`/api/authenticate/user`,{
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
window.location.href = '/portal/admin/';
}else{
removeLoaderFromBody();
showPopup('error', "password or username is wrong");
}
}catch(error){
removeLoaderFromBody();
console.log(error)
showPopup('error', "An error occured on your browser please refresh and retry");
}

};




$scope.graphRevenueYear = () =>{
const {summaryRevenuYear} =  $scope;
const data = summaryRevenuYear;
// bebgin line chart display
var lineChart = document.getElementById("revenue-monthly").getContext('2d');

// line chart options
var options = {
borderWidth: 2,
cubicInterpolationMode: 'monotone', // make the line curvy over zigzag
pointRadius: 2,
pointHoverRadius: 5,
pointHoverBackgroundColor: '#fff',
pointHoverBorderWidth: 4
}

// create linear gradients for line chart
var gradientOne = lineChart.createLinearGradient(0,0,0,lineChart.canvas.clientHeight)
gradientOne.addColorStop(0, 'rgba(51, 169, 247, 0.3)')
gradientOne.addColorStop(1, 'rgba(0, 0, 0, 0)')

var gradientTwo = lineChart.createLinearGradient(0,0,0,lineChart.canvas.clientHeight)
gradientTwo.addColorStop(0, 'rgba(195, 113, 239, 0.15)')
gradientTwo.addColorStop(1, 'rgba(0, 0, 0, 0)')


new Chart(
lineChart,
{
type: 'line',
data: {
labels: ['Jan','Feb','Mar','Apr','May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
datasets:[
{
label: 'Revenue',
data,
...options,
borderColor: '#33a9f7',
fill: 'start',
backgroundColor: gradientOne
}
]
},
options: {
plugins: {
legend: {display: false},
tooltip: {
backgroundColor: 'rgba(53, 27, 92, 0.8)',
caretPadding: 5,
boxWidth: 5,
usePointStyle: 'triangle',
boxPadding: 3
}
},
scales: {
x: {
grid: {
display: false // set display to false to hide the x-axis grid
},
beginAtZero: true
},
y: {
ticks: {
callback: function(value, index, values) {
return '$ ' + value // prefix '$' to the dataset values
},
stepSize: 100
},
beginAtZero: true
}
}
}
}
)	
};





$scope.graphDeliverMode = () =>{
const {standardCounts,expressCounts} =  $scope;
// bebgin line chart display
var lineChart = document.getElementById("delivery-mode").getContext('2d');

// line chart options
var options = {
borderWidth: 2,
cubicInterpolationMode: 'monotone', // make the line curvy over zigzag
pointRadius: 2,
pointHoverRadius: 5,
pointHoverBackgroundColor: '#fff',
pointHoverBorderWidth: 4
}

// create linear gradients for line chart
var gradientOne = lineChart.createLinearGradient(0,0,0,lineChart.canvas.clientHeight)
gradientOne.addColorStop(0, 'rgba(51, 169, 247, 0.3)')
gradientOne.addColorStop(1, 'rgba(0, 0, 0, 0)')

var gradientTwo = lineChart.createLinearGradient(0,0,0,lineChart.canvas.clientHeight)
gradientTwo.addColorStop(0, 'rgba(195, 113, 239, 0.15)')
gradientTwo.addColorStop(1, 'rgba(0, 0, 0, 0)')


new Chart(
lineChart,
{
type: 'line',
data: {
labels: ['Jan','Feb','Mar','Apr','May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
datasets:[
{
label: 'Standard Delivery',
data:standardCounts,
...options,
borderColor: '#33a9f7',
fill: 'start',
backgroundColor: gradientOne
},
{
label: 'Express Delivery',
data:expressCounts,
...options,
borderColor: '#c371ef',
fill: 'start',
backgroundColor: gradientTwo
}
]
},
options: {
plugins: {
legend: {display: false},
tooltip: {
backgroundColor: 'rgba(53, 27, 92, 0.8)',
caretPadding: 5,
boxWidth: 5,
usePointStyle: 'triangle',
boxPadding: 3
}
},
scales: {
x: {
grid: {
display: false // set display to false to hide the x-axis grid
},
beginAtZero: true
},
y: {
ticks: {
callback: function(value, index, values) {
return value
},
stepSize: 100
},
beginAtZero: true
}
}
}
}
)	
};


});