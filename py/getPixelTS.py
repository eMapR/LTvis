# -*- coding: utf-8 -*-
"""
Created on Mon Jun 25 19:57:51 2018

@author: braatenj
"""

import subprocess
import sys
import json


def main(inRaster, x, y):
  x = str(x) #
  y = str(y) #
  #cmd = 'C:/Users/braatenj/Anaconda2/Library/bin/gdallocationinfo -valonly -wgs84'+' '+'C:/xampp/htdocs/ltviz/data/WAORCA_biomass_crm_mean.tif'+' '+x+' '+y
  cmd = '/usr/lib/anaconda3/bin/gdallocationinfo --config GDAL_DATA /usr/lib/anaconda3/share/gdal -valonly -wgs84'+' '+inRaster+' '+x+' '+y
  #subprocess.call(cmd, shell=True)
  
  proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, shell=True)
  output = [int(v) for v in proc.stdout.read().splitlines()]
  #year = range(1984,2017)
  #year = [1984,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017]
  #print (x,y,inRaster, cmd, output)
  print (json.dumps({"ts":output, "yr":[1984,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017]}))


if __name__ == "__main__":  
  args = sys.argv    
  inRaster = args[1]
  x = args[2]
  y = args[3]

  main(inRaster, x, y)
