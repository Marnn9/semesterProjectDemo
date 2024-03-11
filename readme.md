# GET / 
> -> Returns current authenticated user object. If no authenticated user, returns 403 Not authorized.

**"/"** <br>
METHOD: GET <br>
Expects: JSON <br>
Returns: JSON <br>
Requires: Authentication <br>

Creates a user, required fields: *{name,password,email}*

## POST /users 
> -> Adds a new user to the user/users endpoint. if a user with the given email exists it returns 422 Unprocessable Content. Also if one of the data fields is missing it returns 400

**"/users"**
METHOD: POST
Expects: JSON
Returns: JSON

Creates a user, required fields: *{name, email, password}*, password is encrypted when recieved. 
Response : msg: " new user created" if successful.

## POST /login 
> -> returns 401 Unautorised if the email or password does not exist in the database

**"/login"**
METHOD: POST
Expects: JSON
Returns: JSON

Checks if the input email exists in the database, if it does it validates the password by checking if the paswordhash in the database for the user with the given email is the same as the paswordhash inputted in the client. 

Required fields {email, password}.
Response is {id, email, name, paswHash, avatar: {avatarId, hairColor, eyeColor, skinColor, eyeBrowType}}
