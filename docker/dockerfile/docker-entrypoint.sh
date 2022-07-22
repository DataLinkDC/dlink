#!/bin/bash
java -jar -Dloader.path=/opt/dinky/lib,/opt/dinky/plugins -Ddruid.mysql.usePingMethod=false -Xms512M -Xmx2048M -XX:PermSize=512M -XX:MaxPermSize=1024M /opt/dinky/dlink-admin-*.jar
