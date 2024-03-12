# -*- coding: utf-8 -*-
"""
Created on Fri Aug 17 09:30:06 2018

@author: braatenj
"""

from osgeo import gdal, ogr
import os
import sys
import json
import sqlite3
import datetime
import subprocess
import zipfile
import smtplib


class Requests:

    def __init__(self,inpost, conn_path="/data/visDataRequests/visDataRequests.db", metadata_path='/data/maps/visdata_metadata.json'):
        self.conn_path = conn_path
        self.metadata_path = metadata_path

        with open(self.metadata_path, "r") as f:
                self.metadata = json.load(f)


        # Connect to the SQLite database
        self.conn = sqlite3.connect(conn_path)
        self.cur = self.conn.cursor()

        # Get the last request ID and calculate the next one
        self.cur.execute("SELECT id FROM requests ORDER BY id DESC LIMIT 1")
        last_id = self.cur.fetchone()
        self.next_id = (last_id[0] + 1) if last_id else 1

        self.name = str(self.next_id).rjust(6, '0')
        self.requests_dir = "/data/visDataRequests"
        self.request_dir = os.path.join(self.requests_dir,self.name)

        if not os.path.isdir(self.request_dir):
            os.mkdir(self.request_dir)
            os.chmod(self.request_dir, 0o777)

        self.symlinkDir = os.path.join('/var/www/emapr/pages/data/viz/requests',self.name)
        if not os.path.isdir(self.symlinkDir):
                os.makedirs(self.symlinkDir)


        # Initialize messages list
        self.messages = []

	# Initialize extent list
        self.extList = []
        self.zipFiles = []
        p = json.loads(inpost)
        self.in_poly = p['polyPath']
        self.key = p['polyKey']
        self.ARD_tiles = p['polyValue']
        self.dataset_names = p['data']
        self.email = p['email']

	# init
        self.src = None


    def get_request_info(self):
        print(self.__dict__)
        return 0

    def save_metadata(self):
        # You might need to implement this method based on your requirements
        # For now, it just returns the metadata path provided during initialization.
        return self.metadata_path


    #def getRasterBounds(rasterFile):
    #    src = gdal.Open(rasterFile)
    #    ulx, xres, xskew, uly, yskew, yres  = src.GetGeoTransform()
    #    sizeX = src.RasterXSize
    #    sizeY = src.RasterYSize
    #    lrx = ulx + (sizeX * xres)
    #    lry = uly + (sizeY * yres)
    #    return [ulx,uly,lrx,lry]

    #def isInData(ext, dataFile):
    #    
    #    extR = getRasterBounds(dataFile)
    #    t1 = int(ext[0]>extR[2])
    #    t2 = int(ext[2]<extR[0])
    #    t3 = int(ext[1]<extR[3])
    #    t4 = int(ext[3]>extR[1])
    #    return (t1+t2+t3+t4) == 0

    def sendEmail(self, zipFiles, email):
        zipFiles = '\ ,\ '.join([z for z in zipFiles])
        body = 'Your\ eMapR\ data\ request\ is\ ready.\ If\ the\ link\ does\ not\ work\ try\ coping\ and\ pasting\ it\ into\ the\ address\ bar.\ '+zipFiles+'\ The\ data\ will\ be\ available\ for\ one\ week.\ Please\ contact\ Peter\ Clary\ at\ clarype@oregonstate.edu\ for\ assistance\ with\ questions\ or\ problems.\ Best\ regards,\ eMapR\ Lab\ Group'
        cmd = 'php /var/www/emapr/pages/data/viz/php/sendEmail.php '+email+' '+ body
        subprocess.run(cmd, shell=True, stdout=subprocess.PIPE)
        return 0 



    def writeMetaData(fileName, year):
        #print(fileName)
        cmd = '/usr/lib/anaconda/bin/gdalinfo '+fileName
        p = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)        
        output, err = p.communicate()
        lines = output.splitlines()       # change from output.split('\n') to output.splitlines() to 
        for i, line in enumerate(lines):
                if line[0:6] == 'Files:':
                        lines[i] = 'Files: '+os.path.basename(fileName)
                if line[0:4] == 'Band':
                        l = lines[i+1]+'\n  Year='+str(year)
                        lines[i+1] = l
                        year += 1
                
        outMeta = fileName.replace('.tif', '_meta.txt')  
        meta = '\n'.join(lines)
        with open(outMeta, "w") as metaObj:
                metaObj.write(meta)
        
        return outMeta

    def open_geojson_file(self):
        driver = ogr.GetDriverByName("GeoJSON")
        src = driver.Open(self.in_poly, 0)  # 0 means read-only mode

        if src is None:
            self.messages.append('Could not open the polygon file that defines the region to download')
            return None
        else:
            self.messages.append('Opened the polygon file that defines the region to download')
            self.src = src
            return None


    def get_cutter_extent(self):
        for i in self.ARD_tiles:
            layer = self.src.GetLayer()
            query = "{}='{}'".format(self.key, i)

            layer.SetAttributeFilter(query)
            feature_count = layer.GetFeatureCount()

            if feature_count == 0:
                self.messages.append('There are no features in the polygon file matching the request')
                return
            elif feature_count > 1:
                self.messages.append('There are more than one feature in the polygon file matching the request')
                return
            elif feature_count == 1:
                self.messages.append('Found a feature in the polygon file matching the request')

            feature = layer.GetNextFeature()
            geom = feature.GetGeometryRef()
            ext = geom.GetEnvelope()
            ext = [ext[0], ext[3], ext[1], ext[2]]
            self.extList.append(ext)

    def send_data_links_email(self):
        # Forming the data links
        self.zipFiles = [os.path.join('http://emapr.ceoas.oregonstate.edu/pages/data/viz/requests', self.name, z) for z in self.zipFiles]

        # Sending the email
        self.sendEmail(self.zipFiles, self.email)


    def make_database_entry(self, out_poly):
    
        # Read the GeoJSON file
        with open(out_poly, "r") as f:
            geojson = json.load(f)

        # Get the current date
        date = datetime.datetime.now().date()
        date_str = date.strftime("%Y-%m-%d")

        # SQL query to insert into the 'requests' table
        sql = '''INSERT INTO requests (id, name, date, data, aoi, email) VALUES(?,?,?,?,?,?)'''
    
        # Tuple containing values for the SQL query
        request_info = (self.next_id, self.name, date_str, ','.join(self.dataset_names), str(geojson), self.email)

        # Execute the SQL query and commit the changes to the database
        self.cur.execute(sql, request_info)
        self.conn.commit()


