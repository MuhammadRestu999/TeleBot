msg="Update from up.sh"
if [[ "$@" ]]; then
    msg="$@"
fi

git add .
git commit -m "$msg"
git branch -M main
git push -u origin main --force

unset msg
