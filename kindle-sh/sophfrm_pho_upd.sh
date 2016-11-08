#!/bin/sh

SOPHFRM_DIR=/mnt/us/sophfrm

PNUM=`ls $SOPHFRM_DIR | grep photo_ | wc -l`
RAND_PIND=`awk -v min=0 -v max=$PNUM 'BEGIN{srand(); print int(min+rand()*(max-min))}'`
eips -g $SOPHFRM_DIR/photo_$RAND_PIND.png
