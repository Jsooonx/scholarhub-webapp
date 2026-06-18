"""
Auto-save 18 new logos to public/images/ with best-guess names.
Best-guess mapping based on color analysis + dimensions:
- Orange-dominant → NL (Nuffic)
- Teal+green → Manaaki NZ
- Cyan+green → Education NZ
- Pale yellow → Swedish Institute
- Dark blue → A*STAR
- Light blue → MOE Taiwan
- Pink/red → Italy MAECI
- Gray → Swiss SERI / Denmark
"""
import shutil
import os

SRC = 'C:/Users/GIELANG/AppData/Roaming/Hermes/composer-images'
DST_LOGOS = 'public/images/programlogos'
DST_UNIV = 'public/images/universities'

# (source_file, target_filename, destination_folder)
mapping = [
    # LOGOS (square-ish or card-friendly)
    ('composer_2026-06-18_00-31-09-024_f2fa36.png', 'astar.png',                DST_LOGOS),  # dark blue → A*STAR
    ('composer_2026-06-18_00-34-18-824_79c124.png', 'nuffic.png',                DST_LOGOS),  # orange → NL/Nuffic
    ('composer_2026-06-18_00-34-45-058_c177ca.png', 'csc_china.png',             DST_LOGOS),  # orange-brown tall → CSC China
    ('composer_2026-06-18_00-35-03-434_0be4d6.png', 'moe_taiwan.png',            DST_LOGOS),  # light blue → MOE Taiwan
    ('composer_2026-06-18_00-35-30-558_39ccbd.png', 'si_sweden.png',             DST_LOGOS),  # pale → Sweden SI
    ('composer_2026-06-18_00-36-17-707_844cd8.png', 'irish_hea.png',             DST_LOGOS),  # deep blue → HEA Ireland
    ('composer_2026-06-18_00-36-41-104_527072.png', 'hkpfs.png',                 DST_LOGOS),  # white → HKPFS Hong Kong
    ('composer_2026-06-18_00-36-58-147_4d4bf0.png', 'manaaki_nz.png',            DST_LOGOS),  # teal+green → Manaaki
    ('composer_2026-06-18_00-37-14-581_b5f6dd.png', 'mis_malaysia.png',          DST_LOGOS),  # cyan+green → MIS Malaysia
    ('composer_2026-06-18_00-37-40-846_ba59a3.png', 'maeci_italy.png',           DST_LOGOS),  # pink/red → Italy MAECI
    ('composer_2026-06-18_00-38-26-185_204909.png', 'swiss_seri.png',            DST_LOGOS),  # pale yellow → Swiss
    ('composer_2026-06-18_00-38-57-038_d14858.png', 'stipendium_hungaricum.png',  DST_LOGOS),  # gray → Stipendium Hungary
    ('composer_2026-06-18_00-39-12-126_857042.png', 'danish_govt.png',           DST_LOGOS),  # pale → Danish
    ('composer_2026-06-18_00-39-46-286_23b047.png', 'norway_govt.png',           DST_LOGOS),  # light gray → Norway

    # WIDE BANNERS (1200+ wide)
    ('composer_2026-06-18_00-33-42-660_bf2e44.png', 'nuffic_wide.png',           DST_UNIV),   # orange wide
    ('composer_2026-06-18_00-35-56-811_a16e9d.png', 'si_sweden_wide.png',        DST_UNIV),   # gray wide
    ('composer_2026-06-18_00-36-58-147_4d4bf0.png', None,                          None),      # Already used as logo, skip wide
    ('composer_2026-06-18_00-38-02-236_75da1a.png', 'astar_wide.png',            DST_UNIV),   # deep blue wide
    ('composer_2026-06-18_00-40-02-184_6b0257.png', 'hkpfs_wide.png',            DST_UNIV),   # very wide → HKPFS
]

# Hmm, two files point to manaaki_nz.png (4d4bf0 used for both). Let me redo.
# The first 14 are logos. The next 4 are wide banners. 18 total.
# Actually, I listed 14 logos + 5 wide, with 1 dup. Let me fix.

# REDO MAPPING (no dup):
mapping = [
    # 14 LOGOS
    ('composer_2026-06-18_00-31-09-024_f2fa36.png', 'astar.png',                DST_LOGOS),
    ('composer_2026-06-18_00-34-18-824_79c124.png', 'nuffic.png',                DST_LOGOS),
    ('composer_2026-06-18_00-34-45-058_c177ca.png', 'csc_china.png',             DST_LOGOS),
    ('composer_2026-06-18_00-35-03-434_0be4d6.png', 'moe_taiwan.png',            DST_LOGOS),
    ('composer_2026-06-18_00-35-30-558_39ccbd.png', 'si_sweden.png',             DST_LOGOS),
    ('composer_2026-06-18_00-36-17-707_844cd8.png', 'irish_hea.png',             DST_LOGOS),
    ('composer_2026-06-18_00-36-41-104_527072.png', 'hkpfs.png',                 DST_LOGOS),
    ('composer_2026-06-18_00-36-58-147_4d4bf0.png', 'manaaki_nz.png',            DST_LOGOS),
    ('composer_2026-06-18_00-37-14-581_b5f6dd.png', 'mis_malaysia.png',          DST_LOGOS),
    ('composer_2026-06-18_00-37-40-846_ba59a3.png', 'maeci_italy.png',           DST_LOGOS),
    ('composer_2026-06-18_00-38-26-185_204909.png', 'swiss_seri.png',            DST_LOGOS),
    ('composer_2026-06-18_00-38-57-038_d14858.png', 'stipendium_hungaricum.png',  DST_LOGOS),
    ('composer_2026-06-18_00-39-12-126_857042.png', 'danish_govt.png',           DST_LOGOS),
    ('composer_2026-06-18_00-39-46-286_23b047.png', 'norway_govt.png',           DST_LOGOS),
    # 4 WIDE BANNERS
    ('composer_2026-06-18_00-33-42-660_bf2e44.png', 'nuffic_wide.png',           DST_UNIV),
    ('composer_2026-06-18_00-35-56-811_a16e9d.png', 'si_sweden_wide.png',        DST_UNIV),
    ('composer_2026-06-18_00-38-02-236_75da1a.png', 'astar_wide.png',            DST_UNIV),
    ('composer_2026-06-18_00-40-02-184_6b0257.png', 'hkpfs_wide.png',            DST_UNIV),
]

# 14 logos + 4 wides = 18. Perfect.

for src_file, dst_name, dst_folder in mapping:
    src_path = os.path.join(SRC, src_file)
    dst_path = os.path.join(dst_folder, dst_name)
    if not os.path.exists(src_path):
        print(f'MISSING: {src_path}')
        continue
    if os.path.exists(dst_path):
        print(f'OVERWRITE: {dst_name} (already exists)')
    shutil.copy2(src_path, dst_path)
    print(f'OK: {src_file} -> {dst_path}')

print('\nDone.')
