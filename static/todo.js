function addItem(e) {
    if (e.which == 13 || e.keyCode == 13) {
        let item = $('.new-todo');
        $.ajax({
            url: '/add-todo',
            data: JSON.stringify({
                'task': item.val()
            }),
            contentType: "application/json",
            type: 'POST',
            success: function (task) {
                appendToList(task);
                item.val("");

            },
            error: function (error) {
                console.log(error);
            }
        });
    }
}


function removeItem(id) {
    $.ajax({
        url: `/remove-todo/${id}`,
        type: 'POST',
        success: function (response) {
            $(`#${id}`).remove();
        },
        error: function (error) {
            console.log(error);
        }
    });
}

// function that makes API call to update an item 
// toggles the state of the item between complete and
// incomplete states
function toggleComplete(elem) {
    $.ajax({
        url: `/update-todo/${elem.attr('data-id')}`,
        type: 'POST',
        success: function (data) {
            elem.toggleClass('completed')
        },
        error: function (error) {
            console.log(error);
        }
    });
}

// function that makes API call to update an item 
// toggles the state of the item between complete and
// incomplete states
function editItem(id) {
    let item = $(`#${id}`);
    $.ajax({
        url: `/edit-todo/${id}`,
        data: JSON.stringify({
            'task': item.find('label').text()
        }),
        contentType: "application/json",
        type: 'POST',
        success: function (data) {
        },
        error: function (error) {
            console.log(error);
        }
    });
}

// helper function to append new ToDo item to current ToDo list
function appendToList(data) {
    let html = taskHTML(data);
    let list = $(".todo-list");
    list.append(html);
    list.children(`#${data.id}`).find('label')
        .keypress(function (evt) {
            var keycode = evt.charCode || evt.keyCode;
            if (keycode  == 13) {
                editItem(data.id);
                $(this).blur()
                return false;
            }
    });
};// <button class="edit" onclick="editItem('${data.id}')"></button>


function taskHTML(data){
    return `
    <li id="${data.id}">
        <div class="view">
            <input class="toggle" type="checkbox" onclick="toggleComplete($(this))" 
                data-completed="${data.complete}" data-id="${data.id}">
            <label contenteditable="true">${data.task}</label>
            
            <button class="destroy" onclick="removeItem('${data.id}')"></button>
        </div>
    </li>`
};
