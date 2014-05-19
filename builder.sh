
#!/bin/sh
#titanium clean
#alloy compile --config platform=android
BuildApp="$2"
DeviceIP="$1"
if [ -z "$DeviceIP" ]; then
    DeviceIP=1
fi
if [ "$BuildApp" = "l" ]; then
    #show the console information
    if [ "$DeviceIP" = "d" ]; then
        ruby /Volumes/SourceCodes/adb-logcat-color.rb -s LG-V500-09ad910a58d166c7;
    else
        ruby /Volumes/SourceCodes/adb-logcat-color.rb -s 192.168.56.10$DeviceIP:5555;
    fi
else
    if [ "$BuildApp" = "b" ]; then
        titanium build --platform android --sdk 3.2.0.GA --build-only;
    elif [ "$BuildApp" = "cb" ]; then
        titanium clean;
        titanium build --platform android --sdk 3.2.0.GA --build-only;
    fi

    if [ "$DeviceIP" = "d" ]; then
        adb -s LG-V500-09ad910a58d166c7 install -r build/android/bin/ChariTi-CB.apk
        adb -s LG-V500-09ad910a58d166c7 shell am start -a android.intent.action.MAIN -n com.chariti.mobile/.CharitiCbActivity
    else
        #adb install -r build/android/bin/app.apk
        adb -s 192.168.56.10$DeviceIP:5555 install -r build/android/bin/ChariTi-CB.apk
        adb -s 192.168.56.10$DeviceIP:5555 shell am start -a android.intent.action.MAIN -n com.chariti.mobile/.CharitiCbActivity
    fi
fi