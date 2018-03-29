#!/bin/sh
OLDPATH=$PATH
WHEREAMI=`pwd`
export PATH=$WHEREAMI/node/bin:"$PATH"
NODEINST=`which node`
BROWSERIFY=node_modules/browserify/bin/cmd.js
MINIFY=node_modules/minifier/index.js
UGLIFY=node_modules/uglify-es/bin/uglifyjs
CSSMIN=node_modules/cssmin/bin/cssmin

OUTPATH=../hybridd-public

echo "Creating hybridd release..."
echo ""

mkdir $OUTPATH
cp hybridd $OUTPATH/

mkdir -p $OUTPATH/lib/crypto
$UGLIFY lib/crypto/bignumber.js > $OUTPATH/lib/crypto/bignumber.js
$UGLIFY lib/crypto/decimal-light.js > $OUTPATH/lib/crypto/decimal-light.js
$UGLIFY lib/crypto/hashDJB2.js > $OUTPATH/lib/crypto/hashDJB2.js
$UGLIFY lib/crypto/hex2base32.js > $OUTPATH/lib/crypto/hex2base32.js
$UGLIFY lib/crypto/hex2dec.js > $OUTPATH/lib/crypto/hex2dec.js
$UGLIFY lib/crypto/lz-string.js > $OUTPATH/lib/crypto/lz-string.js
$UGLIFY lib/crypto/nacl.js > $OUTPATH/lib/crypto/nacl.js
$UGLIFY lib/crypto/proof.js > $OUTPATH/lib/crypto/proof.js
$UGLIFY lib/crypto/sjcl.js > $OUTPATH/lib/crypto/sjcl.js
$UGLIFY lib/crypto/urlbase64.js > $OUTPATH/lib/crypto/urlbase64.js

# /lib
$UGLIFY lib/APIqueue.js > $OUTPATH/lib/APIqueue.js
$UGLIFY lib/cache.js > $OUTPATH/lib/cache.js
$UGLIFY lib/conf.js > $OUTPATH/lib/conf.js
$UGLIFY lib/functions.js > $OUTPATH/lib/functions.js
$MINIFY lib/globals.js --output $OUTPATH/lib/globals.js
$UGLIFY lib/hcmd.js > $OUTPATH/lib/hcmd.js
$UGLIFY lib/hybridd.js > $OUTPATH/lib/hybridd.js
$UGLIFY lib/ini.js > $OUTPATH/lib/ini.js
$UGLIFY lib/main.js > $OUTPATH/lib/main.js
$UGLIFY lib/modules.js > $OUTPATH/lib/modules.js
$UGLIFY lib/naclFactory.js > $OUTPATH/lib/naclFactory.js
$UGLIFY lib/prototypes.js > $OUTPATH/lib/prototypes.js
$UGLIFY lib/recipes.js > $OUTPATH/lib/recipes.js
$UGLIFY lib/rest.js > $OUTPATH/lib/rest.js
$UGLIFY lib/router.js > $OUTPATH/lib/router.js
$UGLIFY lib/scheduler.js > $OUTPATH/lib/scheduler.js
$UGLIFY lib/servers.js > $OUTPATH/lib/servers.js
$MINIFY lib/storage.js --output $OUTPATH/lib/storage.js

mkdir -p $OUTPATH/lib/router
$UGLIFY lib/router/asset.js > $OUTPATH/lib/router/asset.js
$UGLIFY lib/router/command.js > $OUTPATH/lib/router/command.js
$UGLIFY lib/router/help.js > $OUTPATH/lib/router/help.js
$UGLIFY lib/router/list.js > $OUTPATH/lib/router/list.js
$UGLIFY lib/router/network.js > $OUTPATH/lib/router/network.js
$UGLIFY lib/router/proc.js > $OUTPATH/lib/router/proc.js
cp lib/router/routetree.json $OUTPATH/lib/router/routetree.json
$UGLIFY lib/router/source.js > $OUTPATH/lib/router/source.js
$UGLIFY lib/router/view.js > $OUTPATH/lib/router/view.js
$UGLIFY lib/router/xauth.js > $OUTPATH/lib/router/xauth.js

#cp lib/asset.js $OUTPATH/lib/asset.js
#cp lib/source.js $OUTPATH/lib/source.js
#cp lib/modules.js $OUTPATH/lib/modules.js

mkdir -p $OUTPATH/lib/scheduler
$UGLIFY lib/scheduler/quartz.js > $OUTPATH/lib/scheduler/quartz.js



mkdir -p $OUTPATH/modules
cp -R modules/blockexplorer $OUTPATH/modules/
cp -R modules/deterministic $OUTPATH/modules/
cp -R modules/storage $OUTPATH/modules/
cp -R modules/quartz $OUTPATH/modules/

cp -R modules/ethereum $OUTPATH/modules/
cp -R modules/lisk $OUTPATH/modules/
cp -R modules/nxt $OUTPATH/modules/

cp -R scripts $OUTPATH/

cp -R recipes $OUTPATH/

