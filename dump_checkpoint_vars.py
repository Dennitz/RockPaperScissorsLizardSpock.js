# Copyright 2017 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ==============================================================================
"""A script to dump tensorflow checkpoint variables to deeplearnjs.
This script takes a checkpoint file and writes all of the variables in the
checkpoint to a directory.
"""

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import argparse
import json
import os
import re
import string
import tensorflow as tf

FLAGS = None
FILENAME_CHARS = string.ascii_letters + string.digits + '_'


def _var_name_to_filename(var_name):
    chars = []
    for c in var_name:
        if c in FILENAME_CHARS:
            chars.append(c)
        elif c == '/':
            chars.append('_')
    return ''.join(chars)


def _get_filtered_vars(var_to_shape_map):
    var_base_names = set()
    for var in var_to_shape_map:
        underscore_idx = var.find('_')
        if underscore_idx != -1:
            var_base_names.add(var[:var.find('_')])
        else:
            var_base_names.add(var[:var.rfind('/')])

    filtered_vars = {}
    for name in var_base_names:
        vars_matching_base = [
            var for var in var_to_shape_map if name in var
        ]
        for var in sorted(vars_matching_base)[-2:]:
            filtered_vars[var] = var_to_shape_map[var]

    return filtered_vars


def _get_display_name(var_name):
    underscore_idx = var_name.rfind('_')
    if underscore_idx != -1:
        return var_name[:underscore_idx] + var_name[underscore_idx + 2:]
    return var_name


def main():
    chk_fpath = os.path.expanduser(FLAGS.checkpoint_file)
    reader = tf.train.NewCheckpointReader(chk_fpath)
    var_to_shape_map = reader.get_variable_to_shape_map()
    var_to_shape_map = _get_filtered_vars(var_to_shape_map)
    output_dir = os.path.expanduser(FLAGS.output_dir)
    tf.gfile.MakeDirs(output_dir)
    manifest = {}
    remove_vars_compiled_re = re.compile(FLAGS.remove_variables_regex)

    var_filenames_strs = []
    for name in var_to_shape_map:
        if (FLAGS.remove_variables_regex and re.match(
                remove_vars_compiled_re, name)) or name == 'global_step':
            print('Ignoring ' + name)
            continue
        display_name = _get_display_name(name)
        var_filename = _var_name_to_filename(display_name)
        manifest[display_name] = {
            'filename': var_filename,
            'shape': var_to_shape_map[name]
        }

        print('Writing variable ' + name + ' as ' + display_name)
        tensor = reader.get_tensor(name)
        with open(os.path.join(output_dir, var_filename), 'wb') as f:
            f.write(tensor.tobytes())

        var_filenames_strs.append("\"" + var_filename + "\"")

    manifest_fpath = os.path.join(output_dir, 'manifest.json')
    print('Writing manifest to ' + manifest_fpath)
    with open(manifest_fpath, 'w') as f:
        f.write(json.dumps(manifest, indent=2, sort_keys=True))
    print('Done!')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--checkpoint_file',
        type=str,
        required=True,
        help='Path to the model checkpoint')
    parser.add_argument(
        '--output_dir',
        type=str,
        required=True,
        help='The output directory where to store the converted weights')
    parser.add_argument(
        '--remove_variables_regex',
        type=str,
        default='',
        help='A regular expression to match against variable names that should '
        'not be included')
    FLAGS, unparsed = parser.parse_known_args()
    if unparsed:
        print('Error, unrecognized flags:', unparsed)
        exit(-1)
    main()
