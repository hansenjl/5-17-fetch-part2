const BASE_URL = "http://localhost:3000/todos/"

const form = () =>  document.getElementById('new-todo')


document.addEventListener('DOMContentLoaded', () => {
    // kick things off and setup event listeners
    fetchTodos()
    document.getElementById('new-todo').addEventListener('submit', submitTodoForm)
})

function fetchTodos(){
    fetch(BASE_URL)
    .then(res => res.json())
    .then(data => {
        if(data.length > 0){
            displayTodos(data)
        }
    })
}

function displayTodos(data){
    const container = document.querySelector('#todos-container')
    container.innerHTML = ""
    data.forEach(todo => {
        const newElement = createNewElement(todo)
       container.append(newElement)
    })
}

function createNewElement(todo){
    const newDiv = document.createElement('div')
    newDiv.id = todo.id 
    newDiv.classList.add('todo-card')
    newDiv.innerHTML = `
       <div class="todo-frame">
            <h1>${todo.content} </h1>
            <button  class="todo-button delete">Delete</button>
            <button  class="todo-button edit">Edit</button>
       </div>
    `

    newDiv.querySelector('button.delete').addEventListener('click', () => deleteTodo(newDiv))
    newDiv.querySelector('button.edit').addEventListener('click', (e) => editTodo(e,newDiv))
    
    return newDiv

    // nothing will run down here
}

function editTodo(e, newDiv){
    //  make the edit button say 'save'
    if(e.target.textContent === 'Edit'){
        e.target.textContent = 'Save'
        const h1 =  newDiv.querySelector('h1')
        h1.outerHTML = `<input type="text" value="${h1.textContent}"></input>`
    } else if(e.target.textContent === 'Save'){
        e.target.textContent = 'Edit' 
        // send a PATCH request 
        // update the DOM
        const input =  newDiv.querySelector('input')
        fetch(BASE_URL + newDiv.id, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({content: input.value}),
        })
        .then((r) => r.json())
        .then((todoObj) => {
           input.outerHTML = `<h1>${todoObj.content} </h1>`
        });
    }
   
}

function deleteTodo(newTodo){
    fetch(BASE_URL + newTodo.id, {
        method: "DELETE",
    })
   .then((r) => r.json())
   .then(() =>  newTodo.remove());
  
}

// handles the submit of the new todo form
function submitTodoForm(e){
    e.preventDefault()
    const data = {
        "content": document.getElementById('content').value
    };

    fetch(BASE_URL, {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        // data is the todo object 
        const newElement = createNewElement(data)
        document.querySelector('#todos-container').append(newElement)
        document.getElementById('new-todo').reset()
    })
    .catch((error) => {
        console.error('Error:', error);
    });

}