mkdir -p $OUTPATH/views/index
cp views/compileviews.sh $OUTPATH/views/compileviews.sh
cp views/*.html $OUTPATH/views/
cp views/index/main.js $OUTPATH/views/index/
cp views/index/jquery-1.12.4.min.js $OUTPATH/views/index
#cp views/index/snow.js $OUTPATH/views/index
$UGLIFY views/index/hy_connect.js > $OUTPATH/views/index/hy_connect.js

mkdir -p $OUTPATH/views/interface/js
cp -R views/files $OUTPATH/views/

cp views/favicon.ico $OUTPATH/views/
cp views/interface/main.js $OUTPATH/views/interface/
cp views/interface/*.html $OUTPATH/views/interface/
$UGLIFY views/interface/interface.js > $OUTPATH/views/interface/interface.js
$UGLIFY views/interface/js/clipboard.js > $OUTPATH/views/interface/js/clipboard.js
$UGLIFY views/interface/js/globalobjects.js > $OUTPATH/views/interface/js/globalobjects.js
$UGLIFY views/interface/js/hybriddcall.js > $OUTPATH/views/interface/js/hybriddcall.js
$UGLIFY views/interface/js/modal.js > $OUTPATH/views/interface/js/modal.js
$UGLIFY views/interface/js/qrcode.js > $OUTPATH/views/interface/js/qrcode.js
$UGLIFY views/interface/js/sha256.js > $OUTPATH/views/interface/js/sha256.js
$UGLIFY views/interface/js/storage.js > $OUTPATH/views/interface/js/storage.js
$UGLIFY views/interface/js/topmenu.js > $OUTPATH/views/interface/js/topmenu.js
$UGLIFY views/interface/js/topmenuset.js > $OUTPATH/views/interface/js/topmenuset.js
$UGLIFY views/interface/js/transaction.js > $OUTPATH/views/interface/js/transaction.js

mkdir -p $OUTPATH/views/interface/css
$CSSMIN views/interface/css/modal.css > $OUTPATH/views/interface/css/modal.css
$CSSMIN views/interface/css/spinner.css > $OUTPATH/views/interface/css/spinner.css
$CSSMIN views/interface/css/base.css > $OUTPATH/views/interface/css/base.css
$CSSMIN views/interface/css/600up.css > $OUTPATH/views/interface/css/600up.css
$CSSMIN views/interface/css/900up.css > $OUTPATH/views/interface/css/900up.css
$CSSMIN views/interface/css/1200up.css > $OUTPATH/views/interface/css/1200up.css
$CSSMIN views/interface/css/1800up.css > $OUTPATH/views/interface/css/1800up.css

mkdir -p $OUTPATH/views/interface/svg
cp views/interface/svg/*.svg $OUTPATH/views/interface/svg/

mkdir -p $OUTPATH/views/interface.assets
cp views/interface.assets/main.js $OUTPATH/views/interface.assets/
cp views/interface.assets/*.html $OUTPATH/views/interface.assets/
$UGLIFY views/interface.assets/interface.assets.js > $OUTPATH/views/interface.assets/interface.assets.js
$UGLIFY views/interface.assets/interface.assets.ui.js > $OUTPATH/views/interface.assets/interface.assets.ui.js

mkdir -p $OUTPATH/views/interface.dashboard
cp views/interface.dashboard/main.js $OUTPATH/views/interface.dashboard/
cp views/interface.dashboard/*.html $OUTPATH/views/interface.dashboard/
$UGLIFY views/interface.dashboard/interface.dashboard.js > $OUTPATH/views/interface.dashboard/interface.dashboard.js
$UGLIFY views/interface.dashboard/interface.dashboard.ui.js > $OUTPATH/views/interface.dashboard/interface.dashboard.ui.js

mkdir -p $OUTPATH/views/login/js
cp views/login/*.html $OUTPATH/views/login/
cp views/login/main.js $OUTPATH/views/login/
$UGLIFY views/login/login.js > $OUTPATH/views/login/login.js
$UGLIFY views/login/login.ui.js > $OUTPATH/views/login/login.ui.js
cp views/login/js/globals.js $OUTPATH/views/login/js/
$UGLIFY views/login/js/custom-alert.min.js > $OUTPATH/views/login/js/custom-alert.min.js
$UGLIFY views/login/js/newaccount_A.js > $OUTPATH/views/login/js/newaccount_A.js
$UGLIFY views/login/js/newaccount_B.js > $OUTPATH/views/login/js/newaccount_B.js

mkdir -p $OUTPATH/views/login/css
$CSSMIN views/login/css/pure-min.css > $OUTPATH/views/login/css/pure-min.css
$CSSMIN views/login/css/custom-alert.css > $OUTPATH/views/login/css/custom-alert.css
$CSSMIN views/login/css/buttons.css > $OUTPATH/views/login/css/buttons.css
$CSSMIN views/login/css/login.css > $OUTPATH/views/login/css/login.css

cd $OUTPATH/views
./compileviews.sh
cd -

echo "Release created in ../hybridd-public"
echo ""
echo "Make sure you have a proper hybridd.conf, node binaries, and the necessary node modules."
