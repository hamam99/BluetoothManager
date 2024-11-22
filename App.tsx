/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Button,
  FlatList,
  PermissionsAndroid,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import RNBluetoothClassic, {
  BluetoothDevice,
} from 'react-native-bluetooth-classic';

function App(): React.JSX.Element {
  const [unpairedDevices, setUnpairedDevices] = React.useState<
    BluetoothDevice[]
  >([]);

  const [pairedDevices, setPairedDevices] = React.useState<BluetoothDevice[]>(
    [],
  );

  const [connectedDevices, setConnectedDevices] =
    React.useState<BluetoothDevice[]>();

  const onScanUnpaired = () => {
    RNBluetoothClassic.startDiscovery()
      .then(devices => {
        console.log(devices);
        setUnpairedDevices(devices);
      })
      .catch(error => {
        console.log('onScanUnpaired err', {error});
      });
  };

  const onScanPaired = async () => {
    try {
      const connected = await RNBluetoothClassic.getBondedDevices();
      setPairedDevices(connected);
    } catch (err) {
      console.log('onScanPaired err', {err});
      // Error if Bluetooth is not enabled
      // Or there are any issues requesting paired devices
    }
  };

  const requestAccessFineLocationPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Access fine location required for discovery',
        message:
          'In order to perform discovery, you must enable/allow ' +
          'fine location access.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const getConnectedDevice = async () => {
    try {
      const connected = await RNBluetoothClassic.getConnectedDevices();
      setConnectedDevices(connected);
      console.log('getConnectedDevice', connected);
    } catch (err) {
      console.log('getConnectedDevice err', {err});
      // Error if Bluetooth is not enabled
      // Or there are any issues requesting paired devices
    }
  };

  useEffect(() => {
    requestAccessFineLocationPermission();
  }, []);

  return (
    <SafeAreaView style={{}}>
      <Button title="Scan Connected Device" onPress={getConnectedDevice} />
      <FlatList
        data={connectedDevices}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                RNBluetoothClassic.disconnectFromDevice(item?.address)
                  .then(device => {
                    console.log('device', device);
                    getConnectedDevice();
                  })
                  .catch(error => {
                    console.error(error);
                  });
              }}
              style={{
                height: 36,
                width: '100%',
                justifyContent: 'center',
              }}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />

      <Button title="Scan Unpaired Device" onPress={onScanUnpaired} />
      <FlatList
        data={unpairedDevices}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                RNBluetoothClassic.pairDevice(item?.address)
                  .then(device => {
                    console.log('device', device);
                    onScanPaired();
                    onScanUnpaired();
                  })
                  .catch(error => {
                    console.error(error);
                  });
              }}
              style={{
                height: 36,
                width: '100%',
                justifyContent: 'center',
              }}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />
      <Button title="Paired Device" onPress={onScanPaired} />
      <FlatList
        data={pairedDevices}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                RNBluetoothClassic.connectToDevice(item?.address)
                  .then(device => {
                    console.log('device', device);
                    // setConnectedDevices(device);
                  })
                  .catch(error => {
                    console.error(error);
                  });
              }}
              style={{
                height: 36,
                width: '100%',
                justifyContent: 'center',
              }}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

export default App;
