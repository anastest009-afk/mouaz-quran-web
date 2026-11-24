import os

# --- إعدادات السكربت ---

# اسم الملف الناتج
OUTPUT_FILENAME = 'Full_Project_Code.txt'

# اسم مجلد المشروع الفرعي (في حال تشغيل السكربت من مجلد Mouaz الخارجي)
SUBPROJECT_DIR = 'mouaz_quran_web'

# الحد الأقصى لحجم الملف بالكيلوبايت (مهم لتجنب ملفات البيانات الضخمة مثل JSON الخاصة بنصوص القرآن)
# يمكنك تغييره إلى None إذا أردت دمج جميع الملفات مهما كان حجمها
MAX_FILE_SIZE_KB = 300

# 1. ملفات التكوين الأساسية في الجذر (Root)
IMPORTANT_ROOT_FILES = [
    'package.json',
    'tsconfig.json',
    'tsconfig.app.json',
    'tsconfig.node.json',
    'vite.config.ts',
    'vite.config.js',
    'index.html',
    'tailwind.config.js',
    'tailwind.config.ts',
    'postcss.config.js',
    'eslint.config.js',
    '.eslintrc.cjs',
    '.eslintrc.json',
    '.gitignore',          # مفيد لمعرفة الملفات المستبعدة
    'README.md',           # مفيد لفهم وصف المشروع
    '.env.example',        # نموذج متغيرات البيئة (بدون .env لحماية المفاتيح السرية)
]

# 2. المجلدات التي نريد البحث داخلها (داخل mouaz_quran_web)
DIRS_TO_SCAN = ['src', 'docs']

# 3. امتدادات الملفات المطلوبة داخل المجلدات
ALLOWED_EXTENSIONS = {
    '.ts', '.tsx',         # ملفات TypeScript و React TSX
    '.js', '.jsx',         # ملفات JavaScript و React JSX
    '.mjs', '.cjs',        # ملفات إعدادات JS
    '.css', '.scss',       # ملفات التنسيق والتصميم
    '.html',               # ملفات HTML
    '.json',               # ملفات البيانات والإعدادات
    '.md', '.txt',         # ملفات التوثيق (مثل الموجودة في مجلد docs)
}

# 4. ملفات محددة بالاسم (ليس لها امتداد أو مهمة)
EXACT_FILES_TO_INCLUDE = {
    '.gitignore',
    'Dockerfile',
}

# 5. ملفات معينة يجب تجاهلها صراحة (ملفات القفل الضخمة والمولدة)
IGNORE_FILES = {
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    'bun.lockb',
}

# 6. مجلدات داخلية يجب تجاهلها (لتجنب الملفات الضخمة وغير المفيدة)
IGNORE_DIRS = {
    'node_modules',        # مجلد الحزم (ضخم جداً)
    'dist',                # مجلد مخرجات البناء (Build)
    'build',
    '.git',
    '.vite',
    '.vscode',
    '.idea',
    'coverage',
    '__pycache__',
}

# استبعاد الملفات المصغرة أو خرائط التتبع المولدة تلقائياً؟
SKIP_GENERATED_FILES = True


