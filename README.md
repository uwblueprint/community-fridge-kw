# Community Fridge KW

Web platform for [Community Fridge KW Donor](https://www.instagram.com/communityfridgekw/?hl=en) Scheduling!

## Stack Choices
**Backend Language:** TypeScript (Express.js on Node.js)<br>
**Backend API:** REST<br>
**Database:** PostgreSQL<br>
**User Auth:** Opt-in<br>
**File Storage:** Opt-in<br>

The provided frontend is a React application written in TypeScript.


## Table of Contents
* 👷 [Getting Started](#getting-started-internal-tools-developers)
  * ✔️ [Prerequisites](#prerequisites)
  * ⚙️ [Set up](#set-up)
  * [Running Migrations](#running-migrations)
* 🧰 [Useful Commands](#useful-commands)
  * ℹ️ [Get Names & Statuses of Running Containers](#get-names--statuses-of-running-containers)
  * 💽 [Accessing PostgreSQL Database](#accessing-postgresql-database)
  * ✨ [Linting & Formatting](#linting--formatting)
  * 🧪 [Running Tests](#running-tests)
* 🌳 [Version Control Guide](#version-control-guide)
  * 🌿 [Branching](#branching)
  * 🔒 [Commits](#commits)


## Getting Started

### Prerequisites

* Install Docker Desktop ([MacOS](https://docs.docker.com/docker-for-mac/install/) | [Windows (Home)](https://docs.docker.com/docker-for-windows/install-windows-home/) | [Windows (Pro, Enterprise, Education)](https://docs.docker.com/docker-for-windows/install/) | [Linux](https://docs.docker.com/engine/install/#server)) and ensure that it is running
* Set up Vault client for secret management, see instructions [here](https://www.notion.so/uwblueprintexecs/Secret-Management-2d5b59ef0987415e93ec951ce05bf03e)


### Set up

1. Clone this repository and `cd` into the project folder
```bash
git clone https://github.com/uwblueprint/community-fridge-kw.git
cd community-fridge-kw
```
2. Pull secrets from Vault
```
vault kv get -format=json kv/community-fridge-kw | python update_secret_files.py

Note: Vault is not configured yet. You have to manually create .env file (one in the root dir, other one in frontend dir).
```
3. Run the application
```bash
docker-compose up --build
```

The backend runs at `http://localhost:5000` and the frontend runs at `http://localhost:3000`.

If you are running into issues and want to build docker image and containers from start, run the following commands

1. If containers are running, stop them
```bash
docker-compose down
```

2. Delete the docker volume
```bash
docker-volume ls  ## find the docker volume name

docker volume rm <volume-name>   
```

3. Run the application by building it again
```bash
docker-compose up --build
```

## Running Migrations

1. Run both the TypeScript backend and database containers, you can use 
```bash
docker-compose up
```
2. `cd` into the backend/typescript folder
```bash
cd backend/typescript
```

3. Run a bash shell in the TypeScript backend container
```bash
# get container name
$ docker ps
# run a bash shell
$ docker exec -it community-fridge-kw_ts-backend_1 /bin/bash  # For our project, typescript backend container name is community-fridge-kw_ts-backend_1. If you want to run a different container, replace community-fridge-kw_ts-backend_1 with the appropriate container name
```

4. Ensure you have migration files in the migrations folder

5. Run the following command
```bash
node migrate up
```


## Useful Commands

### Get Names & Statuses of Running Containers
```bash
docker ps
```

### Accessing PostgreSQL Database

```bash
# run a bash shell in the container
docker exec -it community-fridge-kw_db_1 /bin/bash

# in container now
psql -U postgres -d community-fridge-kw

# in postgres shell, some common commands:
# display all table names
\dt
# quit
\q
# you can run any SQL query, don't forget the semicolon!
SELECT * FROM <table-name>;
```

### Linting & Formatting
Python backend:
```bash
docker exec -it <container-name> /bin/bash -c "black ."
```

TypeScript backend and frontend:
```bash
# linting & formatting warnings only
docker exec -it <container-name> /bin/bash -c "yarn lint"

# linting with fix & formatting
docker exec -it <container-name> /bin/bash -c "yarn fix"
```

### Running Tests
Python backend:
```bash
docker exec -it <container-name> /bin/bash -c "pip install -e . && pytest"
```

TypeScript backend and frontend:
```bash
docker exec -it <container-name> /bin/bash -c "yarn test"
```


## Version Control Guide

### Branching
* Branch off of `main` for all feature work and bug fixes, creating a "feature branch". Prefix the feature branch name with your name. The branch name should be in kebab case and it should be short and descriptive. E.g. `sherry/readme-update`
* To integrate changes on `main` into your feature branch, **use rebase instead of merge**

```bash
# currently working on feature branch, there are new commits on main
git pull origin main --rebase

# if there are conflicts, resolve them and then:
git add .
git rebase --continue

# force push to remote feature branch
git push -f
```

### Commits
* Commits should be atomic (guideline: the commit is self-contained; a reviewer could make sense of it even if they viewed the commit diff in isolation)
* Please follow the [commitlint](https://www.conventionalcommits.org/en/v1.0.0/) guidelines for writing descriptive commits
* Trivial commits (e.g. fixing a typo in the previous commit, formatting changes) should be squashed or fixup'd into the last non-trivial commit

```bash
# last commit contained a typo, fixed now
git add .
git commit -m "Fix typo"

# fixup into previous commit through interactive rebase
# x in HEAD~x refers to the last x commits you want to view
git rebase -i HEAD~2
# text editor opens, follow instructions in there to fixup

# force push to remote feature branch
git push -f
```

* Commit messages and PR names are descriptive and written in **imperative tense**<sup>1</sup>. The first word should be capitalized. E.g. "Create user REST endpoints", not "Created user REST endpoints"
* PRs can contain multiple commits, they do not need to be squashed together before merging as long as each commit is atomic. Our repo is configured to only allow squash commits to `main` so the entire PR will appear as 1 commit on `main`, but the individual commits are preserved when viewing the PR.

---

1: From Git's own [guidelines](https://github.com/git/git/blob/311531c9de557d25ac087c1637818bd2aad6eb3a/Documentation/SubmittingPatches#L139-L145)
