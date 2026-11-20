import React from 'react';
import { Composition } from 'remotion';
import { CaseFile } from './CaseFile';
import script from './script.json';
import durations from './durations.json';
import { buildTimeline, FPS } from './timeline.js';

const TL = buildTimeline(script, durations as Record<string, number>);

export const RemotionRoot: React.FC = () => (
  <Composition
    id="CaseFileEN"
    component={CaseFile}
    durationInFrames={Math.ceil(TL.total * FPS)}
    fps={FPS}
    width={1080}
    height={1920}
    defaultProps={{ music: true, voice: true }}
  />
);
