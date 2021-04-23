### Create user

- /users [POST]
- Body

```json
  "email": "string",
  "password": "string"
```

- Return

```
 the created user
```

- Side effects
  - Sends an email to the user verify their account

### Verify user

- /users/verify/:userId [POST]
- Body

```json
none
```

- Return

```
 the verified user
```

- Side effects
  - none

### Login

- /sessions [POST]
- Body

```json
  "email": "string",
  "password": "string"
```

- Return

```
the login token and the user info
```

- Side effects
  - none

### For all the below password routes you must send the login token as a bearer token on the request header, and the user MUST be verified

### Create password

- /passwords [POST]
- Body

```json
  "title": "string",
  "value": "string"
```

- Return

```
 the created password
```

- Side effects
  - none

### Get all password

- /passwords [GET]
- Body

```json
none
```

- Return

```
 all the user passwords (with their values encrypted)
```

- Side effects
  - none

### Get single password

- /passwords/:passwordId [GET]
- Body

```json
none
```

- Return

```
 the decrypted password
```

- Side effects
  - none
