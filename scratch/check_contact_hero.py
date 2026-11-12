with open('contact.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i in range(180, 215):
    print(f'{i+1}: {lines[i].strip()}')
