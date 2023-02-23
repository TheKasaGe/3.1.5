// заполнение таблицы User
async function getResponse() {
    let res = await fetch('/rest/user')
    let content = await res.json()


    let list = document.querySelector('.user-info-table-body')
    let roles = "";
    for (let role in content.roles) {
        roles += `${content.roles[role].name} `
    }

    list.innerHTML += `
        <td>${content.id}</td>
        <td>${content.name}</td>
        <td>${content.surname}</td>
        <td>${content.age}</td>
        <td>${content.username}</td>
        <td>${roles}</td>
`
}

getResponse();