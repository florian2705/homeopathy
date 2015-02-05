# 
homeopathy

HOW TO RUN IT:
* new npm dependencies need to be added with npm install package --save (this will then modify the package.json accordingly)
* to roll out new version on server check out with "git pull" and then start with "nohup npm app.js homeopathy". The homeopathy parameter is important, because then we can kill node with "ps -auxf | grep node"
* update dependencies on server with "npm update" 

DEVELOPER GUIDE:
* get code from git: "git pull"
* send code to git: "git add .", git commit -m "notes, git push