def main(post):

        requests_instance = Requests(post)
        requests_instance.open_geojson_file()
        requests_instance.get_cutter_extent()
        
        for dataId in requests_instance.dataset_names:         # loops over the user select datasets
                for w, b in zip(requests_instance.ARD_tiles, requests_instance.extList):               # loops through each tile/extent 'w' is the tile and 'b' is the extent
                        for thisData in requests_instance.metadata:              # loops throught the datasets in the metadata
                                if thisData['id'] == dataId:   # if the selected datasets match the one of the metadata's datasets 
                                        break                  # stops the loop so the code blocks below can operate on 'thisData'
                        
                        outBase = '{}_{}_{}.tif'.format(thisData['dataName'], requests_instance.key, str(w)) # w is the value
                        # make out data file
                        outData = os.path.join(requests_instance.request_dir,outBase)      
                        outPoly = outData.replace('.tif','.geojson')
                        
                        # make command to make ARD tile polygon
                        cmd = "/usr/lib/anaconda3/bin/ogr2ogr --config GDAL_DATA /usr/lib/anaconda3/share/gdal -q -f \"GeoJSON\" -where \""+requests_instance.key+"='"+w+"'\" "+outPoly+" "+requests_instance.in_poly # w is the tile value
                        status = subprocess.call(cmd, shell=True) # need to use shell=True because it is a full string that is being passed, if we don;t want shell=True, then we need to split the arguments
                        
                        # clips imagery to ARD tile
                        projwin = '-projwin {} {} {} {}'.format(b[0], b[1], b[2], b[3]) #ext[0], ext[3], ext[1], ext[2] b is the extent
                        cmd = '/usr/lib/anaconda3/bin/gdal_translate --config GDAL_DATA /usr/lib/anaconda/share/gdal -q '+projwin+' '+thisData['dataPath']+' '+outData
                        status = subprocess.call(cmd, shell=True)
                        
                         
                        # compress the file- TODO add metadata to the zip file
                        if os.path.exists(outData):
                                outZip = outData.replace('.tif', '.zip')
        
                                # make some metadata
                                #outMeta = writeMetaData(outData, thisData['minYear'])
                                
                                # zip the files
                                zout = zipfile.ZipFile(outZip, "w", zipfile.ZIP_DEFLATED)
                                zout.write(outData, arcname=outBase)
                                #zout.write(outMeta, arcname=os.path.basename(outMeta))
                                zout.close()
                                
                                # delete the original
                                os.remove(outData)
                                #os.remove(outMeta)
                                
                                # make a symlink to the data for download
                                outZipBase = os.path.basename(outZip)
                                requests_instance.zipFiles.append(outZipBase)
                                os.symlink(outZip, os.path.join(requests_instance.symlinkDir,outZipBase))
                                
                        else:
                                return 'Error: data subset was not created'
                        
        requests_instance.send_data_links_email()

        requests_instance.make_database_entry(outPoly)

                
if __name__ == "__main__":  
        args = sys.argv    
        post = args[1]
        #print(post)
        #post = '{"data": ["lt-stem_forest_canopy_cover_nlcd_v0.1_mean"],"email": "clarype@oregonstate.edu","polyKey": "ARD_tile","polyPath": "/data/vectors/vis/conus_ard_grid_epsg5070.geojson","polyValue": ["h04v01"]}'

        main(post)
        

