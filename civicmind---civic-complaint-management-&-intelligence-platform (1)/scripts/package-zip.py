import zipfile
import os

output_dir = 'public'
os.makedirs(output_dir, exist_ok=True)
zip_path = os.path.join(output_dir, 'civicmind-project.zip')

print(f"Creating archive at {zip_path}...")

excluded_dirs = {'node_modules', '.git', 'dist', '.aistudio', 'public'}
excluded_files = {'civicmind-project.zip', '.DS_Store'}

count = 0
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in excluded_dirs]
        for file in files:
            if file in excluded_files:
                continue
            filepath = os.path.join(root, file)
            arcname = os.path.relpath(filepath, '.')
            zipf.write(filepath, arcname)
            count += 1

size_kb = os.path.getsize(zip_path) / 1024
print(f"Archived {count} files successfully! Size: {size_kb:.1f} KB")
