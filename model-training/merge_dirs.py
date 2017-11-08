import argparse
import os
from os.path import join as pjoin
import re

pattern = r'\d+\.'


def get_file_num(file_name):
    return int(re.findall(pattern, file_name)[0][:-1])


def main(src, dst):
    src_dirs = os.listdir(src)
    dst_dirs = os.listdir(dst)
    for dir in src_dirs:
        if dir not in dst_dirs:
            os.rename(pjoin(src, dir), pjoin(dst, dir))
            print('{}/{} -> {}/{}'.format(src, dir, dst, dir))
        else:
            files = os.listdir(pjoin(src, dir))
            top_file = sorted(files, key=get_file_num)[-1]
            file_num = get_file_num(top_file) + 1
            for f in files:
                new_name = re.sub(pattern, str(file_num) + '.', f)
                os.rename(pjoin(src, dir, f), pjoin(dst, dir, new_name))
                print('{}/{}/{} -> {}/{}/{}'.format(src, dir, f, dst, dir,
                                                    new_name))
                file_num += 1


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description=
        'Move all files in immediate subdirectories of src into the same \
        directory in dst. Remove possible name conflicts.\
        Assumes that filenames have a number right before the file extension')
    parser.add_argument('src')
    parser.add_argument('dst')
    args = parser.parse_args()
    main(args.src, args.dst)
