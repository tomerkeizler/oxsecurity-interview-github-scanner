<img src="https://github.com/user-attachments/assets/8822a63b-535c-4ffb-b7a6-9ad262a100b5" width="150" height="150">
<img src="https://github.com/user-attachments/assets/0b67c82d-115c-4588-94e4-c0e50a564b5f" width="150" height="150">
<img src="https://github.com/user-attachments/assets/435205db-1608-46ff-a828-dd1ba87f4a3c" width="250" height="150">
<img src="https://github.com/user-attachments/assets/83e8b318-973c-4c69-aa25-013a6969bb66" width="150" height="150">

# GitHub scanner
This GraphQL server lets you scan Github repositories using Github API.

## Getting Started
Just clone the repo and then:

```bash
$ npm install

# development
$ npm start

# watch mode
$ npm run dev

# or directly run
$ npx tsx src/index.ts
```

The API server must become available at http://localhost:4000/ which will open the Apollo Studio

## Description
suppoeted scenarios:
- Show List of Repositories
  - Repo name
  - Repo size
  - Repo owner 

- Show Repository details **(LIMITED to 2 concurrent operations)**
  - Repo name
  - Repo size
  - Repo owner
  - Private\public repo
  - Total number of files in the repo
  - Content of a random yaml file from the repo
  - List of active webhooks
 
## Apollo Studio
Here you can test your GraphQL queries.
For example:

```bash
query query($developerToken: String!) {
  repositories(developerToken: $developerToken){
    name,
    size,
    owner
  }
}
```

```bash
query query($repoName: String!, $developerToken: String!)  {
  repository(repoName: $repoName, developerToken: $developerToken){
    name,
    size,
    owner
    isPrivate,
    numberOfFiles,
    randomYamlFileContent,
    webhooks
  }
}
```
with variables:
```bash
{
  "repoName": "oxsecurity-interview-repoA",
  "developerToken": "************************",  # A valid token was sent to the Talent Acquisition Manager by mail
}
```

### You need to provide a developer token when sending a request, due to the exrecise requirement:

``
"Make sure to add to your input a "developer token" from github and return the appropriate data for the scenario"
``
