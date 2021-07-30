import User from './user.js'
const user = User()

export default function Search(){
    function render(content){
        fetch('search.html')
            .then(resp => resp.text())
            .then(html => content.innerHTML = html)
            .then(complete => document.querySelector('button.button-search').addEventListener('click', e => checkExistsUser(e, content)))
    }
    
    function checkExistsUser(event, content){
        event.preventDefault()
        const userName = document.getElementById('username').value
        content.innerHTML = `<div class='loader'></div>`
    
    
        fetch(`https://api.github.com/users/${userName}`)
            .then(resp => resp.text()) //pega todas as informações do usuário
            .then(resp => JSON.parse(resp)) //transforma as informações em Json
            .then(resp => resp.message === 'Not Found' ? alert('Usuário inválido') : loadUser(resp)) //verifica se existe
    }
    
    function loadUser(currentUser){
        user.render(currentUser)
    }

    return {
        render,
        checkExistsUser
    }
}
