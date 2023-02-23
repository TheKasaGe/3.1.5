$(document).ready(function () {
    getPrincipal();
    getData();
});

var principal;
var allRoles;
var allUsers;

//получение principal
async function getPrincipal() {
    let jsonPrincipal = await fetch('/rest/user');

    if (jsonPrincipal.ok) {
        principal = await jsonPrincipal.json();
    } else {
        alert("Ошибка HTTP: " + jsonPrincipal.status);
    }

    fillNavbar()
}

//заполнение navbar сверху
function fillNavbar() {
    $('#principal-username').append(principal.username);
    for (let i = 0; i <= principal.roles.length - 1; i++) {
        $('#principal-roles').append(principal.roles[i].name)
        if (i != principal.roles.length - 1) {
            $('#principal-roles').append(", ");
        }
    }
}

//получение всех Users и всех ролей
async function getData() {
    let users = await fetch('/rest/users');

    if (users.ok) {
        allUsers = await users.json();
    } else {
        alert("Ошибка HTTP: " + users.status);
    }

    let roles = await fetch('/rest/roles');

    if (roles.ok) {
        allRoles = await roles.json();
    } else {
        alert("Ошибка HTTP: " + roles.status);
    }

    fillTable();
}
//заполнение таблицы Users
function fillTable() {
    $('.user-table-body').empty();

    $.each(allUsers, function (i, user) {
        $('<tr>').append(
            $('<td>').text(user.id),
            $('<td>').text(user.name),
            $('<td>').text(user.surname),
            $('<td>').text(user.age),
            $('<td>').text(user.username),
            $('<td>').text(function () {
                let userRoles = "";
                for (let i = 0; i <= user.roles.length - 1; i++) {
                    userRoles += user.roles[i].name;
                    if (i != user.roles.length - 1) {
                        userRoles += ", ";
                    }
                }
                return userRoles;
            }),
            $('<td>').append($('<button>').text("Edit").attr({
                "type": "button",
                "id": "buttonEdit",
                "class": "btn btn-info",
                "data-bs-toggle": "modal",
                "data-bs-target": "#editModal",
            }).data("user", user)),
            $('<td>').append($('<button>').text("Delete").attr({
                "type": "button",
                "id": "buttonDelete",
                "class": "btn btn-danger",
                "data-bs-toggle": "modal",
                "data-bs-target": "#deleteModal",
            }).data("user", user))
        ).appendTo('.user-table-body')
    })
}

//Заполнение модалки Edit
$(document).on('click', '#buttonEdit', function () {
    $(`#rolesToEdit`).empty()

    let user = $(this).data("user");
    $('#idToEdit').val(user.id)
    $('#nameToEdit').val(user.name)
    $('#surnameToEdit').val(user.surname)
    $('#ageToEdit').val(user.age)
    $('#usernameToEdit').val(user.username)
    $('#passwordToEdit').val(user.password)

    let selected = false;

    $.each(allRoles, function(i, role) {

        $.each(user.roles, function (i, userRole) {
            if (userRole.name === role.name)
                selected = true;
        })

        $(`#rolesToEdit`).append(
            $('<option>').text(role.name).attr({
                "id": role.id,
                "value": role.name,
                "selected": selected,
            })
        )
        selected = false;
    })
})

//запрос на изменение пользователя
$(document).on('click', '#submit-edit', async function () {
    console.log("Мы отправляем запрос на изменение");
    let roles = [];
    $('#rolesToEdit option:selected').each(function(index, value) {
        roles[index] = {
            id: value.id,
            name: value.value
        }
    });

    const user = {
        id: $('#idToEdit').val(),
        name: $('#nameToEdit').val(),
        surname: $('#surnameToEdit').val(),
        age: $('#ageToEdit').val(),
        username: $('#usernameToEdit').val(),
        password: $('#passwordToEdit').val(),
        roles: roles
    };

    try {
        const response = await fetch('/rest/update', {
            method: 'PATCH',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        $('#button-close-edit-modal').click();
        await getData();

        const json = await response.json();
        console.log('Успех:', JSON.stringify(json));
    } catch (error) {
        console.error('Ошибка:', error);
    }
})

//Заполнене модалки Delete
$(document).on('click', '#buttonDelete', function () {
    $(`#rolesToDelete`).empty()

    let user = $(this).data("user");
    $('#idToDelete').val(user.id)
    $('#nameToDelete').val(user.name)
    $('#surnameToDelete').val(user.surname)
    $('#ageToDelete').val(user.age)
    $('#usernameToDelete').val(user.username)

    $.each(user.roles, function (i, userRole) {
        $(`#rolesToDelete`).append(
            $('<option>').text(userRole.name).attr({
                "id": userRole.id,
                "value": userRole.name,
                "selected": "true",
            })
        )
    })
})

//запрос на удаление пользователя
$(document).on('click', '#submit-delete', async function () {
    console.log("Мы отправляем запрос на удаление");

    try {
        const response = await fetch('/rest/delete/'+ $('#idToDelete').val(), {
            method: 'DELETE',
        });

        $('#button-close-delete-modal').click();
        await getData();

        const json = await response.json();
        console.log('Успех:', JSON.stringify(json));
    } catch (error) {
        console.error('Ошибка:', error);
    }
})

//форма создания нового User
$(document).on('click', '#new-user-tab', function () {
    $(`#newUserRoles`).empty();
    $('#nameNewUser').empty();
    $('#surnameNewUser').empty();
    $('#ageNewUser').empty();
    $('#usernameNewUser').empty();
    $('#passwordNewUser').empty();

    $.each(allRoles, function(i, role) {
        $(`#newUserRoles`).append(
            $('<option>').text(role.name).attr({
                "id": role.id,
                "value": role.role,
            })
        )
    })
})
//запрос на добавление нового User
$(document).on('click', '#submit-add', async function () {
    console.log("Мы отправляем запрос на добавление");
    let roles = [];
    $('#newUserRoles option:selected').each(function(index, value) {
        roles[index] = {
            id: value.id,
            name: value.value
        }
    });

    const user = {
        name: $('#nameNewUser').val(),
        surname: $('#surnameNewUser').val(),
        age: $('#ageNewUser').val(),
        username: $('#usernameNewUser').val(),
        password: $('#passwordNewUser').val(),
        roles: roles
    };

    try {
        const response = await fetch('/rest/add', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        $('#users-table-tab').click();
        await getData();


        const json = await response.json();
        console.log('Успех:', JSON.stringify(json));
    } catch (error) {
        console.error('Ошибка:', error);
    }
})

//таб панель с информацией о залогиненом пользователе
$(document).on('click', '#v-pills-profile-tab', function () {
    $("#principal-tr").remove();
    $('<tr>').attr({"id": "principal-tr"})
        .append(
        $('<td>').text(principal.id),
        $('<td>').text(principal.name),
        $('<td>').text(principal.surname),
        $('<td>').text(principal.age),
        $('<td>').text(principal.username),
        $('<td>').text((principal.roles).map(role => role.name).join(', ')),
    ).appendTo('.principal-table-body');
})