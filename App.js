/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
  FlatList,
  Image,
} from 'react-native';

import { Container, Tabs, Tab, Icon, TabHeading, ScrollableTab } from 'native-base';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import images from './resources';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;
const iOS = Platform.OS === 'ios';
const STATUS_BAR_HEIGHT = StatusBar.currentHeight;
const NAV_BAR_HEIGHT = iOS ? 60 + 20 : 60;
const HEADER_HEIGHT = 200;
const SCROLLABLE_TAB_HEIGHT = 40;
const COLLAPSE_HEIGHT = HEADER_HEIGHT - NAV_BAR_HEIGHT;

export default class App extends Component {

  tabsContent = [{
    title: 'tab1',
    data: [
      'row data',
      'row data',
      'row data',
      'row data',
      'row data',
      'row data',
      'row data',
      'row data',
      'row data',
      'row data',
      'row data',
      'row data',
      'row data',
      'row data',
    ]
  }, {
    title: 'tab2',
    data: [
      'row data',
      'row data',
      'row data',
      'row data',
      'row data',
      'row data',
    ]
  }, {
    title: 'tab3',
    data: [
      'row data',
      'row data',
      'row data',
      'row data',
      'row data',
      'row data',
    ]
  }, {
    title: 'tab4',
    data: []
  }];

  listOffsetY;
  listRefArr = [];
  tableIndex = 0;
  listFixedHeight = 0;

  constructor(props) {
    super(props);

    this.listOffsetY = new Animated.Value(0);
    this.listOffsetY.addListener((data) => {
      if (data.value >= COLLAPSE_HEIGHT) {
        this.listFixedHeight = COLLAPSE_HEIGHT + 1;
      } else if (data.value < 0) {
        this.listFixedHeight = 0;
      } else {
        this.listFixedHeight = data.value;
      }
    })
  }

  getCollapseHeight() {
    return this.listOffsetY.interpolate({
      inputRange: [-1, 0, COLLAPSE_HEIGHT, COLLAPSE_HEIGHT + 1],
      outputRange: [0, 0, - COLLAPSE_HEIGHT, - COLLAPSE_HEIGHT],
    });;
  }

  renderCollapseHeader() {
    return (
      <Animated.View
        style={{
          transform: [{
            translateY: this.getCollapseHeight()
          }],
          height: 200,
          width: WINDOW_WIDTH,
          position: 'absolute',
          top: 0,
        }}
      >
        <Image
          style={{ width: WINDOW_WIDTH, height: 200 }}
          source={images.bg_header}
        />
      </Animated.View>
    )
  }

  renderItem({ item, index }) {
    return (
      <View
        key={`${item}-${index}`}
        style={{ height: 100 , padding: 15, justifyContent: 'center', backgroundColor: 'grey' }}
      >
        <Text>{item}</Text>
      </View>
    )
  }

  getTabsOffsetY() {
    return this.listOffsetY.interpolate({
      inputRange: [-1, 0, COLLAPSE_HEIGHT, COLLAPSE_HEIGHT + 1],
      outputRange: [COLLAPSE_HEIGHT, COLLAPSE_HEIGHT, 0, 0],
    })
  }

  onScrollEnd() {
    this.listRefArr.forEach((item) => {
      console.log('---------index', item.key, this.tableIndex);
      if (item.key === this.tableIndex) return;
      if (item.value) {
        console.log('-----------scroll to', this.listFixedHeight);
        item.value.getNode().scrollToOffset({ offset: this.listFixedHeight, animated: false });
      }
    })
  }

  renderTables() {
    return (
      <Tabs
        style={{
          marginTop: NAV_BAR_HEIGHT
        }}
        onChangeTab={({ i }) => {
          this.tableIndex = i;
        }}
        renderTabBar={(props) =>
          <Animated.View
            style={{
              zIndex: 1,
              transform: [{ translateY: this.getTabsOffsetY() }],
            }}
          >
            <ScrollableTab
              {...props}
              underlineStyle={{ backgroundColor: '#E62117', height: 2 }}
              style={{
                height: SCROLLABLE_TAB_HEIGHT,
              }}
            />
          </Animated.View>
        }
      >
        {this.tabsContent.map((content, index) =>
          <Tab
            key={`${index}`}
            heading={
              <TabHeading
                style={{ backgroundColor: '#ffffff', width: WINDOW_WIDTH / 3 }}
              >
                <Text>{content.title}</Text>
              </TabHeading>
            }
          >
            <Animated.FlatList
              ref={(comp) => {
                if (comp) {
                  this.listRefArr.push({
                    key: index,
                    value: comp,
                  });
                  setTimeout(() => {
                    comp.getNode().scrollToOffset({ offset: this.listFixedHeight, animated: false });
                  });
                }
              }}
              data={content.data}
              renderItem={this.renderItem.bind(this)}
              scrollEventThrottle={16}
              onScrollEndDrag={this.onScrollEnd.bind(this)}
              onMomentumScrollEnd={this.onScrollEnd.bind(this)}
              onScroll={Animated.event(
                [{nativeEvent: {contentOffset: {y: this.listOffsetY}}}],
                { useNativeDriver: true },
              )}
              style={{
                height: WINDOW_HEIGHT - HEADER_HEIGHT - SCROLLABLE_TAB_HEIGHT + COLLAPSE_HEIGHT
              }}
              contentContainerStyle={{
                paddingTop: COLLAPSE_HEIGHT,
                minHeight: WINDOW_HEIGHT - HEADER_HEIGHT - SCROLLABLE_TAB_HEIGHT  + 2 * COLLAPSE_HEIGHT + 1,
              }}
            />
          </Tab>)}
      </Tabs>
    )
  }

  getNavBarColor() {
    return this.listOffsetY.interpolate({
      inputRange: [-1, 0, COLLAPSE_HEIGHT, COLLAPSE_HEIGHT + 1],
      outputRange: [0, 0, 1, 1]
    })
  }

  renderNavBar() {
    return (
      <View
        style={{
          position: 'absolute',
          flexDirection: 'row',
          paddingTop: iOS ? 20 : 0,
          height: NAV_BAR_HEIGHT,
          width: WINDOW_WIDTH,
          alignItems: 'center',
          paddingHorizontal: 15,
        }}
      >
        <Animated.View
          style={{
            position: 'absolute',
            width: WINDOW_WIDTH,
            height: NAV_BAR_HEIGHT,
            backgroundColor: '#ffffff',
            opacity: this.getNavBarColor()
          }}
        />
        <Icon name={'arrow-back'} />
        <Text style={{ marginLeft: 15 }}>Coordinator example</Text>
      </View>
    )
  }

  render() {
    return (
      <Container>
        {this.renderTables()}
        {this.renderCollapseHeader()}
        {this.renderNavBar()}
      </Container>
    );
  }
};



const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});
