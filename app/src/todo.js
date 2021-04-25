const search = document.querySelector('#toDoSearch');

search.addEventListener('input', function () {
  defaultFilterBtns(tabs);
  const val = this.value.trim().toLowerCase();
  const tasks = document.querySelectorAll('.todo span');
  if (val !== '') {
    tasks.forEach((elem) => {
      if (elem.innerText.toLowerCase().search(val) === -1) {
        elem.parentElement.classList.add('hide');
        elem.innerHTML = elem.innerText;
      } else {
        elem.parentElement.classList.remove('hide');
      }
    });
  } else {
    tasks.forEach((elem) => {
      elem.parentElement.classList.remove('hide');
      elem.innerHTML = elem.innerText;
    });
  }
});

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
  const index = todoItems.findIndex((item) => item.id === Number(key));
  // Locate the todo item in the todoItems array and set its done
  // property to the opposite. That means, `true` will become `false` and vice
  // versa.
  todoItems[index].done = !todoItems[index].done;
  renderTodo(todoItems[index]);
}

function toggleImportance(key) {
  const index = todoItems.findIndex((item) => item.id === Number(key));
  // Locate the todo item in the todoItems array and set its important
  // property to the opposite. That means, `true` will become `false` and vice versa.
  todoItems[index].important = !todoItems[index].important;
  renderTodo(todoItems[index]);
}

function deleteTodo(key) {
  // find the corresponding todo object in the todoItems array
  const index = todoItems.findIndex((item) => item.id === Number(key));
  // Create a new object with properties of the current todo item
  // and a `deleted` property which is set to true
  const todo = {
    deleted: true,
    ...todoItems[index],
  };
  // remove the todo item from the array by filtering it out
  todoItems = todoItems.filter((item) => item.id !== Number(key));
  renderTodo(todo);
}

const addBtn = document.querySelector('.add-button');
// Select the input block
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

const navigationTabs = document.querySelector('nav');
let filterClass = 'all';

function filterTodo() {
  const filterBox = document.querySelectorAll('.todo');
  filterBox.forEach((elem) => {
    elem.classList.remove('hide');
    if (!elem.classList.contains(`todo--${filterClass}`) && filterClass !== 'all') {
      elem.classList.add('hide');
    }
  });
}

function filterTabs(tabs) {
  const filterActiveBtn = document.querySelectorAll('.nav__tab');

  function toggleActiveTab(event) {
    if (
      event.type === 'click' ||
      (event.type === 'keypress' && (event.key === 'Enter' || event.key === ' '))
    ) {
      if (event.target.tagName !== 'LI') return false;
      form.classList.remove('hide');
      filterClass = event.target.dataset.f;

      // add or remove border for Active Tab
      filterActiveBtn.forEach((elem) => {
        elem.classList.remove('nav__tab--active');
        if (elem == event.target) {
          elem.classList.add('nav__tab--active');
          if (filterClass === 'done') {
            form.classList.add('hide');
          }
        }
      });
      filterTodo();
    }
  }

  tabs.addEventListener('click', toggleActiveTab);
  tabs.addEventListener('keypress', toggleActiveTab);
}

const tabs = document.querySelectorAll('.nav__tab');

function defaultFilterBtns(Btns) {
  // данная функция устанавливает переключатель фильтра в положение ALL и запускает фильтр
  form.classList.remove('hide');
  Btns.forEach((elem) => {
    elem.dataset.f === 'all'
      ? elem.classList.add('nav__tab--active')
      : elem.classList.remove('nav__tab--active');
  });
  filterTodo();
}

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
    return;
  }

  // Use the ternary operator to check if `todo.done` is true
  // if so, assign 'done' to `isDone`. Otherwise, assign an empty string
  const isDone = todo.done ? 'todo--done' : '';
  const isActive = todo.done ? '' : 'todo--active';
  const isImportant = todo.important ? 'todo--important' : '';
  const btnImportantColor = todo.important ? 'btn-importance--not' : '';
  const btnImportantText = todo.important ? 'Not important' : 'Make important';
  const todoTextStyle = todo.important ? 'todo_text--important' : '';

  // Create an `li` element and assign it to `node`
  const node = document.createElement('li');

  // Set the class attribute
  node.setAttribute('class', `todo ${isActive} ${isDone} ${isImportant}`);
  node.setAttribute('tabindex', '0');

  // Set the data-key attribute to the id of the todo
  node.setAttribute('data-key', todo.id);
  // Set the contents of the `li` element created above
  node.innerHTML = `
    <div div class="todo__btns-container" tabindex="-1">
      <button type ="buttom" class="btn-importance ${btnImportantColor}" tabindex="0">${btnImportantText}</button>
      <button type ="buttom" class="btn-delete" tabindex="0" aria-label="Delete to-do"></button>
    </div>
    <span class="todo_text ${todoTextStyle}">${todo.text}</span>    
  `;

  // If the item already exists in the DOM
  if (item) {
    // replace it
    if (node.classList.contains('todo--done')) {
      node.querySelector('.btn-importance').classList.add('hide');
    }
    list.replaceChild(node, item);
  } else {
    // otherwise append it to the end of the list
    list.append(node);
  }
}

// Select the entire list
const list = document.querySelector('#todoList');

// Add a click event listener to the list and its children
function todoInteraction(event) {
  if (
    event.type === 'click' ||
    (event.type === 'keypress' && (event.key === 'Enter' || event.key === ' '))
  ) {
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
    filterTodo();
  }
}

list.addEventListener('click', todoInteraction);
list.addEventListener('keypress', todoInteraction);

// load information from LocalStarage
document.addEventListener('DOMContentLoaded', () => {
  const ref = localStorage.getItem('todoItemsRef');
  if (ref) {
    todoItems = JSON.parse(ref);
    todoItems.forEach((item) => {
      renderTodo(item);
    });
  }
});

filterTabs(navigationTabs);
defaultFilterBtns(tabs);
