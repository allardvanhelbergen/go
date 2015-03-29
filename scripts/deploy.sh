#!/usr/bin/env bash


set -e


TARGET_DIR=../go-backup/go-$(date +"%Y%m%d-%H%M%S")


function title {
    echo
    echo "# $1..."
    echo
}


# TODO(allard): How do you stop the app without killing everything?!
# Stop forever first.
# title "Setting phasers to stun"
# forever stop 0

# Copy current files to back up directory   .
title "Backing up files to Flight Control"
printf "Target directory: %s\n" $TARGET_DIR
cp -Rf . $TARGET_DIR

# Pull newest version from Git and install.
title "Pulling newest version from Space Center"
git pull origin master

title "Running Initialisation Protocols"
./scripts/setup.sh

# Restart the app.
title "Restarting Go"
forever restartall

# Finish.
title "Mission Complete"
echo "Ready to boldly go, where no link has gone before!"
exit 0
