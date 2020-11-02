import React, { PureComponent } from 'react';
import {  View, Text } from 'react-native';
import NTMapView from './view/NTMapView';

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style = {{flex:1}}>
        <NTMapView />
      </View>
    );
  }
}
