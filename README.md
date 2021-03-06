# csce656_final_project

## Final project "Share your story"

### Team members

- Ivan Fuentes
- Roger Solis


### Installation

- Install mongodb (For cloud9 https://community.c9.io/t/setting-up-mongodb/1717)
- (Deprecated, not anymore) Install pymongo for python (For cloud9 python dependencies https://community.c9.io/t/installing-python-packages/1611)
- Install Flask for python
- Install Flask-PyMongo for python https://flask-pymongo.readthedocs.io/en/latest/
- Install flask restfull framework sudo easy_install flask-restful
- Install Cross origin libraries sudo easy_install -U flask-cors
- Install ffmpeg video editor following the instructions in https://www.emmecilab.net/installare-ffmpeg-su-cloud9/
- Changed apache2 config file to point to our front-end folder: sudo nano /etc/apache2/sites-enabled/001-cloud9.conf
- Also added this configuration information to apache2 config file to serve static files for uploaded videos

== IMPORTANT CONFIGURATION FOR STATIC FILES ==

</Directory>
   Alias /uploads "/home/ubuntu/workspace/csce656_final_project/back-end/uploads"
   <Directory "/home/ubuntu/workspace/csce656_final_project/back-end/uploads">
   AllowOverride None
   Order allow,deny
   Allow from all
</Directory>

### Run

- Run mongo: First, make sure you are at the workspace main directory and that you can see the executable mongod. Then execute ./mongod in a terminal
- Run the back-end: python api.py (When changes are made to the file, the server restasts automatically)
- Run the front-end: sudo service apache2 start (if not already running)
-

When the machine is suthed down by cloud9. Both mongodb and apache2 servers might en up having an inconsistent state preventing us from furter server run.
To solve it on mongo: Run mongo as ./mongod --repair
To solve it on apache2: Remove the file sudo rm /home/ubuntu/lib/apache2/run/apache2.pid

### Notes

- For server and ports configuration https://docs.c9.io/docs/run-an-application (we only have open the ports 8080,8081,8082)
- The public url: http://csce656-newmedia-rochosc.c9users.io/
- Ports 8080 html, 8081 rest api
- If running the front-end locally, it may be necessarily to use an HTTP server to avoid cross origin errors.
  To do so, simply place the project under an apache2, wamp, xampp, etc servers folder.
  Or, as a simpler way in terminal just cd to front-end directory then run
  python -m SimpleHTTPServer 8000
  will run in localhost:8000
