# -*- coding: utf-8 -*-
"""
Created on Fri Jul  6 00:21:03 2018

@author: braatenj
"""

import subprocess
import os
import fnmatch
import sys

def make_vrt(inputFiles, vrtFile):
  inputListFile = vrtFile.replace('.vrt', '_filelist.txt')
  inputList = open(inputListFile, 'w')
  for inputFile in inputFiles:
    inputList.write(inputFile+'\n')
  inputList.close()
  
  # create vrt
  cmd = 'gdalbuildvrt -separate -input_file_list '+inputListFile+' '+vrtFile
  subprocess.call(cmd, shell=True)


def main(searchDir, outDir):  
  files = []  
  for root, dirnames, filenames in os.walk(searchDir):
    for filename in fnmatch.filter(filenames, '*.tif'):
      files.append(os.path.join(root, filename))
  
  files.sort()
  vrtFile = outDir+'default.vrt'
  make_vrt(files, vrtFile)

if __name__ == "__main__":	
  searchDir = sys.argv[1]
  outDir = sys.argv[2]
  main(searchDir, outDir)