update() {
  dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
  cd "$dir"
  if [ $# -ne 4 ]; then
    exit 1
  fi

  search_text="$1"
  suffix="$2"
  folder_type="$3"
  js_file="$4"

  if [ "$folder_type" == "CURRENT" ]; then
    folder="../resources/CURRENT"
  elif [ "$folder_type" == "PREVIOUS" ]; then
    folder="../resources/PREVIOUS"
  else
    exit 1
  fi
  if [ ! -d "$folder" ]; then
    echo "Error: Folder $folder does not exist."
    exit 1
  fi
  line_number=$(grep -n "$search_text" "$js_file" | cut -d':' -f1)
  if [ -z "$line_number" ]; then
    echo "Search text '$search_text' not found in $js_file."
    exit 1
  fi
  file=$(find "$folder" -type f -name "*$suffix" -print -quit)
  if [ -z "$file" ]; then
    echo "No files found with suffix '$suffix' in $folder."
    exit 0
  fi
  relative_path="${file#../}"
  sed -i "${line_number}!b; :a; N; /'firmware': '.*'/!ba; s|'firmware': '.*'|'firmware': '$relative_path'|" "$js_file"
  echo "The first 'firmware' entry after '$search_text' in $js_file updated to match the file with suffix '$suffix' in folder type '$folder_type'."
}

update "Mpreviouss2Files" "flipper.bin" "PREVIOUS" "variables.js"
update "Mlatests2Files" "flipper.bin" "CURRENT" "variables.js"
update "Mpreviouss2SDFiles" "flipper.bin" "PREVIOUS" "variables.js"
update "Mlatests2SDFiles" "flipper.bin" "CURRENT" "variables.js"

update "MpreviouswroomFiles" "old_hardware.bin" "PREVIOUS" "variables.js"
update "MlatestwroomFiles" "old_hardware.bin" "CURRENT" "variables.js"
update "MV6previousFiles" "v6.bin" "PREVIOUS" "variables.js"
update "MV6latestFiles" "v6.bin" "CURRENT" "variables.js"

update "MV6_1previousFiles" "v6_1.bin" "PREVIOUS" "variables.js"
update "MV6_1latestFiles" "v6_1.bin" "CURRENT" "variables.js"
update "MKitpreviousFiles" "kit.bin" "PREVIOUS" "variables.js"
update "MKitlatestFiles" "kit.bin" "CURRENT" "variables.js"

update "MS3previousFiles" "multiboardS3.bin" "PREVIOUS" "variables.js"
update "MS3latestFiles" "multiboardS3.bin" "CURRENT" "variables.js"
update "MV6MinipreviousFiles" "mini.bin" "PREVIOUS" "variables.js"
update "MV6MinilatestFiles" "mini.bin" "CURRENT" "variables.js"

update "MD1MinipreviousFiles" "lddb.bin" "PREVIOUS" "variables.js"
update "MD1MinilatestFiles" "lddb.bin" "CURRENT" "variables.js"
update "MDevPropreviousFiles" "dev_board_pro.bin" "PREVIOUS" "variables.js"
update "MDevProlatestFiles" "dev_board_pro.bin" "CURRENT" "variables.js"

