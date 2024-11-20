import React, { useState } from 'react';
import WebcamDetection from './WebcamDetection';
import AudioDetection from './AudioDetection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Mic } from 'lucide-react';

const LiveDetection = () => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Tabs defaultValue="camera" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="camera" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            Camera Detection
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-2">
            <Mic className="w-4 h-4" />
            Audio Detection
          </TabsTrigger>
        </TabsList>
        <TabsContent value="camera">
          <WebcamDetection />
        </TabsContent>
        <TabsContent value="audio">
          <AudioDetection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LiveDetection;