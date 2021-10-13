# Splinterlands Dashboard
- Splinterlands-Dashboard is open-source & no risk management app for your account.
- View report multiple accounts (check collection power, ecr, quest rewards, collection card rentals fast...) splinterlands. 
- Feel free to give suggestions for features/code refurbishing via github or on telegram chat.

## New Feature

- Any suggestions?

## Installation

Node js [Node js download](https://nodejs.org/en/)

### Clone repo

``` bash
# clone the repo
$ git clone https://github.com/nguyenphuocdai/splinterlands-dashboard.git splinterlands-dashboard

# go into app's directory
$ cd splinterlands-dashboard

# checkout stable version
$ git checkout master

# install app's dependencies
$ npm install
```

### Basic usage

``` bash
# dev server with hot reload at http://localhost:3000
$ npm start
```
Navigate to [http://localhost:3000](http://localhost:3000). The app will automatically reload if you change any of the source files.

## What's included

Within the download you'll find the following directories and files, logically grouping common assets and providing both compiled and minified variations. You'll see something like this:
- Create .accountData.json file (see /src/json/accountData-example.json)

```
Example:
[
    {
        "AccountName": "account00x",
        "PostingKey": "" 
    },
    {
        "AccountName": "account01x",
        "PostingKey": ""
    }
]
```

```
`AccountName="account00x"`: show information for account
`PostingKey:"input your posting key"`: that's use for function copy to clipboard if you feel uncomfortable copying into your bot program else leave it blank.
```

- Create .env
```
PORT=3000
CHOKIDAR_USEPOLLING=true
REACT_APP_CP_ALERT=5000
REACT_APP_ERC_ALERT=50
REACT_APP_ERC_HIGH=90
REACT_APP_AUTO_UPDATE=30
REACT_APP_API_DOMAIN_NAME=localhost:8080
```


## Support

- [Telegram chat](https://t.me/devkaimi).
- [Discord](Kaneki#6285).