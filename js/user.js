import Search from "./search.js"
const search = Search()

export default function User(){

    function render(user){
        fetch('user.html')
            .then(resp => resp.text())
            .then(html => content.innerHTML = html)
            .then(complete => initialize(user))
    }

    async function initialize(user){
        const elementsHtml = {
            content: document.getElementById('content'),
            divUser: document.querySelector('.user'),
            arrow: document.querySelector('#arrowForHome'),
            title: document.querySelector('#titleUser'),
            image: document.querySelector('#imgUser'),
            linkOnImage: document.querySelector('.profile > a'),
            login: document.querySelector('#userLogin'),
            local: document.querySelector('#local'),
            work: document.querySelector('#work'),
            followers: document.querySelector('#followers'),
            followings: document.querySelector('#followings'),
            stars: document.querySelector('#stars'),
            totalRepositories: document.querySelector('#total-repositories'),
            linkTotalRepositories: document.querySelector('.repositories-total > a'),
            repositories: document.querySelector('.repositories')

        }
        const loader = document.createElement('div')
        loader.setAttribute('class', 'loader')
        elementsHtml.content.appendChild(loader)
        elementsHtml.divUser.setAttribute('class', 'sr-only')

        elementsHtml.arrow.addEventListener('click', e => returnHome(e, elementsHtml.content))

        //Setando os valores do usuário
        elementsHtml.image.setAttribute('src', user.avatar_url)
        elementsHtml.linkOnImage.setAttribute('href', user.html_url)
        elementsHtml.title.innerHTML = user.name
        elementsHtml.login.innerHTML = `${user.twitter_username ? '@' + user.twitter_username : ''}`
        elementsHtml.local.innerHTML += user.location || ''
        elementsHtml.work.innerHTML += user.company || ''
        elementsHtml.followers.innerHTML += user.followers
        elementsHtml.followings.innerHTML += user.following
        elementsHtml.stars.innerHTML += await getTotalStars(user.login)
        
        elementsHtml.totalRepositories.innerHTML += user.public_repos
        elementsHtml.linkTotalRepositories.setAttribute('href', `https://github.com/${user.login}?tab=repositories`)

        //setar os repositórios
        const allRepositories = await getAllRepositories(user.login)
        const repositoriesReduced = allRepositories.map(repository => {
            return {
                title: repository.name,
                description: repository.description || 'Sem descrição',
                forks: repository.forks_count,
                stars: repository.stargazers_count,
                language: repository.language || '',
                url: repository.html_url
            }
        })

        repositoriesReduced.forEach(repository => {
            elementsHtml.repositories.innerHTML += `
            <div class="card-repository">
                <a href='${repository.url}' target="_blank">
                    <h3>${repository.title}</h3>
                    <p>${repository.description}</p>
                    <div class="infos">
                        <span id="starsRepository">
                            <img src="./assets/star.svg" alt="Estrelas">
                            ${repository.stars}
                        </span>
                        <span id="commitsRepository">
                            <img src="./assets/fork.svg" alt="Commits">
                            ${repository.forks}
                        </span>
                        <span id="language">
                            <img src="./assets/code.svg" alt="Linguagem">
                            ${repository.language}
                        </span>
                    </div>
                </a>
            </div>
            `
        })

        elementsHtml.divUser.setAttribute('class', 'user')
        loader.setAttribute('class', 'hidden')
    }

    function returnHome(event, content){
        event.preventDefault()
        search.render(content)
    }

    async function getTotalStars(user){
        const url = `https://api.github.com/users/${user}/starred`
        const totalStars = await fetch(url)
            .then(resp => resp.text())
            .then(text => JSON.parse(text))
            .then(json => json.length)
        
        return totalStars
    }

    async function getAllRepositories(user){
        const url = `https://api.github.com/users/${user}/repos`
        const allRepositories = await fetch(url)
            .then(resp => resp.text())
            .then(text => JSON.parse(text))
        return allRepositories
    }

    return {
        render
    }
}