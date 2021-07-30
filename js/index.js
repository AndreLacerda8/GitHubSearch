import Search from './search.js'
import User from './user.js'
const search = Search()
const user = User()

const content = document.getElementById('content')

search.render(content)