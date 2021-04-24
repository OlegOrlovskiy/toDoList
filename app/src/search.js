document.querySelector('#toDoSearch').oninput = function () {
  let val = this.value.trim().toLowerCase();
  let tasks = document.querySelectorAll('.todo span');
  if (val != '') {
    tasks.forEach(function (elem){
      if (elem.innerText.toLowerCase().search(val) == -1) {
        elem.parentElement.classList.add('hide');
        elem.innerHTML = elem.innerText;
      } else {
        elem.parentElement.classList.remove('hide');
      }
    });
  } else {
    tasks.forEach(function (elem) {
      elem.parentElement.classList.remove('hide');
      elem.innerHTML = elem.innerText;
    });
  }
}