#!/usr/bin/env bash


# cp current files to back up dir
TARGET_DIR=../go-backup/go-$(date +'%Y%m%d')
echo '****'
printf 'Backing up files to "%s"...\n' $TARGET_DIR
echo '****'
cp -Rf . $TARGET_DIR

# Stop forever first
echo '****'
echo 'Stopping the App...'
echo '****'
# TODO(allard): How do you stop the app?!
# forever stop 0

# git pull newest and install
echo '****'
echo 'Pulling newest version...'
echo '****'
git pull

echo '****'
echo 'Running set up'
echo '****'
./scripts/setup.sh

# restart app

echo '****'
echo 'Restarting the App...'
echo '****'
npm start-prod


echo '****'
echo 'Hooray! \o/'
echo '****'
exit 0
