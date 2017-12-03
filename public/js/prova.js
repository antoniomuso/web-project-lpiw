var s = new XMLHttpRequest()
s.open('post','/rooms/message', true)

s.onreadystatechange = () => {
    console.log(s.responseText)
}
s.setRequestHeader("Content-Type", "application/json")

s.send(JSON.stringify({ ist: 'provprovap', hours:30}))