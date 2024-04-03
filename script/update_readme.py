import os
import re
import requests
import random

def fetch_language_stats(owner, repo, token):
    url = f"https://api.github.com/repos/{owner}/{repo}/languages"
    headers = {"Authorization": f"token {token}"}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception("Failed to fetch repository languages")

def calculate_percentages(languages):
    total_bytes = sum(languages.values())
    return {lang: (bytes/total_bytes) * 100 for lang, bytes in languages.items()}

def extract_current_colors(readme_contents):
    color_pattern = re.compile(r'!\[(\w+)\]\(https://img.shields.io/badge/\1-\d+\.\d+%25-([A-Fa-f0-9]{6}|[A-Za-z]+)\.svg\?style=flat-square&logo=\w+\)')
    current_colors = {}
    for match in color_pattern.finditer(readme_contents):
        language, color = match.groups()
        current_colors[language] = color
    return current_colors
    
def update_readme(readme_path, percentages, current_colors):
    with open(readme_path, "r") as file:
        readme_contents = file.read()
               
    for lang, percent in percentages.items():
        color = current_colors.get(lang, 'blue')
        print(f"Using color for {lang}: {color}")
        pattern = rf"!\[{lang}\]\(https://img.shields.io/badge/{lang}-\d+\.\d+%25-([A-Za-z]+|[\dA-Fa-f]{6})\.svg\?style=flat-square&logo={lang.lower()}\)"
        replacement = f"![{lang}](https://img.shields.io/badge/{lang}-{percent:.1f}%25-{color}.svg?style=flat-square&logo={lang.lower()})"
        readme_contents = re.sub(pattern, replacement, readme_contents, flags=re.IGNORECASE)
    
    with open(readme_path, "w") as file:
        file.write(readme_contents)

if __name__ == "__main__":
    GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
    OWNER = "FZEEFlasher"
    REPO = "fzeeflasher.github.io"
    README_PATH = "README.md"
    
    languages = fetch_language_stats(OWNER, REPO, GITHUB_TOKEN)
    percentages = calculate_percentages(languages)
    current_colors = extract_current_colors(open(README_PATH).read())
    print(current_colors)
    print("Fetched Languages:", languages)
    print("Calculated Percentages:", percentages)
    update_readme(README_PATH, percentages, current_colors)