#!/bin/sh

# -----------------------------------
# Soph Frame Cfg Updater
# -----------------------------------
# Run as a crontab, this will check FRAME_CFG_URL for change of config compared
# to FRAME_CURRENT_CFG. If no change do nothing,
# else grab new photos, untar, and change photo tran time (crontime of sophfrm_photo_change.sh)

SOPHFRM_DIR=/mnt/us/sophfrm
FRAME_CURRENT_CFG=$SOPHFRM_DIR/sophfrm_frame.cfg
FRAME_CFG_URL=http://labs.justabitmatt.com/frame/cfg/frame.cfg

# Check Network Connection
# -----------------------------------
ping -c1 google.com > /dev/null

if [ "$?" -gt 0 ]; then
    echo "Error No Network Connection....."
    exit 1
fi

# Grab Server Config!
# -----------------------------------
# If No Config exists, download cfg and make current
if [ ! -f "$FRAME_CURRENT_CFG" ]; then
   wget -P $SOPHFRM_DIR $FRAME_CFG_URL
   mv $SOPHFRM_DIR/frame.cfg $FRAME_CURRENT_CFG
   CUR_CFG_ID="99999999"
   CUR_CFG_PTIME="99999999"
   CUR_CFG_PTAR="EMPTY"
   NEW_CFG_ID=`grep 'ID' $FRAME_CURRENT_CFG | sed -e 's/<[A-Z0_9_]*>//g' -e 's/<\/[A-Z0-9_]*>//g'`
   NEW_CFG_PTIME=`grep 'PHOTOTIME' $FRAME_CURRENT_CFG | sed -e 's/<[A-Z0_9_]*>//g' -e 's/<\/[A-Z0-9_]*>//g'`
   NEW_CFG_PTAR=`grep 'PHOTOTAR' $FRAME_CURRENT_CFG | sed -e 's/<[A-Z0_9_]*>//g' -e 's/<\/[A-Z0-9_]*>//g'`
else
   CUR_CFG_ID=`grep 'ID' $FRAME_CURRENT_CFG | sed -e 's/<[A-Z0_9_]*>//g' -e 's/<\/[A-Z0-9_]*>//g'`
   CUR_CFG_PTIME=`grep 'PHOTOTIME' $FRAME_CURRENT_CFG | sed -e 's/<[A-Z0_9_]*>//g' -e 's/<\/[A-Z0-9_]*>//g'`
   CUR_CFG_PTAR=`grep 'PHOTOTAR' $FRAME_CURRENT_CFG | sed -e 's/<[A-Z0_9_]*>//g' -e 's/<\/[A-Z0-9_]*>//g'`
   wget -P /mnt/us/sophfrm/ $FRAME_CFG_URL
   NEW_CFG_ID=`grep 'ID' $SOPHFRM_DIR/frame.cfg | sed -e 's/<[A-Z0_9_]*>//g' -e 's/<\/[A-Z0-9_]*>//g'`
   if [ "$CUR_CFG_ID" -eq "$NEW_CFG_ID" ]; then
      echo "No Config Change..."
      if [ -f "$SOPHFRM_DIR/photo_0.png" ]; then
        rm $SOPHFRM_DIR/frame.cfg
        exit 0
      else
        echo " But there seems to be no photos... so treat as new config"
        CUR_CFG_PTAR="EMPTY"
        CUR_CFG_PTIME="9999999"
      fi
   fi
   NEW_CFG_PTIME=`grep 'PHOTOTIME' $SOPHFRM_DIR/frame.cfg | sed -e 's/<[A-Z0_9_]*>//g' -e 's/<\/[A-Z0-9_]*>//g'`
   NEW_CFG_PTAR=`grep 'PHOTOTAR' $SOPHFRM_DIR/frame.cfg | sed -e 's/<[A-Z0_9_]*>//g' -e 's/<\/[A-Z0-9_]*>//g'`
   mv $SOPHFRM_DIR/frame.cfg $FRAME_CURRENT_CFG
fi


#Only Gets here if New Config
#-------------------------------------

# Remove Old Photos, Download New and Untar
if [ "$CUR_CFG_PTAR" != "$NEW_CFG_PTAR" ]; then
   rm $SOPHFRM_DIR/photo_*
   wget -P $SOPHFRM_DIR $NEW_CFG_PTAR
   tar xvzf $SOPHFRM_DIR/*.tar.gz -C $SOPHFRM_DIR
   rm $SOPHFRM_DIR/*.tar.gz
fi

# Change Crontab Photo Tran Time
if [ "$CUR_CFG_PTIME" -ne "$NEW_CFG_PTIME" ]; then
   NEWTIME=$(echo $NEW_CFG_PTIME | sed 's/^0*//')
  # head -n 7 /etc/crontab/root > /etc/crontab/root
  # if [ "$NEWTIME" -gt "1" ]; then
 #     echo "*/$NEWTIME * * * * /bin/sh /mnt/us/sophfrm_pho_upd.sh" >> /etc/crontab/root
 #  else
 #     echo "* * * * * /bin/sh /mnt/us/sophfrm_pho_upd.sh" >> /etc/crontab/root
 #  fi
 #  /etc/init.d/cron restart
fi

