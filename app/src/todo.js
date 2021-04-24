// block for adding items

let todoItems = [];

function addTodo(text) {
  const todo = {
    text,
    done: false,
    important: false,
    id: Date.now(),
  };

  todoItems.push(todo);
  renderTodo(todo);
}

function toggleDone(key) {
  // findIndex is an array method that returns the position of an element
  // in the array.
  const index = todoItems.findIndex(item => item.id === Number(key));
  // Locate the todo item in the todoItems array and set its done
  // property to the opposite. That means, `true` will become `false` and vice
  // versa.
  todoItems[index].done = !todoItems[index].done;
  renderTodo(todoItems[index]);
}

function toggleImportance(key) {
  const index = todoItems.findIndex(item => item.id === Number(key));
  // Locate the todo item in the todoItems array and set its important
  // property to the opposite. That means, `true` will become `false` and vice versa.
  todoItems[index].important = !todoItems[index].important;
  renderTodo(todoItems[index]);
}


function deleteTodo(key) {
  // find the corresponding todo object in the todoItems array
  const index = todoItems.findIndex(item => item.id === Number(key));
  // Create a new object with properties of the current todo item
  // and a `deleted` property which is set to true
  const todo = {
    deleted: true,
    ...todoItems[index]
  };
  // remove the todo item from the array by filtering it out
  todoItems = todoItems.filter(item => item.id !== Number(key));
  renderTodo(todo);
}


const addBtn = document.querySelector('.add-button');
// Select the form element
const form = document.querySelector('.add-container');
// Add a submit event listener
addBtn.addEventListener('click', () => { 
  // select the text input
  const input = document.querySelector('.todo-input');

  // Get the value of the input and remove whitespace
  const text = input.value.trim();
  if (text !== '') {
    addTodo(text);
    input.value = '';
    input.focus();
  }
});



// adding todo to html
function renderTodo(todo) {
	// save todo items to LocalStorage
  localStorage.setItem('todoItemsRef', JSON.stringify(todoItems));

  // Select list by id
  const list = document.querySelector('#todoList');
  const item = document.querySelector(`[data-key='${todo.id}']`);  
    
  // add this if block
  if (todo.deleted) {
    // remove the item from the DOM
    item.remove();
    return
  }
  
  // Use the ternary operator to check if `todo.done` is true
  // if so, assign 'done' to `isDone`. Otherwise, assign an empty string
  const isDone = todo.done ? 'todo--done' : '';
  const isActive = todo.done ? '' : 'todo--active';
  const isImportant = todo.important ? 'todo--important' : '';    
  const btnImportantColor = todo.important ? 'btn-importance--not' : '';
  const btnImportantText = todo.important ? 'Not important' : 'Make important'


  // Create an `li` element and assign it to `node`
  const node = document.createElement("li");

  // Set the class attribute
  node.setAttribute('class', `todo ${isActive} ${isDone} ${isImportant}`);
  node.setAttribute('tabindex', '0');

  // Set the data-key attribute to the id of the todo
  node.setAttribute('data-key', todo.id);
  // Set the contents of the `li` element created above
  node.innerHTML = `
    <span class="todo_text">${todo.text}</span>
        <div class="todo__btns-container" tabindex="-1">
          <button type ="buttom" class="btn-importance ${btnImportantColor}" tabindex="0">${btnImportantText}</button>
          <button type ="buttom" class="btn-delete" tabindex="0"></button>
        </div>
  `;
	
  // If the item already exists in the DOM
  if (item) {
    // replace it
    list.replaceChild(node, item);
  } else {
    // otherwise append it to the end of the list
    list.append(node);
  }

  // filter for todo list
  const filterBox = document.querySelectorAll('.todo');
  const filterActiveBtn = document.querySelectorAll('.nav__tab');

  document.querySelector('nav').addEventListener('click', event => {
    if (event.target.tagName !== 'LI') return false;
    let filterClass = event.target.dataset['f'];

    // add or remover border for Active Tab
    filterActiveBtn.forEach(elem => {
      elem.classList.remove('active-tab');
      if (elem == event.target){
        elem.classList.add('active-tab');
      }
    });

    // show or hide to do Tasks
    filterBox.forEach(elem => {
      elem.classList.remove('hide');
      if (!elem.classList.contains('todo--'+filterClass) && filterClass !== 'all') {
        elem.classList.add('hide');
      }
    });
  });
}

// Select the entire list
const list = document.querySelector('#todoList');
// Add a click event listener to the list and its children
list.addEventListener('click', event => {
  if (event.target.classList.contains('todo')) {
    const itemKey = event.target.dataset.key;
    toggleDone(itemKey);
  } else if (event.target.classList.contains('todo_text')) {
    const itemKey = event.target.parentElement.dataset.key;
    toggleDone(itemKey);
  } 
   
  if (event.target.classList.contains('btn-delete')) {
    const itemKey = event.target.closest('.todo').dataset.key;
    deleteTodo(itemKey);
  }

  if (event.target.classList.contains('btn-importance')) {
    const itemKey = event.target.closest('.todo').dataset.key;
    toggleImportance(itemKey);
  }
});

// add Enter and Space Event for todo item
list.addEventListener('keypress', event => {
  if (event.keyCode === 13 || event.keyCode === 32) {
    const itemKey = event.target.dataset.key;
    toggleDone(itemKey);
  } 
});


// load information from LocalStarage
document.addEventListener('DOMContentLoaded', () => {
  const ref = localStorage.getItem('todoItemsRef');
  if (ref) {
    todoItems = JSON.parse(ref);
    todoItems.forEach(item => {
      renderTodo(item);
    });
  }
});