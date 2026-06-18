"""
Data cleanup script — fixes identified data issues:
1. Standardize Singapore A*STAR provider strings (2 → 1 variant)
2. Standardize NZ Manaaki provider strings (2 → 1 variant)
3. Normalize degree_levels aliases:
   - 'College of Technology'  -> 'Vocational'
   - 'Vocational / Diploma'   -> 'Vocational'
   - 'Postdoc'                -> 'Postdoctoral'
   - 'Professional Degree'    -> 'Master'
4. Add slug to entries that lack one

Idempotent — safe to re-run.
"""
import json
from pathlib import Path
import re
import sys

data_path = Path(__file__).parent.parent / 'data' / 'scholarships.json'

# Map of provider standardizations: list of (from, to)
PROVIDER_RENAMES = [
    ('Singapore A*STAR', 'A*STAR / Singapore'),
]

# NZ cleanup: strip parenthetical
def clean_nz_provider(p):
    if 'Education New Zealand' in p:
        return 'Education New Zealand / MFAT'
    return p

# Degree level aliases
DEGREE_ALIASES = {
    'College of Technology': 'Vocational',
    'Vocational / Diploma': 'Vocational',
    'Postdoc': 'Postdoctoral',
    'Professional Degree': 'Master',
}

def make_slug(name):
    s = name.lower()
    s = re.sub(r'[^a-z0-9\s-]', '', s)
    s = re.sub(r'\s+', '-', s)
    s = re.sub(r'-+', '-', s).strip('-')
    return s[:100] or 'scholarship'

# Load
with open(data_path, 'r', encoding='utf-8') as f:
    data = json.load(f)
scholarships = data['scholarships']
print(f'Loaded {len(scholarships)} scholarships')

# Track changes
provider_changes = 0
degree_changes = 0
slug_changes = 0

# Apply fixes
for s in scholarships:
    # 1. Provider standardization
    old = s.get('provider', '')
    new = old
    for src, dst in PROVIDER_RENAMES:
        if old == src or old.startswith(src + ' /'):
            new = old.replace(src, dst)
    new = clean_nz_provider(new)
    if new != old:
        s['provider'] = new
        provider_changes += 1

    # 2. Degree level normalization
    dls = s.get('degree_levels', [])
    new_dls = []
    changed = False
    for d in dls:
        if d in DEGREE_ALIASES:
            new_dls.append(DEGREE_ALIASES[d])
            changed = True
        else:
            new_dls.append(d)
    # Dedupe
    deduped = list(dict.fromkeys(new_dls))
    if deduped != dls:
        s['degree_levels'] = deduped
        if changed:
            degree_changes += 1

    # 3. Add slug if missing
    if not s.get('slug'):
        s['slug'] = make_slug(s['name'])
        slug_changes += 1

print(f'  Provider strings changed: {provider_changes}')
print(f'  Degree level entries changed: {degree_changes}')
print(f'  Slugs added: {slug_changes}')

# Write
with open(data_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
print(f'\nWrote {len(scholarships)} entries to {data_path}')
