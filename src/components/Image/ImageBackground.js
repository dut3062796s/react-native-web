/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */
import ensureComponentIsNative from '../Touchable/ensureComponentIsNative';
import Image from './';
import StyleSheet from '../../apis/StyleSheet';
import View from '../View';
import ViewPropTypes from '../View/ViewPropTypes';
import React, { Component } from 'react';

const emptyObject = {};

/**
 * Very simple drop-in replacement for <Image> which supports nesting views.
 */
class ImageBackground extends Component<*> {
  static propTypes = {
    ...Image.propTypes,
    imageStyle: Image.propTypes.style,
    style: ViewPropTypes.style
  };

  static defaultProps = {
    style: emptyObject
  };

  setNativeProps(props: Object) {
    // Work-around flow
    const viewRef = this._viewRef;
    if (viewRef) {
      ensureComponentIsNative(viewRef);
      viewRef.setNativeProps(props);
    }
  }

  _viewRef: ?View = null;

  _captureRef = (ref: View) => {
    this._viewRef = ref;
  };

  render() {
    const { children, style, imageStyle, imageRef, ...props } = this.props;

    return (
      <View ref={this._captureRef} style={style}>
        <Image
          {...props}
          ref={imageRef}
          style={[
            StyleSheet.absoluteFill,
            {
              // Temporary Workaround:
              // Current (imperfect yet) implementation of <Image> overwrites width and height styles
              // (which is not quite correct), and these styles conflict with explicitly set styles
              // of <ImageBackground> and with our internal layout model here.
              // So, we have to proxy/reapply these styles explicitly for actual <Image> component.
              // This workaround should be removed after implementing proper support of
              // intrinsic content size of the <Image>.
              width: style.width,
              height: style.height
            },
            imageStyle
          ]}
        />
        {children}
      </View>
    );
  }
}

export default ImageBackground;
