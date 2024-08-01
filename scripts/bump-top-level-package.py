#!/usr/bin/env python

import os
import sys
import json
import pathlib

# Root of the repository
REPO_ROOT = pathlib.Path(__file__).parent.parent.resolve()


def bump_toplevel_package():
    """This script is meant to run as after-bump-version hook in jupyter-releaser

    The script esentially will check the new bumped version of one of the packages
    in the monorepo and uses this version to bump the version in the toplevel
    package.json.

    This script assumes that _all_ packages in the monorepo share the same version and
    are bumped all together. The script ensures the version toplevel package.json is
    consistent with versions of packages
    """
    # # Check if package_path is provided as CLI arg
    # if len(sys.argv) < 2:
    #     print("Package path not found. Usage: bump-package.py <path_to_package>")
    #     os.exit(1)

    # # Get package path of one of the packages in monorepo
    # # We check for package.json within this package path to get new bumped version
    # package_path = sys.argv[1]

    # Get top level package.json
    top_package_json_file = os.path.join(REPO_ROOT, 'package.json')

    # Error if package.json does not exist
    if not os.path.exists(top_package_json_file):
        print("No package.json found in the root of the repository. Exiting...")
        os.exit(1)

    # Read top level package.json
    top_package_json_file = os.path.join(REPO_ROOT, 'package.json')
    with open(top_package_json_file, 'r') as f:
        top_package_json = json.load(f)

    # Get workspaces key where packages are defined
    workspaces = top_package_json['workspaces']

    # Iterate through workspaces and the first package.json that we will find in 
    # one of the packages, we read version and break
    bumped_version = ''
    for workspace in workspaces:
        # Remove any glob patterns and trailing slashes for the path
        workspace = workspace.replace('*/', '').replace('*', '').strip('/')
        for path in pathlib.Path(REPO_ROOT).joinpath(workspace).rglob('*.json'):
            if path.name == 'package.json':
                # Read package.json and get version
                with open(path, 'r') as f:
                    package_json = json.load(f)

                # Get package name
                package_name = package_json['name']

                # Get version
                bumped_version = package_json['version']
                print(f"Version {bumped_version} fetched from package {package_name}")
                break

    if not bumped_version:
        print("Failed to find version from workspaces packges. Exiting...")
        os.exit(1)
    
    # Update top level package.json with new version and dump it back
    top_package_json['version'] = bumped_version
    with open(top_package_json_file, 'w') as f:
        json.dump(top_package_json, f, indent=2)
        f.write('\n')


if __name__ == "__main__":
    bump_toplevel_package()
