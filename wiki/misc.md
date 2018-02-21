# Misc

This file contains other relevant details that may not properly fil into any available category.

## Git and File-Renaming

If you rename a file by simply changing its case, git may fail to recognize this change. For instance, if you rename `Team.js` to `team.js`, git may still keep that file as `Team.js`. This may not be a problem on Windows and Mac but will lead to issues on Linux, and Linux-based environments like Heroku, Travis CI, Circle CI.

There are many ways to solve this issue, including renaming the file to something really different (not just of a different case), commiting the change, then renaming the file again to what you really want, and commiting again.

For more info see https://stackoverflow.com/questions/10523849/changing-capitalization-of-filenames-in-git.