def is_wanted_file(file_path, filename):
    # استبعاد ملفات القفل المحددة
    if filename in IGNORE_FILES:
        return False

    # التحقق من حجم الملف لتفادي ملفات البيانات الضخمة جداً
    if MAX_FILE_SIZE_KB is not None:
        try:
            size_kb = os.path.getsize(file_path) / 1024
            if size_kb > MAX_FILE_SIZE_KB:
                print(f"تخطي (حجم كبير {size_kb:.1f} KB): {filename}")
                return False
        except OSError:
            return False

    # استبعاد الملفات المصغرة وخرائط المصدر المولدة
    if SKIP_GENERATED_FILES:
        if filename.endswith(('.min.js', '.min.css', '.js.map', '.css.map')):
            return False

    # التحقق من الملفات المطلوبة بالاسم الحرفي
    if filename in EXACT_FILES_TO_INCLUDE:
        return True

    # التحقق من الامتدادات
    ext = os.path.splitext(filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        return False

    return True


def write_file_content(outfile, file_path, relative_path):
    """دالة مساعدة لكتابة محتوى الملف"""
    try:
        # استخدام utf-8-sig للتعامل مع النصوص العربية وملفات BOM بسلاسة
        with open(file_path, 'r', encoding='utf-8-sig') as infile:
            outfile.write(f"\n{'='*60}\n")
            outfile.write(f"FILE PATH: {relative_path}\n")
            outfile.write(f"{'='*60}\n")
            outfile.write(infile.read())
            outfile.write("\n")
            print(f"تمت إضافة: {relative_path}")
            return True
    except UnicodeDecodeError:
        print(f"تخطي (ملف غير نصي): {relative_path}")
        return False
    except Exception as e:
        print(f"خطأ في قراءة الملف {relative_path}: {e}")
        return False


def merge_files():
    root_dir = os.getcwd()

    # تحديد مجلد المشروع تلقائياً (يدعم التشغيل من Mouaz أو من داخل mouaz_quran_web)
    if os.path.exists(os.path.join(root_dir, 'package.json')):
        project_dir = root_dir
    elif os.path.exists(os.path.join(root_dir, SUBPROJECT_DIR, 'package.json')):
        project_dir = os.path.join(root_dir, SUBPROJECT_DIR)
    else:
        project_dir = root_dir
        print("تنبيه: لم يتم العثور على package.json في المجلد الحالي أو داخل mouaz_quran_web.")
        print("يرجى وضع السكربت في مجلد Mouaz أو بجانب package.json للحصول على أفضل نتيجة.\n")

    file_count = 0
    processed_paths = set()
    script_abs_path = os.path.abspath(__file__)
    output_abs_path = os.path.abspath(os.path.join(root_dir, OUTPUT_FILENAME))

    with open(OUTPUT_FILENAME, 'w', encoding='utf-8') as outfile:
        print(f"جاري تجميع ملفات مشروع React + Vite من: {project_dir} ...\n")

        # --- الخطوة 1: قراءة الملفات الأساسية في الجذر ---
        print("--- إضافة ملفات التكوين الأساسية ---")
        search_roots = [project_dir]
        if project_dir != root_dir:
            # لالتقاط ملفات مثل .gitignore الموجودة في المجلد الأب Mouaz
            search_roots.append(root_dir)

        for base_dir in search_roots:
            for filename in IMPORTANT_ROOT_FILES:
                file_path = os.path.join(base_dir, filename)
                abs_path = os.path.abspath(file_path)

                if os.path.isfile(file_path) and abs_path not in processed_paths:
                    relative_path = os.path.relpath(file_path, root_dir)
                    if write_file_content(outfile, file_path, relative_path):
                        processed_paths.add(abs_path)
                        file_count += 1

        # --- الخطوة 2: الدخول للمجلدات المحددة (src, docs) ---
        print("\n--- فحص المجلدات المحددة (Source Code & Docs) ---")

        for target_dir_name in DIRS_TO_SCAN:
            target_path = os.path.join(project_dir, target_dir_name)

            if not os.path.exists(target_path):
                continue

            for root, dirs, files in os.walk(target_path):
                # تنظيف المجلدات الفرعية غير المرغوبة وترتيبها أبجدياً
                dirs[:] = sorted([d for d in dirs if d not in IGNORE_DIRS])

                for file in sorted(files):
                    file_path = os.path.join(root, file)
                    abs_path = os.path.abspath(file_path)

                    # استبعاد السكربت نفسه والملف الناتج أو أي ملف سبق إضافته
                    if abs_path in (script_abs_path, output_abs_path) or abs_path in processed_paths:
                        continue

                    if is_wanted_file(file_path, file):
                        relative_path = os.path.relpath(file_path, root_dir)
                        if write_file_content(outfile, file_path, relative_path):
                            processed_paths.add(abs_path)
                            file_count += 1

    print(f"\n--- تم الانتهاء بنجاح! ---")
    print(f"تم دمج {file_count} ملف في الملف: {OUTPUT_FILENAME}")


if __name__ == "__main__":
    merge_files()