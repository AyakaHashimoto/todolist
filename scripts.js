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

        if (label === "すべて" || todoLabel === label) {
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

    // ボタンのグループのためのdiv
    const btnGroup = document.createElement('div');
    btnGroup.className = 'btn-group';

    btnGroup.appendChild(complatedBtn);
    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);

    complatedBtn.textContent = '完了'
    complatedBtn.className = 'complete-btn';
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
    li.appendChild(btnGroup);
    ul.appendChild(li);
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

        const newLabel = document.getElementById('editLabels').value;
        addLabelToDropdown(newLabel);

        document.getElementById('editArea').style.display = 'none';
        saveToLocalStorage();
    }
    document.getElementById('cancelEdit').onclick = function() {
        document.getElementById('editArea').style.display = 'none';
    }   
  }

function addLabelToDropdown(label) {
    const dropdown = document.getElementById('filterLabels');

    // ラベルの存在確認
    const existingOption = [...dropdown.options].some(option => option.value === label);
    if(!existingOption) {
        const option = document.createElement('option');
        option.value = label;
        option.textContent = label;
        dropdown.appendChild(option);
    }
    saveLabelsToLocalStorage()
}

function removeLabelFromDropdown(label) {
    const dropdown = document.getElementById('filterLabels');
    const optionToRemove = [...dropdown.options].find(option => option.value === label);

    if (optionToRemove) {
        dropdown.removeChild(optionToRemove);
    }
    saveLabelsToLocalStorage()
}

function checkAndRemoveLabel() {
    const todos = document.querySelectorAll('#todoList li');
    const allLabels = [...todos].map(todo => todo.querySelector('.todo-label').textContent.trim());
    const dropdownLabels = [...document.getElementById('filterLabels').options].map(option => option.value).slice(1); // "すべて"を除外

    dropdownLabels.forEach(dropdownLabel => {
        if (!allLabels.includes(dropdownLabel)) {
            removeLabelFromDropdown(dropdownLabel);
        }
    });
    saveLabelsToLocalStorage()
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

function saveLabelsToLocalStorage() {
    const dropdown = document.getElementById('filterLabels');
    const labels = [...dropdown.options].map(option => option.value);

    // "すべて" は除外する
    const filteredLabels = labels.filter(label => label !== "すべて");

    localStorage.setItem('labels', JSON.stringify(filteredLabels));
}

function loadLabelsFromLocalStorage() {
    const savedLabels = JSON.parse(localStorage.getItem('labels'));
    if (savedLabels && savedLabels.length > 0) {
        const dropdown = document.getElementById('filterLabels');
        
        savedLabels.forEach(label => {
            const option = document.createElement('option');
            option.value = label;
            option.textContent = label;
            dropdown.appendChild(option);
        });
    }
}

loadFromLocalStorage();
loadLabelsFromLocalStorage();