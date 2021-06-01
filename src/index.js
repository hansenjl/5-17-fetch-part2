document.addEventListener('DOMContentLoaded', () => {
    fetchTodos()
    document.querySelector('#new-todo').addEventListener('submit',addTodo)
})

function fetchTodos(){
    fetch("http://localhost:3000/todos")
    .then(res => res.json())
    .then(data => {
        if(data.length){
            addTodosToDOM(data)
        }
    })
}

function addTodosToDOM(data){
    const todoContainer = document.querySelector('#todos-container')
    todoContainer.innerHTML = ""
    data.forEach(todo => {
        todoContainer.append(createNewTodo(todo))
    });
}

function createNewTodo(todo){
    const newDiv = document.createElement('div')
    newDiv.classList.add("todo-card")
    newDiv.id = todo.id
    

    newDiv.innerHTML = `
        <div class="todo-frame">
            <h1 class="center-text">${todo.content}</h1>
            <button data-id="${todo.id}">Delete</button>
        </div>
    `
    newDiv.querySelector('button').addEventListener('click', (e) => deleteTodo(newDiv))
    return newDiv
}

function deleteTodo(newDiv){
    fetch(`http://localhost:3000/todos/${newDiv.id}`, {
        method: "DELETE",
    })
    .then(res => res.json())
    .then(data => {
        newDiv.remove()
    })

}

function addTodo(event){
   event.preventDefault() 
   const todo = {
       content: document.querySelector('#content').value
   }

   fetch("http://localhost:3000/todos", {
       method: "POST",
       headers: {
           'Content-Type': 'application/json',
           'Accept': 'application/json'
       },
       body: JSON.stringify(todo)
   })
   .then(res => res.json())
   .then(data => {
    
       const todoContainer = document.querySelector('#todos-container')
       todoContainer.append(createNewTodo(data))
   })
   document.querySelector('#new-todo').reset()

}