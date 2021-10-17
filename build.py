
import json
import yaml
# import shutil

# shutil.rmtree('build')
# shutil.copytree('site', 'build')

db_source_path = 'database/JP.yaml'
db_target_path = 'site/JP.json'

# resort_group_keys = set()
# resort_keys = set()

def verifyExpectedKeys(obj, mandatory_keys, optional_keys):
    for mandatory_key in mandatory_keys:
        if mandatory_key not in obj:
            raise Exception(f"mandatory key {mandatory_key} not found in {obj}")
    for key in obj.keys():
        if key not in mandatory_keys and key not in optional_keys:
            raise Exception(f"unexpected key {key} included in {obj}")

def verifyResortGroup(resort_group_key, resort_group):
    verifyExpectedKeys(resort_group, ['Name'], [])
    verifyExpectedKeys(resort_group['Name'], ['ja', 'en'], [])

def verifyResort(resort_key, resort):
    verifyExpectedKeys(resort, ['Name', 'Location'], ['Status', 'Parent', 'Website', 'ExtWebsite', 'Tel', 'Groups'])
    verifyExpectedKeys(resort['Name'], ['ja', 'en'], [])
    verifyExpectedKeys(resort['Location'], ['Country', 'Geometry'], ['ZipCode', 'Address', 'ZoomLevelThreshold'])
    if 'Website' in resort:
        verifyExpectedKeys(resort['Website'], [], ['ja', 'en', 'common'])
    if 'ExtWebsite' in resort:
        verifyExpectedKeys(resort['ExtWebsite'], [], ['ja', 'en', 'common'])
    if 'Tel' in resort:
        verifyExpectedKeys(resort['Tel'], [], ['Info', 'Emergency'])
    verifyExpectedKeys(resort['Location']['Geometry'], ['Point'], [])
    verifyExpectedKeys(resort['Location']['Geometry']['Point'], ['Lng', 'Lat'], [])
    if 'Address' in resort['Location']:
        verifyExpectedKeys(resort['Location']['Address'], [], ['ja', 'en'])

def verifyAsParentResort(resort_key, resort):
    # ZoomLevelThreshold is mandatory
    verifyExpectedKeys(resort['Location'], ['Country', 'Geometry', 'ZoomLevelThreshold'], ['ZipCode', 'Address'])

with open(db_target_path, mode='w', encoding='utf-8') as out_json:
    with open(db_source_path, encoding='utf-8') as in_yaml:
        data_in = yaml.safe_load(in_yaml)
        print(f"{len(data_in['Resorts'])} items found")
        data_out = {
            'ResortGroups': {},
            'Resorts': {}
        }
        parent_resort_key_list = []
        group_to_resort_list = {}

        # verify resort groups
        for resort_group_key, resort_group in data_in['ResortGroups'].items():
            verifyResortGroup(resort_group_key, resort_group)
            data_out['ResortGroups'][resort_group_key] = resort_group
            group_to_resort_list[resort_group_key] = []

        # verify resorts
        for resort_key, resort in data_in['Resorts'].items():
            verifyResort(resort_key, resort)
            if 'Status' in resort and resort['Status'] == 'Disabled':
                continue

            data_out['Resorts'][resort_key] = resort
            if 'Parent' in resort:
                parent_resort_key_list.append(resort['Parent'])
            if 'Groups' in resort:
                for group in resort['Groups']:
                    if group not in group_to_resort_list:
                        raise Exception(f"unexpected group {group} found")
                    group_to_resort_list[group].append(resort)

        # verify parent resorts
        for parent_resort_key in parent_resort_key_list:
            verifyAsParentResort(parent_resort_key, data_in['Resorts'][parent_resort_key])

        # check if groups have members
        for group_key, group_resort_list in group_to_resort_list.items():
            if len(group_resort_list) == 0:
                raise Exception(f"empty group {group_key} found")

        json.dump(data_out, out_json, indent=2, ensure_ascii=False)
