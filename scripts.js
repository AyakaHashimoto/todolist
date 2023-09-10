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
    try {
        const todos = document.querySelectorAll('#todoList li');
    
        todos.forEach(todo => {
            const todoLabel = todo.querySelector('.todo-label').textContent.trim();
    
            if (label === "すべて" || todoLabel === label) {
                todo.style.display = "";
            } else {
                todo.style.display = "none";
            }
        });
    } catch (e) {
        console.error("ラベルでのフィルターエラー:", e);
    }
}

function addToDo(text, label = '', detail = '') {
    try {
        const ul = document.getElementById('todoList');
        const li = document.createElement('li');
        const textNode = document.createTextNode(text);
        const labelSpan = document.createElement('span');
        const labelText = document.createTextNode(label);
        const complatedBtn = document.createElement('button');
        const editBtn = document.createElement('button');
        const deleteBtn = document.createElement('button');
        // 詳細を保存するデータ属性
        li.setAttribute('data-detail', detail);
    
        // テキストとラベルのグループのためのdiv
        const textGroup = document.createElement('div');
        textGroup.className = 'text-group';
        textGroup.appendChild(textNode);
        textGroup.appendChild(labelSpan);
    
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
        editBtn.textContent = '詳細';
        editBtn.onclick = function() {
          showEditArea(li, textNode, labelSpan);
        };
        deleteBtn.textContent = '削除';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = function() {
            checkAndRemoveLabelIfNeeded(label);
            ul.removeChild(li);
            saveToLocalStorage();
        }
    
        labelSpan.className = 'todo-label';
        if(!label.trim()) { // ラベルが空の場合
            console.log('!label.trim()=== true')
            labelSpan.classList.add('empty-label');
        }
        labelSpan.appendChild(labelText);
        
        li.appendChild(textGroup);
        li.appendChild(btnGroup);
        ul.appendChild(li);
    } catch (e) {
        console.error("Todo追加エラー:", e);
    }
}

function showEditArea(li, textNode, labelSpan) {
    try {
        document.getElementById('editArea').style.display = 'block';
        document.getElementById('editText').value = textNode.nodeValue;
        document.getElementById('editLabel').value = labelSpan.textContent;
        document.getElementById('detail').value = li.getAttribute('data-detail');
    
        document.getElementById('saveEdit').onclick = function() {
            textNode.nodeValue = document.getElementById('editText').value;
            labelSpan.textContent = document.getElementById('editLabel').value;
            li.setAttribute('data-detail', document.getElementById('detail').value);
    
            labelSpan.className = 'todo-label';
            if(!labelSpan.textContent.trim()) { // ラベルが空の場合
                console.log('!label.trim()=== true in showEditArea')
                labelSpan.classList.add('empty-label');
            }
    
            const newLabel = document.getElementById('editLabel').value;
            addLabelToDropdown(newLabel);        
            
            document.getElementById('editArea').style.display = 'none';
            saveToLocalStorage();
        }
        document.getElementById('cancelEdit').onclick = function() {
            document.getElementById('editArea').style.display = 'none';
        }   
    } catch (e) {
        console.error("編集エリア表示エラー:", e);
    }
}

function addLabelToDropdown(label) {
    try {
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
    } catch (e) {
        console.error("ドロップダウンへのラベル追加エラー:", e);
    }
}

function removeLabelFromDropdown(label) {
    try {
        const dropdown = document.getElementById('filterLabels');
        const optionToRemove = [...dropdown.options].find(option => option.value === label);
    
        if (optionToRemove) {
            dropdown.removeChild(optionToRemove);
        }
        saveLabelsToLocalStorage()
    } catch (e) {
        console.error("ドロップダウンからのラベル削除エラー:", e);
    }
}

function checkAndRemoveLabel() {
    try {
        const todos = document.querySelectorAll('#todoList li');
        const allLabels = [...todos].map(todo => todo.querySelector('.todo-label').textContent.trim());
        const dropdownLabels = [...document.getElementById('filterLabels').options].map(option => option.value).slice(1); // "すべて"を除外
    
        dropdownLabels.forEach(dropdownLabel => {
            if (!allLabels.includes(dropdownLabel)) {
                removeLabelFromDropdown(dropdownLabel);
            }
        });
        saveLabelsToLocalStorage()
    } catch (e) {
        console.error("ラベル削除時チェックエラー:", e);
    }
}

function checkAndRemoveLabelIfNeeded(label) {
    try {
        const todos = document.querySelectorAll('#todoList li');
    
        // 全てのTodoから指定されたラベルを検索し、該当するラベルの数をカウントする
        const labelCount = [...todos].filter(todo => todo.querySelector('.todo-label').textContent.trim() === label).length;
    
        if (labelCount === 1) {
            removeLabelFromDropdown(label);
        }
    } catch (e) {
        console.error("ラベル削除時の重複確認エラー:", e);
    }
}

function saveToLocalStorage() {
    try {
        const ul = document.getElementById('todoList');
        const todos = [];
    
        for (let i = 0; i < ul.children.length; i++) {
            let taskText = ul.children[i].querySelector('.text-group').firstChild.textContent;
            let taskLabel = ul.children[i].querySelector('.todo-label').textContent;        
    
            todos.push({
                text: taskText,
                label: taskLabel,
                detail: ul.children[i].getAttribute('data-detail'),
                completed: ul.children[i].classList.contains('completed')
            });
        }
    
        localStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
        console.error("Localstrageへの保存エラー:", error);
    }
}

function loadFromLocalStorage() {
    try {
        const todos = JSON.parse(localStorage.getItem('todos'));
    
        if (todos) {
            todos.forEach(function(todo) {
                addToDo(todo.text, todo.label, todo.detail);
                if (todo.completed) {
                    document.getElementById('todoList').lastChild.classList.add('completed');
                }
            });
        }
    } catch (error) {
        console.error("Localstrageからの読み込みエラー:", error);
    }
}

function saveLabelsToLocalStorage() {
    try {
        const dropdown = document.getElementById('filterLabels');
        const labels = [...dropdown.options].map(option => option.value);
    
        // "すべて" は除外する
        const filteredLabels = labels.filter(label => label !== "すべて");
    
        localStorage.setItem('labels', JSON.stringify(filteredLabels));
    } catch (error) {
        console.error("Localstrageへのラベル保存エラー:", error);
    }
}

function loadLabelsFromLocalStorage() {
    try {
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
    } catch (error) {
        console.error("Localstrageからのラベル読み込みエラー:", error);
    }
}

loadFromLocalStorage();
loadLabelsFromLocalStorage();