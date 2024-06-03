// POPUPS

const showPopup = (type,message) =>{
if(type=== 'success'){
var html = `<div style="display:flex; align-items:center; gap:2px;height:100%;"><div style="text-align:left;color:#fff;text-transform:capital; line-height:1.5">${message}</div></div>`;
Swal.fire({
toast: true,
showConfirmButton:false,
position:'bottom-start',
timer: 8000,
timerProgressBar: true,
 html,
 background:'#4CAF50',
customClass:{
popup:'swal2-popup',
timerProgressBar: '#fff',
}

})
return;
}


if(type === 'error'){
var html = `<div style="display:flex; align-items:center; gap:2px;height:100%;"><div style="text-align:left;color:#fff;text-transform:capital; line-height:1.5">${message}</div></div>`;
Swal.fire({
toast: true,
showConfirmButton:false,
position:'bottom-start',
timer: 8000,
timerProgressBar: true,
 html,
 background:'rgb(269,68,68)',
customClass:{
// container:'bg-blurred',
popup:'swal2-popup',
timerProgressBar: '#fff',
}

})

return;
}


if(type === 'info'){
var html = `<div style="display:flex; align-items:center; gap:2px;height:100%;"><div style="text-align:left;color:#000;text-transform:capital; line-height:1.5">${message}</div></div>`;
Swal.fire({
toast: true,
showConfirmButton:false,
position:'bottom-start',
timer: 8000,
timerProgressBar: true,
 html,
 background:'rgb(255, 213, 128)',
customClass:{
popup:'swal2-popup',
timerProgressBar: '#fff',
}

})

return;
}
};




const addLoaderToBody = () => {
// Create a new div element
var loaderDiv = document.createElement('div');
// Add the class "loader_" to the div
loaderDiv.className = 'loader_';
// Append the div to the body
document.body.appendChild(loaderDiv);
}


const removeLoaderFromBody = () => {
// Get the loader div element by class name
var loaderDiv = document.querySelector('.loader_');
// Check if the loader div exists
if (loaderDiv) {
// Remove the loader div from the body
loaderDiv.parentNode.removeChild(loaderDiv);
}
}