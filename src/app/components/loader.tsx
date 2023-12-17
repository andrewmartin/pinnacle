'use client';

import React from 'react';
import SpringLoader from 'react-spring-loaders';

const settings = {
  rebound: {
    tension: 14,
    friction: 10,
  },
  spinner: {
    id: 'spinner',
    radius: 90,
    sides: 6,
    depth: 8,
    colors: {
      background: '#000000',
      stroke: null,
      base: null,
      child: 'rgba(26, 10, 128)',
    },
    alwaysForward: true, // When false the spring will reverse normally.
    restAt: null, // A number from 0.1 to 0.9 || null for full rotation
    renderBase: false,
  },
};
export const Loader = () => {
  return <SpringLoader settings={settings} />;
};
