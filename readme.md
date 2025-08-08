
A. Authentication

1. Register
    incoming data ==> username, email, password
    validate / check data => email valid, compulsary data aaunu paryo
    db query ==> table ma insert/read/update/delete

2. login
3. logout
4. forget password
5. reset password

1. Registers a new user:
    a. Expects: { username, email, password } in req.body
    b. Validates required fields.
    c. Checks for existing user with the same email.
    d. Creates a new user in the database.
    e. Returns success or error response.

2. Logs in a user.
    a. Expects: { email, password } in req.body
    b. Validates required fields (if password or email is in correct format or not).
    c. Verify if user exists with the given email.
    d. Verify the password.
    e. Returns success or error response.

    Types of login:
        a. email/username and password = Basic login
        b. google,fb and github login = OAuth login
        c. email only login  SSO login


genereateRandomNumber:
    Math.random()
    Generates a random floating-point number between 0 (inclusive) and 1 (exclusive) — e.g., 0.34567.

    Math.random() * 90000
    Scales the random number to a range between 0 and 89999.999....

    10000 + Math.random() * 90000
    Shifts the range to ensure the result is between 10000 and 99999.999....

    Math.floor(...)
    Rounds the value down to the nearest integer, resulting in a final 5-digit number between 10000 and 99999.





