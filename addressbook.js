const { ipcRenderer } = require('electron')

let $ = require('jquery')
let fs = require('fs')
var contacts = [];
let modal;

$('#cancelbtn').on('click', () => {
  ipcRenderer.send('asynchronous-message', 'closeModal')
})

$('#addbtn').on('click', () => {

  let name = $('#contactname').val()
  let address = $('#contactaddress').val()
  let company = $('#contactcompany').val()
  let cell = $('#contactcell').val()
  let birth = $('#contactbirth').val()
  let email = $('#contactmail').val()
  let url = $('#contacturl').val()

  fs.appendFileSync('contacts.txt', name+","+address+","+company+","+cell+","+birth+","+email+","+url+","+'\n', (err) => {
    if (err) throw err;
    console.log("the data was appended!");
  });

  ipcRenderer.send('asynchronous-message', 'closeAndRefresh')

})

function addEntry(name, address, company, cell, birth, email, url){
  var contact = {};
  contact['name'] = name;
  contact['address'] = address;
  contact['company'] = company;
  contact['cell'] = cell;
  contact['birth'] = birth;
  contact['email'] = email;
  contact['url'] = url;

  contacts.push(contact);
  var index = contacts.length-1;

  let updateString = "<tr onclick='loadDetails(" + index + ")'><td>" + name + "</td><td>" + address + "</td><td>" + company + "</td><td>" + cell + "</td><td>" + birth + "</td><td>" + email + "</td><td>" + url + "</td></tr>"

  $('#contactlist').append(updateString)
}

function loadDetails(index){
    var contact = contacts[index];
    $('#selectedname').text(contact.name);
    $('#selectedaddress').text(contact.address);
    $('#selectedcompany').text(contact.company);
    $('#selectedcell').text(contact.cell);
    $('#selectedbirth').text(contact.birth);
    $('#selectedemail').text(contact.email);
    $('#selectedurl').text(contact.url);
    $('#deletebtn').off('click');
    $('#deletebtn').on('click', () => {
      deleteEntry(index);
    })
}

function deleteEntry(index){

    contacts.splice(index, 1);
    fs.truncateSync('contacts.txt');

    contacts.forEach((contact, index) => {

      fs.appendFileSync('contacts.txt', name+","+address+","+company+","+cell+","+birth+","+email+","+url+","+'\n', (err) => {
        if (err) throw err;
        console.log("the data was appended!");
      });
    })

    contacts = [];
    loadAndDisplayContacts();
}

function loadAndDisplayContacts() {
   let filename = "contacts.txt";

   //Check if file exists
   if(fs.existsSync(filename)) {
      let data = fs.readFileSync(filename, 'utf8').split('\n')
      $('#contactlist').html("<tr><th>Name</th><th>Address</th><th>Company</th><th>Cell Number</th><th>Birthday</th><th>E-mail</th><th>URL</th></tr>");
      data.forEach((contact, index) => {
         let [ name, address, company, cell, birth, email, url ] = contact.split(',')
         if (name && address && company && cell && birth && email && url){
           addEntry(name, address, company, cell, birth, email, url)
         }
      })
      if (contacts.length > 0){
        loadDetails(0);
      }
   }
}

function showAddContactModal(){
  ipcRenderer.send('asynchronous-message', 'showModal')
}
function showEditContactModal(){
  ipcRenderer.send('asynchronous-message', 'showModal')
}
