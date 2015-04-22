#!/usr/bin/env bash


set -e


BACKUP_DIR="$HOME/go-backup/go-"$(date +"%Y%m%d-%H%M%S")
GO_DIR="$HOME/go"


function echoTitle {
    echo
    echo "### $1..."
}


# TODO(allard): How do you stop the app without killing everything?!
# Stop forever first.
# echoTitle "Setting phasers to stun"
# forever stop 0

# Copy current files to back up directory   .
echoTitle "Backing Up Files to Mission Control"
printf "Target directory: %s\n" $BACKUP_DIR
cp -Rf $GO_DIR $BACKUP_DIR

# Pull newest version from Git and install.
echoTitle "Pulling New Instructions From Command Center"
git pull origin master

echoTitle "Running Initialisation Protocols"
./scripts/setup.sh

# Restart the app.
echoTitle "Restarting Go/"
forever restartall

# Finish.
echoTitle "Mission Accepted"
echo "Ready to boldly go, where no link has gone before!"
echo " "

exit 0
