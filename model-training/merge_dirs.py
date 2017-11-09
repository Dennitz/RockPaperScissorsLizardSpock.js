import argparse
import os
from os.path import join as pjoin
import re

pattern = r'\d+\.'


def get_file_num(file_name):
    if file_name[0] == '.':
        return 0
    return int(re.findall(pattern, file_name)[0][:-1])


def main(src, dst):
    src_dirs = os.listdir(src)
    dst_dirs = os.listdir(dst)
    for dir in src_dirs:
        if dir not in dst_dirs:
            os.rename(pjoin(src, dir), pjoin(dst, dir))
            print('{}/{} -> {}/{}'.format(src, dir, dst, dir))
        else:
            src_files = os.listdir(pjoin(src, dir))
            dst_files = os.listdir(pjoin(dst, dir))
            top_file = sorted(dst_files, key=get_file_num)[-1]
            file_num = get_file_num(top_file) + 1
            for f in src_files:
                if f[0] != '.':
                    new_name = re.sub(pattern, str(file_num) + '.', f)
                    os.rename(pjoin(src, dir, f), pjoin(dst, dir, new_name))
                    print('{}/{}/{} -> {}/{}/{}'.format(
                        src, dir, f, dst, dir, new_name))
                    file_num += 1


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description=
        'Move all files in immediate subdirectories of src into the same \
        directory in dst, while removing possible naming conflicts.\
        Assumes that filenames have a number right before the file extension.\
        Ignores hidden files.')
    parser.add_argument('src')
    parser.add_argument('dst')
    args = parser.parse_args()
    main(args.src, args.dst)
