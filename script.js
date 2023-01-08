
const input = document.querySelector('.input');
const button = document.querySelector('.button');
const list = document.querySelector('.list');
let idItem = 1;

button.addEventListener('click', addNewToDo);

function addNewToDo(event) {
  event.preventDefault();
  if(input.value.trim()) {
    createNewToDo(idItem, input.value, 'active', addItemInLocalStorage);
  }
}

function createNewToDo(id, text, status, callback) {
  const listItem = document.createElement('li');
  listItem.classList.add('list__item');

  const inputItem = document.createElement('input');
  inputItem.type = 'checkbox';
  inputItem.classList.add('checkbox');
  inputItem.id = id;

  const labelItem = document.createElement('label');
  labelItem.setAttribute('for', id);
  idItem++;
  labelItem.classList.add('label');
  labelItem.textContent = text;
  labelItem.setAttribute('data-status', status);

  if(status === 'checked') {
    labelItem.classList.add('checked');
    inputItem.setAttribute('checked', true);
  }

  input.value = '';

  const buttonItem = document.createElement('button');
  buttonItem.classList.add('delete');
  const imgItem = document.createElement('img');
  imgItem.classList.add('button__img');
  imgItem.src = './assets/cross.png';
  imgItem.alt = 'cross';

  list.append(listItem);
  listItem.append(inputItem);
  listItem.append(labelItem);
  listItem.append(buttonItem);
  buttonItem.append(imgItem);

  listItem.addEventListener('change', changeStatus);
  buttonItem.addEventListener('click', deleteElement);

  if(callback) {
    addItemInLocalStorage(inputItem.id, labelItem.textContent, labelItem.getAttribute('data-status'));
  }
}

function addItemInLocalStorage(id, textContent, status) {
  if(localStorage.getItem('toDo')) {
    let jj = JSON.parse(localStorage.getItem('toDo'));
    localStorage.setItem('toDo',JSON.stringify([...jj, {id: id, text: textContent, status: status}]));
  } else {
    localStorage.setItem('toDo', JSON.stringify([{id: id, text: textContent, status: status}]));
  }
}

function changeStatus(event) {
  event.target.nextSibling.classList.toggle('checked');
  event.target.nextSibling.setAttribute('data-status', 'checked');

  const localArray = JSON.parse(localStorage.getItem('toDo'));
  const result = [].concat(...localArray);

  if(event.target.nextSibling.classList.contains('checked')) {
    let changeElement = result.find(item => item.id === event.target.id);
    changeElement.status = 'checked';
    localStorage.setItem('toDo',JSON.stringify([...result]));
  }

  if(!event.target.nextSibling.classList.contains('checked')) {
    event.target.nextSibling.setAttribute('data-status', 'active');
    let changeElement = result.find(item => item.id === event.target.id);
    changeElement.status = 'active';
    localStorage.setItem('toDo',JSON.stringify([...result]));
  }
}

function deleteElement(event) {

  const localArray = JSON.parse(localStorage.getItem('toDo'));
  const result = [].concat(...localArray);

  result.filter(item => item.id !== event.target.closest('.delete').previousSibling.previousSibling.id)

  localStorage.setItem('toDo', JSON.stringify([...result.filter(item => item.id !== event.target.closest('.delete').previousSibling.previousSibling.id)]));


  event.target.removeEventListener('click', deleteElement);
  event.target.closest('.list__item').remove();
}

document.addEventListener("DOMContentLoaded", getLocalStorageData);

function getLocalStorageData() {
  if(!localStorage.length) {
    return;
  }

  const localArray = JSON.parse(localStorage.getItem('toDo'));
  const result = [].concat(...localArray);

  result.forEach(item => {
  createNewToDo(item.id, item.text, item.status)
  })
}