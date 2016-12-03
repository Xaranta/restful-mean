//this is not a great example since we are using global variables too much


// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();
    
    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Add User button click
    $('#btnAddUser').on('click', addUser);
    
    $('#btnUpdateUser').on('click', updateUser);
    
    // Delete User link click
    //Note the syntax we're using: when working with jQuery's ‘on' method, in order to capture dynamically inserted links, you need to reference a static element on the page first. That's why our selector is the table's tbody element – which remains constant regardless of adding or removing users – and then we're specifying the specific links we're trying to catch in the .on parameters.
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {
        
        //this is quick and dirty. In production it isn't a good idea to grab all the data like this
        //ideally, you should implement paging and only load the users that are needed.
        // Stick our user data array into a userlist variable in the global object
        userListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};


// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);
    
    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);
    
    
    //Set the update form's values to the User info
    
    document.update.updateUserName.value = thisUserObject.username;
    document.update.updateUserEmail.value = thisUserObject.email;
    document.update.updateUserFullName.value = thisUserObject.fullname;
    document.update.updateUserAge.value = thisUserObject.age;
    document.update.updateUserLocation.value = thisUserObject.location;
    document.update.updateUserGender.value = thisUserObject.gender;
    document.update.btnUpdateUser.value = thisUserObject._id;

    
};


// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'username': $('#addUser form input#inputUserName').val(),
            'email': $('#addUser form input#inputUserEmail').val(),
            'fullname': $('#addUser form input#inputUserFullname').val(),
            'age': $('#addUser form input#inputUserAge').val(),
            'location': $('#addUser form input#inputUserLocation').val(),
            'gender': $('#addUser form input#inputUserGender').val()
        }

        console.log(JSON.stringify(newUser));
        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addUser form input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete User
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};


// Updating User
function updateUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#updateUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        
        var updatedUser = {
            'username': $('#userInfo form input#updateUserName').val(),
            'email': $('#userInfo form input#updateUserEmail').val(),
            'fullname': $('#userInfo form input#updateUserFullName').val(),
            'age': $('#userInfo form input#updateUserAge').val(),
            'location': $('#userInfo form input#updateUserLocation').val(),
            'gender': $('#userInfo form input#updateUserGender').val()
        }
        
        console.log(JSON.stringify(updatedUser));
        /* old one
        var updatedUser = {
            'username': $('#updateUser fieldset input#inputUserName').val(),
            'email': $('#updateUser fieldset input#inputUserEmail').val(),
            'fullname': $('#updateUser fieldset input#inputUserFullname').val(),
            'age': $('#updateUser fieldset input#inputUserAge').val(),
            'location': $('#updateUser fieldset input#inputUserLocation').val(),
            'gender': $('#updateUser fieldset input#inputUserGender').val()
        }
        */

        console.log('/users/updateuser/' + $(this).attr('value'));
        // Use AJAX to post the object to our updateUser service
        $.ajax({
            type: 'PUT',
            data: updatedUser,
            url: '/users/updateuser/' + $(this).attr('value'),
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#updateUser form input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};