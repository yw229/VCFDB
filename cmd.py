#!/data/NYGC/software/python/bin/python2.7 
import glob
import os
import subprocess

from subprocess import call
        #call(["ls", "-l"])
#cmdDir = r'/nethome/pipeline/util/delivery/delivery.py' 
cmdDir = '/nethome/pipeline/util/delivery/delivery.py'
#call(["cat" + cmdDir]) 
pid = subprocess.Popen(['cat']+ glob.glob(cmdDir)) ;
