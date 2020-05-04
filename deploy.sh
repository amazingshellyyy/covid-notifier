git add .
git commit -m "prepare for server deploy"
git subtree push --prefix heroku master
echo ">> backend deployed successfully"
cd ./client
npm run build
sleep 5s
git add .
git commit -m "create docs and ready to deploy"
git push origin master
echo ">> frontend deployed successfully"
echo "|| client-> https://amazingshellyyy.com/covid-notifier"
echo "|| server-> https://dashboard.heroku.com/apps/covid-notifier/logs"