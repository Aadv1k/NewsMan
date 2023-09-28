# @newsman/server

this module acts as the API which can be used to access the core service

## API Structure

We will be opting for a simple JWT based auth system, for it's simplicity 

### `POST /v1/users/login` 

issues a new JWT associated with the user, returns error blob otherwise

#### Request

```js
{
  email: "hi@example.org",
  password: "areasonablystrongpassword@123"
}
```

#### Response 

```js
{
  status: "success",
  data: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  },
  message: "Successfully logged the user in"
}
```

### `POST /v1/users/register` 

create a new user, fails if email-in-use, returns a JWT token associated with the users id and email, exp of a day

#### Request

```js
{
  email: "hi@example.org",
  password: "areasonablystrongpassword@123"
}
```

#### Response 

```js
{
  status: "success",
  data: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  },
  message: "Successfully registed the user"
}
```

### `DELETE /v1/users`

Deletes a user if they have registed, given they have the JWT, and the right password

#### Request

- Authorization: `Bearer <token>`

```js
{
  password: "foo@123",
}
```

#### Response

```js
{
  status: "success",
  data: {
    user: {
      email: "hi@example.org"
    }
  }
  message: "Successfully deleted the user"
}
```


### `POST /v1/key`

Will issue a new API key for a user, if a key exists it will simply cycle it (and invalidate the previous one)

- Authentication: `Bearer <token>`

#### Request

```js
<empty>
```

#### Response 

```js
{
  status: "success",
  data: {
    key: "Ggp5EA8ytRHirLPe4LFexNIA8HAM56Hc
"
  },
  message: "Successfully (cycled | issued) the key"
}
```

### `DELETE /v1/key`

Keep in mind there can only be one key at a time, and hence deleting it will invalidate all of they keys in circulation


### `GET  /v1/headlines?apiKey=your-api-key `

#### Query 

- apiKey (required): the required api key 
- country: 2-letter ISO code for the country
- sources: list of comma sepearated domains to get the news from 
- q: phrase to include in the title/description field of the news 
- pageSize: a numerical value of amount of news articles (lesser may mean faster)

#### Response

```
{
  status: "success",
  data: {
    totalResults: 5,
    articles: [...]
  },
  message; "Fetched the latest headlines"
}
```



### `GET /v1/everything?apiKey=your-api-key `

same as the previous field
