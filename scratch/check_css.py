import glob, re

css_files = ['css/style.css', 'css/components.css', 'css/responsive.css']

for cf in css_files:
    with open(cf, 'r', encoding='utf-8') as f:
        content = f.read()
    # Strip comments
    content_no_comments = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    opens = content_no_comments.count('{')
    closes = content_no_comments.count('}')
    print(f"{cf}: {{ = {opens}, }} = {closes}")
    if opens != closes:
        print(f"ERROR: Mismatched braces in {cf}!")
    else:
        print(f"Braces perfectly balanced in {cf}.")
