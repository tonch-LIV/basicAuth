# basicAuth
401 /// module_2 /// lab_06 /// authentication

## UML

```mermaid
flowchart TD
    A[HTTP REST Client] -->|POST /signup<br/>JSON or form data| B[Express Application]
    A -->|POST /signin<br/>Basic Auth header| B

    B --> C[Authentication Router]

    C -->|/signup| D[Signup Route]
    D --> E[Users Sequelize Model]
    E --> F[beforeCreate Hook]
    F -->|bcrypt.hash password| G[(PostgreSQL Database)]
    G --> H[201 Created + User Record]
    H --> A

    C -->|/signin| I[Basic Auth Middleware]
    I -->|Find username| E
    E --> J[Authenticate User Method]
    J -->|bcrypt.compare password| I
    I -->|Attach valid user to request| K[Signin Route]
    K --> L[200 OK + User Record]
    L --> A

    D -->|Creation error| M[500 Error Handler]
    I -->|Invalid Login| M
    M --> A
```

## Changelog

- imported starter code from class repo.
- created missing `package-lock.json` file with `npm install`.
- created `.env.example`.
- added `UML` as mermaid to document both required flows:
  - Signup hashes the password through a model hook before database storage.
  - Signin delegates credential validation to middleware and a model method.
  - Successful and unsuccessful outcomes return through Express.