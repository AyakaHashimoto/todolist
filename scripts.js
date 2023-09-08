document.getElementById('addTodo').addEventListener('click', function() {
    const value = document.getElementById('todoInput').value;
    if (value) {
        addToDo(value);
        document.getElementById('todoInput').value = '';
        saveToLocalStorage();
    }
});

document.getElementById('filterLabels').addEventListener('change', function() {
    const selectedLabel = this.value;

    filterTodosByLabel(selectedLabel);
});

function filterTodosByLabel(label) {
    const todos = document.querySelectorAll('#todoList li');

    todos.forEach(todo => {
        const todoLabel = todo.querySelector('.todo-label').textContent.trim();

        if (label === "all" || todoLabel === label) {
            todo.style.display = "";
        } else {
            todo.style.display = "none";
        }
    });
}

function addToDo(text, label = '') {
    const ul = document.getElementById('todoList');
    const li = document.createElement('li');
    const complatedBtn = document.createElement('button');
    const textNode = document.createTextNode(text);
    const editBtn = document.createElement('button');
    const deleteBtn = document.createElement('button');
    const labelSpan = document.createElement('span');
    const labelText = document.createTextNode(label);

    complatedBtn.textContent = '完了';
    complatedBtn.onclick = function() {
        li.classList.toggle('completed');
        saveToLocalStorage();
    };
    editBtn.textContent = '編集';
    editBtn.onclick = function() {
      showEditArea(li, textNode, labelSpan);
    };
    deleteBtn.textContent = '削除';
    deleteBtn.onclick = function() {
        ul.removeChild(li);
        saveToLocalStorage();
    }

    labelSpan.className = 'todo-label';
    if(!label.trim()) { // ラベルが空の場合
        console.log('!label.trim()=== true')
        labelSpan.classList.add('empty-label');
    }
    labelSpan.appendChild(labelText);
    
    li.appendChild(textNode);
    li.appendChild(labelSpan);
    ul.appendChild(li);
    li.appendChild(complatedBtn);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
}

function showEditArea(li, textNode, labelSpan) {
    document.getElementById('editArea').style.display = 'block';
    document.getElementById('editText').value = textNode.nodeValue;
    document.getElementById('editLabels').value = labelSpan.textContent;

    document.getElementById('saveEdit').onclick = function() {
        textNode.nodeValue = document.getElementById('editText').value;
        labelSpan.textContent = document.getElementById('editLabels').value;

        labelSpan.className = 'todo-label';
        if(!labelSpan.textContent.trim()) { // ラベルが空の場合
            console.log('!label.trim()=== true in showEditArea')
            labelSpan.classList.add('empty-label');
        }

        document.getElementById('editArea').style.display = 'none';
        saveToLocalStorage();
    }
    document.getElementById('cancelEdit').onclick = function() {
        document.getElementById('editArea').style.display = 'none';
    }   
  }

  

function saveToLocalStorage() {
    const ul = document.getElementById('todoList');
    const todos = [];

    for (let i = 0; i < ul.children.length; i++) {
        let taskText = ul.children[i].firstChild.nodeValue;
        let taskLabel = ul.children[i].querySelector('.todo-label').textContent;

        todos.push({
            text: taskText,
            label: taskLabel,
            completed: ul.children[i].classList.contains('completed')
        });
    }

    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadFromLocalStorage() {
    const todos = JSON.parse(localStorage.getItem('todos'));

    if (todos) {
        todos.forEach(function(todo) {
            addToDo(todo.text, todo.label);
            if (todo.completed) {
                document.getElementById('todoList').lastChild.classList.add('completed');
            }
        });
    }
}

loadFromLocalStorage();
