var s = new XMLHttpRequest()
s.open('post','/register', true)

s.onreadystatechange = () => {
    console.log(s.responseText)
}
s.setRequestHeader("Content-Type", "application/json")

s.send(JSON.stringify({
    username: 'antonio',
    password: 'francesco',
    email: 'antonio@gmail.com'
}))