#!/usr/bin/env bash


function title {
    echo
    echo "# $1..."
    echo
}


# TODO(allard): How do you stop the app without killing everything?!
# Stop forever first.
# title "Stopping the App"
# forever stop 0

# Copy current files to back up directory   .
title "Backing up files"
TARGET_DIR=../go-backup/go-$(date +"%Y%m%d-%H%M%S")
printf "Target directory: %s\n" $TARGET_DIR
cp -Rf . $TARGET_DIR

# Pull newest version from Git and install.
title "Pulling newest version"
git pull origin master

title "Running set up"
./scripts/setup.sh

# Restart the app.
title "Restarting the App"
forever restartall

# Finish.
title "Done"
echo "Hooray! \o/"
exit 0
