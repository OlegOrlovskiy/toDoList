// filter for todo list
const filterBox = document.querySelectorAll('.todo');
const filterActiveBtn = document.querySelectorAll('.nav__tab');

document.querySelector('nav').addEventListener('click', (event) => {
  if (event.target.tagName !== 'LI') return false;
  let filterClass = event.target.dataset['f'];

  // add or remover border for Active Tab
  filterActiveBtn.forEach((elem) => {
    elem.classList.remove('active-tab');
    if (elem == event.target){
      elem.classList.add('active-tab');
    }
  });

  // show or hide to do Tasks
  filterBox.forEach((elem) => {
    elem.classList.remove('hide');
    if (!elem.classList.contains(filterClass) && filterClass !== 'all') {
      elem.classList.add('hide');
    }
  });
});