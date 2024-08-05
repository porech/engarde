echo 'Uploading @{}' \; -exec curl -4 -F 'file=@{}' -F "path=$branch/{}" -F "key=$UPLOAD_KEY" "$UPLOAD_URL" \;;
