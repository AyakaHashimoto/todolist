document.getElementById('addTodo').addEventListener('click', function() {
    const value = document.getElementById('todoInput').value;
    if (value) {
        addToDo(value);
        document.getElementById('todoInput').value = '';
        saveToLocalStorage();
    }
});

document.getElementById('todoList').addEventListener('click', function(event) {
    if (event.target.tagName === 'LI' && event.target.nodeName !== 'BUTTON') {
        const li = event.target;
        const textNode = li.childNodes[0];
        console.log("textNode,", textNode);

        const input = document.createElement('input');
        const complatedBtn = document.createElement('button');    

        input.type = 'text';
        input.value = textNode.nodeValue;
        li.appendChild(input);

        input.focus();
        input.select();

        // Enterキーが押されたときのハンドラ
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                textNode.nodeValue = e.target.value;
                complatedBtn.textContent = '完了';
                complatedBtn.onclick = function() { // ボタンがクリックされたときの動作
                    li.classList.toggle('completed');
                    saveToLocalStorage();
                };
                input.removeEventListener('blur', handleBlur);
                input.remove();
                saveToLocalStorage(); 
            }
        });

        // inputからフォーカスが外れたときのハンドラ
        input.addEventListener('blur', handleBlur);

        function handleBlur() {
            textNode.nodeValue = input.value;
            complatedBtn.textContent = '完了';
            complatedBtn.onclick = function() { 
                li.classList.toggle('completed');
                saveToLocalStorage();
            };
            input.remove();
            saveToLocalStorage();
        }
    }
});

function addToDo(text) {
    const ul = document.getElementById('todoList');
    const li = document.createElement('li');
    const complatedBtn = document.createElement('button');
    const textNode = document.createTextNode(text);

    complatedBtn.textContent = '完了';
    complatedBtn.onclick = function() {
        li.classList.toggle('completed');
        saveToLocalStorage();
    };
    li.appendChild(textNode);
    ul.appendChild(li);
    li.appendChild(complatedBtn);
}


function saveToLocalStorage() {
    const ul = document.getElementById('todoList');
    const todos = [];

    for (let i = 0; i < ul.children.length; i++) {
        let taskText = ul.children[i].firstChild.nodeValue;
        todos.push({
            text: taskText,
            completed: ul.children[i].classList.contains('completed')
        });
    }

    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadFromLocalStorage() {
    const todos = JSON.parse(localStorage.getItem('todos'));

    if (todos) {
        todos.forEach(function(todo) {
            addToDo(todo.text);
            if (todo.completed) {
                document.getElementById('todoList').lastChild.classList.add('completed');
            }
        });
    }
}

loadFromLocalStorage();
